import { Controller, Post, Body, UseGuards, Get, Param, Request, Inject } from '@nestjs/common';
import { CreateCollectionDto } from '../../application/dto/create-collection.dto';
import { CreateCollectionUseCase } from '../../application/use-cases/create-collection.use-case';
import { DeclareRecyclingUseCase, DeclareRecyclingDto } from '../../application/use-cases/declare-recycling.use-case';
import { RespondToCollectionUseCase, RespondToCollectionDto } from '../../application/use-cases/respond-to-collection.use-case';
import { GetPendingCollectionsUseCase } from '../../application/use-cases/get-pending-collections.use-case';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RoleReference } from 'src/shared/domain/role-reference.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ICollectionRepository } from '../../domain/repositories/collection.repository.interface';

@Controller('collections')
export class CollectionController {
  constructor(
    private readonly createCollectionUseCase: CreateCollectionUseCase,
    private readonly declareRecyclingUseCase: DeclareRecyclingUseCase,
    private readonly respondToCollectionUseCase: RespondToCollectionUseCase,
    private readonly getPendingCollectionsUseCase: GetPendingCollectionsUseCase,
    @Inject('ICollectionRepository')
    private readonly collectionRepository: ICollectionRepository,
  ) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleReference.ECOOPERATOR)
  @Post()
  async create(@Body() dto: CreateCollectionDto): Promise<void> {
    await this.createCollectionUseCase.execute(dto);
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleReference.ECOOPERATOR)
  @Post('declare')
  async declare(@Body() dto: DeclareRecyclingDto, @Request() req): Promise<any> {
    return await this.declareRecyclingUseCase.execute({
      ...dto,
      operatorId: dto.operatorId || req.user.id,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('pending')
  async getPending(@Request() req): Promise<any[]> {
    return await this.getPendingCollectionsUseCase.execute(req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/respond')
  async respond(
    @Param('id') collectionId: string,
    @Body() dto: { accept: boolean },
    @Request() req
  ): Promise<any> {
    return await this.respondToCollectionUseCase.execute({
      collectionId,
      userId: req.user.id,
      accept: dto.accept,
    });
  }

  @UseGuards(JwtAuthGuard)
  @Get('my-collections')
  async getMyCollections(@Request() req): Promise<any[]> {
    const collections = await this.collectionRepository.findByUserId(req.user.id);
    return collections.map(c => c.toJSON());
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleReference.ECOOPERATOR)
  @Get('reports')
  async getReports(@Request() req): Promise<any> {
    const collections = await this.collectionRepository.findAll();

    // Estatísticas gerais
    const totalCollections = collections.length;
    const acceptedCollections = collections.filter(c => c.status === 'accepted').length;
    const pendingCollections = collections.filter(c => c.status === 'pending').length;
    const rejectedCollections = collections.filter(c => c.status === 'rejected').length;

    // Total de material processado
    const totalQuantity = collections
      .filter(c => c.status === 'accepted')
      .reduce((sum, c) => sum + c.quantity, 0);

    // Total de pontos distribuídos
    const totalPoints = collections
      .filter(c => c.status === 'accepted')
      .reduce((sum, c) => sum + c.points, 0);

    // Estatísticas por tipo de material
    const materialStats = {
      PLASTICO: { quantity: 0, points: 0, count: 0 },
      PAPEL: { quantity: 0, points: 0, count: 0 },
      VIDRO: { quantity: 0, points: 0, count: 0 },
      METAL: { quantity: 0, points: 0, count: 0 },
    };

    collections
      .filter(c => c.status === 'accepted')
      .forEach(c => {
        if (materialStats[c.materialType]) {
          materialStats[c.materialType].quantity += c.quantity;
          materialStats[c.materialType].points += c.points;
          materialStats[c.materialType].count += 1;
        }
      });

    // Estatísticas por período (últimos 30 dias)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentCollections = collections.filter(c =>
      new Date(c.createdAt) >= thirtyDaysAgo
    ).length;

    return {
      summary: {
        totalCollections,
        acceptedCollections,
        pendingCollections,
        rejectedCollections,
        totalQuantity: Math.round(totalQuantity * 100) / 100,
        totalPoints,
        recentCollections,
      },
      materialStats,
      collections: collections.map(c => c.toJSON()),
    };
  }
}
