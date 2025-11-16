import { Injectable, Logger } from '@nestjs/common';
import { GPU } from 'gpu.js';

@Injectable()
export class GpuService {
  private readonly logger = new Logger(GpuService.name);
  private gpu: GPU;
  private mode: string;

  // Cache de kernels para evitar recompilação
  private kernelCache = new Map<string, any>();

  constructor() {
    // Tentar usar GPU real, com fallback para CPU
    try {
      this.gpu = new GPU({ mode: 'gpu' });
      this.mode = this.gpu.mode;

      // Testar se GPU está realmente funcionando
      const testKernel = this.gpu.createKernel(function() {
        return 1;
      }).setOutput([1]);

      testKernel();

      this.logger.log(`✅ GPU Service inicializado em modo: ${this.mode.toUpperCase()}`);

      if (this.mode === 'gpu') {
        this.logger.log('🚀 Usando aceleração por GPU (WebGL)!');
      } else if (this.mode === 'webgl2') {
        this.logger.log('🚀 Usando aceleração por GPU (WebGL2)!');
      } else {
        this.logger.warn('⚠️  GPU não disponível, usando modo: ' + this.mode);
      }

      // Pré-compilar kernels comuns
      this.precompileKernels();
    } catch (error) {
      this.logger.warn('⚠️  Erro ao inicializar GPU, usando modo CPU');
      this.logger.warn(`Erro: ${error.message}`);
      this.gpu = new GPU({ mode: 'cpu' });
      this.mode = 'cpu';
    }
  }

  /**
   * Pré-compilar kernels mais usados
   */
  private precompileKernels(): void {
    this.logger.log('Pré-compilando kernels...');

    // Kernel de multiplicação simples
    this.kernelCache.set('multiply', this.gpu.createKernel(function(arr: number[], multiplier: number) {
      return arr[this.thread.x] * multiplier;
    }));

    // Kernel de desconto
    this.kernelCache.set('discount', this.gpu.createKernel(function(prices: number[], discount: number) {
      const price = prices[this.thread.x];
      return price - (price * discount / 100);
    }));

    // Kernel de impacto ambiental
    this.kernelCache.set('environmental', this.gpu.createKernel(function(footprints: number[], weights: number[]) {
      return footprints[this.thread.x] * weights[this.thread.x];
    }));

    // Kernel de benchmark
    this.kernelCache.set('benchmark', this.gpu.createKernel(function(a: number[]) {
      return a[this.thread.x] * 2 + Math.sqrt(a[this.thread.x]);
    }));

    this.logger.log(`✅ ${this.kernelCache.size} kernels pré-compilados`);
  }

  /**
   * Calcular pontos de reciclagem em massa
   * Útil para processar múltiplas transações de uma vez
   */
  calculateRecyclingPoints(
    weights: number[],
    multiplier: number = 10,
  ): number[] {
    // Para arrays pequenos, usar JS puro (mais rápido)
    if (weights.length < 10000) {
      return weights.map(w => w * multiplier);
    }

    // Para arrays grandes, usar GPU com cache
    const cacheKey = `multiply_${weights.length}`;
    let kernel = this.kernelCache.get(cacheKey);

    if (!kernel) {
      kernel = this.gpu.createKernel(function(arr: number[], multiplier: number) {
        return arr[this.thread.x] * multiplier;
      }).setOutput([weights.length]);
      this.kernelCache.set(cacheKey, kernel);
    }

    return Array.from(kernel(weights, multiplier) as Float32Array);
  }

  /**
   * Aplicar desconto em múltiplos produtos
   */
  applyBulkDiscount(prices: number[], discountPercent: number): number[] {
    // Para arrays pequenos, usar JS puro
    if (prices.length < 10000) {
      return prices.map(p => p - (p * discountPercent / 100));
    }

    // Para arrays grandes, usar GPU
    const cacheKey = `discount_${prices.length}`;
    let kernel = this.kernelCache.get(cacheKey);

    if (!kernel) {
      kernel = this.gpu.createKernel(function(prices: number[], discount: number) {
        const price = prices[this.thread.x];
        return price - (price * discount / 100);
      }).setOutput([prices.length]);
      this.kernelCache.set(cacheKey, kernel);
    }

    return Array.from(kernel(prices, discountPercent) as Float32Array);
  }

  /**
   * Calcular impacto ambiental baseado em múltiplos fatores
   */
  calculateEnvironmentalImpact(
    carbonFootprints: number[],
    weights: number[],
  ): number[] {
    if (carbonFootprints.length !== weights.length) {
      throw new Error('Arrays devem ter o mesmo tamanho');
    }

    // Para arrays pequenos, usar JS puro
    if (carbonFootprints.length < 10000) {
      return carbonFootprints.map((cf, i) => cf * weights[i]);
    }

    // Para arrays grandes, usar GPU
    const cacheKey = `environmental_${carbonFootprints.length}`;
    let kernel = this.kernelCache.get(cacheKey);

    if (!kernel) {
      kernel = this.gpu.createKernel(function(footprints: number[], weights: number[]) {
        return footprints[this.thread.x] * weights[this.thread.x];
      }).setOutput([carbonFootprints.length]);
      this.kernelCache.set(cacheKey, kernel);
    }

    return Array.from(kernel(carbonFootprints, weights) as Float32Array);
  }

  /**
   * Processar matriz de recomendações
   * Calcula similaridade entre produtos/usuários
   */
  calculateSimilarityMatrix(
    vectors: number[][],
  ): number[][] {
    const size = vectors.length;

    const kernel = this.gpu
      .createKernel(function (vectors: number[][]) {
        let dotProduct = 0;
        let normA = 0;
        let normB = 0;

        // Calcular similaridade do cosseno
        for (let i = 0; i < 10; i++) {
          const a = vectors[this.thread.y][i];
          const b = vectors[this.thread.x][i];
          dotProduct += a * b;
          normA += a * a;
          normB += b * b;
        }

        const denominator = Math.sqrt(normA) * Math.sqrt(normB);
        if (denominator === 0) return 0;
        return dotProduct / denominator;
      })
      .setOutput([size, size]);

    return kernel(vectors) as number[][];
  }

  /**
   * Obter informações sobre o modo GPU
   */
  getGpuInfo(): { mode: string; isGpuAccelerated: boolean } {
    const isAccelerated = this.mode === 'gpu' || this.mode === 'webgl' || this.mode === 'webgl2';
    return {
      mode: this.mode,
      isGpuAccelerated: isAccelerated,
    };
  }

  /**
   * Exemplo de benchmark
   */
  benchmark(size: number = 10000): { gpu: number; js: number; mode: string; speedup: string } {
    const data = Array.from({ length: size }, (_, i) => i + 1);

    // Teste GPU - criar kernel com tamanho específico
    const gpuStart = performance.now();

    // Usar cache por tamanho
    const cacheKey = `benchmark_${size}`;
    let kernel = this.kernelCache.get(cacheKey);

    if (!kernel) {
      kernel = this.gpu.createKernel(function(a: number[]) {
        return a[this.thread.x] * 2 + Math.sqrt(a[this.thread.x]);
      }).setOutput([size]);
      this.kernelCache.set(cacheKey, kernel);
    }

    kernel(data);
    const gpuTime = Math.round(performance.now() - gpuStart);

    // Teste JS normal
    const jsStart = performance.now();
    data.map((x) => x * 2 + Math.sqrt(x));
    const jsTime = Math.round(performance.now() - jsStart);

    const speedup = jsTime > 0 && gpuTime > 0 ? (jsTime / gpuTime).toFixed(2) : 'N/A';
    const winner = gpuTime < jsTime ? 'GPU' : 'JavaScript';

    this.logger.log(
      `Benchmark (${size.toLocaleString()} items): GPU=${gpuTime}ms, JS=${jsTime}ms, Speedup=${speedup}x, Winner=${winner}`,
    );

    return {
      gpu: gpuTime,
      js: jsTime,
      mode: this.mode,
      speedup: speedup + 'x (' + winner + ' faster)',
    };
  }

  /**
   * Limpar recursos
   */
  onModuleDestroy() {
    this.gpu.destroy();
    this.logger.log('GPU Service destruído');
  }
}
