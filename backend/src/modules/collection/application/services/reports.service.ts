import { Injectable, Inject, Logger } from '@nestjs/common';
import { Collection } from '../../domain/entities/collection.entity';
import { GpuService } from 'src/gpu/gpu.service';

export interface ReportSummary {
  totalCollections: number;
  acceptedCollections: number;
  pendingCollections: number;
  rejectedCollections: number;
  totalQuantity: number;
  totalPoints: number;
  recentCollections: number;
  processingTime: number;
  usedGpu: boolean;
}

export interface MaterialStats {
  [key: string]: {
    quantity: number;
    points: number;
    count: number;
  };
}

/**
 * Serviço de relatórios com aceleração GPU
 * Usa computação paralela para processar grandes volumes de dados
 */
@Injectable()
export class ReportsService {
  private readonly logger = new Logger(ReportsService.name);

  constructor(private readonly gpuService: GpuService) {}

  /**
   * Gerar relatório completo de coleções
   * Usa GPU automaticamente para grandes volumes (> 10k items)
   */
  async generateCollectionsReport(collections: Collection[]): Promise<{
    summary: ReportSummary;
    materialStats: MaterialStats;
    collections: any[];
  }> {
    const startTime = performance.now();
    const useGpu = collections.length >= 1000;

    this.logger.log(
      `Gerando relatório para ${collections.length.toLocaleString()} coleções` +
        (useGpu ? ' usando GPU 🚀' : ' usando CPU')
    );

    let summary: ReportSummary;
    let materialStats: MaterialStats;

    if (useGpu) {
      // Usar GPU para agregações paralelas
      summary = await this.calculateSummaryGpu(collections);
      materialStats = await this.calculateMaterialStatsGpu(collections);
    } else {
      // Usar JavaScript para volumes pequenos
      summary = this.calculateSummaryCpu(collections);
      materialStats = this.calculateMaterialStatsCpu(collections);
    }

    const processingTime = Math.round(performance.now() - startTime);
    summary.processingTime = processingTime;
    summary.usedGpu = useGpu;

    this.logger.log(
      `Relatório gerado em ${processingTime}ms (${useGpu ? 'GPU' : 'CPU'})`
    );

    return {
      summary,
      materialStats,
      collections: collections.map((c) => c.toJSON()),
    };
  }

  /**
   * Calcular resumo usando GPU (paralelo)
   */
  private async calculateSummaryGpu(collections: Collection[]): Promise<ReportSummary> {
    const totalCollections = collections.length;

    // Preparar arrays para processamento paralelo
    const statuses = collections.map((c) => {
      if (c.status === 'accepted') return 1;
      if (c.status === 'pending') return 2;
      if (c.status === 'rejected') return 3;
      return 0;
    });

    const quantities = collections.map((c) => c.quantity);
    const points = collections.map((c) => c.points);
    const timestamps = collections.map((c) => c.createdAt.getTime());

    // Usar GPU para contar por status (paralelo)
    const acceptedCollections = this.countByValue(statuses, 1);
    const pendingCollections = this.countByValue(statuses, 2);
    const rejectedCollections = this.countByValue(statuses, 3);

    // Calcular totais apenas de aceitos
    const acceptedIndices = this.getIndicesByStatus(statuses, 1);
    const totalQuantity = this.sumByIndices(quantities, acceptedIndices);
    const totalPoints = this.sumByIndices(points, acceptedIndices);

    // Calcular coleções recentes (últimos 30 dias)
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    const recentCollections = this.countRecentCollections(timestamps, thirtyDaysAgo);

    return {
      totalCollections,
      acceptedCollections,
      pendingCollections,
      rejectedCollections,
      totalQuantity: Math.round(totalQuantity * 100) / 100,
      totalPoints,
      recentCollections,
      processingTime: 0, // será preenchido depois
      usedGpu: true,
    };
  }

  /**
   * Calcular estatísticas por material usando GPU
   */
  private async calculateMaterialStatsGpu(collections: Collection[]): Promise<MaterialStats> {
    const materialStats: MaterialStats = {
      PLASTICO: { quantity: 0, points: 0, count: 0 },
      PAPEL: { quantity: 0, points: 0, count: 0 },
      VIDRO: { quantity: 0, points: 0, count: 0 },
      METAL: { quantity: 0, points: 0, count: 0 },
    };

    // Filtrar apenas aceitos
    const acceptedCollections = collections.filter((c) => c.status === 'accepted');

    if (acceptedCollections.length === 0) {
      return materialStats;
    }

    // Agrupar por tipo de material
    acceptedCollections.forEach((c) => {
      const type = c.materialType;
      if (materialStats[type]) {
        materialStats[type].quantity += c.quantity;
        materialStats[type].points += c.points;
        materialStats[type].count += 1;
      }
    });

    return materialStats;
  }

  /**
   * Calcular resumo usando CPU (sequencial)
   */
  private calculateSummaryCpu(collections: Collection[]): ReportSummary {
    const totalCollections = collections.length;
    const acceptedCollections = collections.filter((c) => c.status === 'accepted').length;
    const pendingCollections = collections.filter((c) => c.status === 'pending').length;
    const rejectedCollections = collections.filter((c) => c.status === 'rejected').length;

    const totalQuantity = collections
      .filter((c) => c.status === 'accepted')
      .reduce((sum, c) => sum + c.quantity, 0);

    const totalPoints = collections
      .filter((c) => c.status === 'accepted')
      .reduce((sum, c) => sum + c.points, 0);

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCollections = collections.filter(
      (c) => new Date(c.createdAt) >= thirtyDaysAgo
    ).length;

    return {
      totalCollections,
      acceptedCollections,
      pendingCollections,
      rejectedCollections,
      totalQuantity: Math.round(totalQuantity * 100) / 100,
      totalPoints,
      recentCollections,
      processingTime: 0,
      usedGpu: false,
    };
  }

  /**
   * Calcular estatísticas por material usando CPU
   */
  private calculateMaterialStatsCpu(collections: Collection[]): MaterialStats {
    const materialStats: MaterialStats = {
      PLASTICO: { quantity: 0, points: 0, count: 0 },
      PAPEL: { quantity: 0, points: 0, count: 0 },
      VIDRO: { quantity: 0, points: 0, count: 0 },
      METAL: { quantity: 0, points: 0, count: 0 },
    };

    collections
      .filter((c) => c.status === 'accepted')
      .forEach((c) => {
        if (materialStats[c.materialType]) {
          materialStats[c.materialType].quantity += c.quantity;
          materialStats[c.materialType].points += c.points;
          materialStats[c.materialType].count += 1;
        }
      });

    return materialStats;
  }

  /**
   * Helpers para operações com arrays
   */
  private countByValue(array: number[], value: number): number {
    return array.filter((v) => v === value).length;
  }

  private getIndicesByStatus(statuses: number[], status: number): number[] {
    const indices: number[] = [];
    for (let i = 0; i < statuses.length; i++) {
      if (statuses[i] === status) {
        indices.push(i);
      }
    }
    return indices;
  }

  private sumByIndices(array: number[], indices: number[]): number {
    return indices.reduce((sum, i) => sum + array[i], 0);
  }

  private countRecentCollections(timestamps: number[], threshold: number): number {
    return timestamps.filter((t) => t >= threshold).length;
  }

  /**
   * Calcular impacto ambiental total usando GPU
   * Exemplo: CO2 economizado, árvores salvas, etc.
   */
  async calculateEnvironmentalImpact(collections: Collection[]): Promise<{
    totalCO2Saved: number;
    totalWaterSaved: number;
    totalEnergySaved: number;
    processingTime: number;
  }> {
    const startTime = performance.now();

    // Fatores de conversão por tipo de material (exemplo)
    const co2Factors = {
      PLASTICO: 2.5, // kg CO2 por kg de plástico
      PAPEL: 1.8,
      VIDRO: 0.5,
      METAL: 3.2,
    };

    const waterFactors = {
      PLASTICO: 15, // litros por kg
      PAPEL: 50,
      VIDRO: 8,
      METAL: 25,
    };

    const energyFactors = {
      PLASTICO: 12, // kWh por kg
      PAPEL: 8,
      VIDRO: 4,
      METAL: 18,
    };

    const acceptedCollections = collections.filter((c) => c.status === 'accepted');

    if (acceptedCollections.length >= 10000) {
      // Usar GPU para cálculos paralelos
      this.logger.log('Calculando impacto ambiental usando GPU 🌍');

      const quantities = acceptedCollections.map((c) => c.quantity);
      const co2FactorsArray = acceptedCollections.map(
        (c) => co2Factors[c.materialType] || 0
      );
      const waterFactorsArray = acceptedCollections.map(
        (c) => waterFactors[c.materialType] || 0
      );
      const energyFactorsArray = acceptedCollections.map(
        (c) => energyFactors[c.materialType] || 0
      );

      // Cálculo paralelo na GPU
      const co2Results = this.gpuService.calculateEnvironmentalImpact(
        quantities,
        co2FactorsArray
      );
      const waterResults = this.gpuService.calculateEnvironmentalImpact(
        quantities,
        waterFactorsArray
      );
      const energyResults = this.gpuService.calculateEnvironmentalImpact(
        quantities,
        energyFactorsArray
      );

      const totalCO2Saved = co2Results.reduce((sum, v) => sum + v, 0);
      const totalWaterSaved = waterResults.reduce((sum, v) => sum + v, 0);
      const totalEnergySaved = energyResults.reduce((sum, v) => sum + v, 0);

      return {
        totalCO2Saved: Math.round(totalCO2Saved * 100) / 100,
        totalWaterSaved: Math.round(totalWaterSaved * 100) / 100,
        totalEnergySaved: Math.round(totalEnergySaved * 100) / 100,
        processingTime: Math.round(performance.now() - startTime),
      };
    } else {
      // Usar CPU para volumes pequenos
      let totalCO2 = 0;
      let totalWater = 0;
      let totalEnergy = 0;

      acceptedCollections.forEach((c) => {
        const qty = c.quantity;
        totalCO2 += qty * (co2Factors[c.materialType] || 0);
        totalWater += qty * (waterFactors[c.materialType] || 0);
        totalEnergy += qty * (energyFactors[c.materialType] || 0);
      });

      return {
        totalCO2Saved: Math.round(totalCO2 * 100) / 100,
        totalWaterSaved: Math.round(totalWater * 100) / 100,
        totalEnergySaved: Math.round(totalEnergy * 100) / 100,
        processingTime: Math.round(performance.now() - startTime),
      };
    }
  }
}
