import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { CreateCollectionDto } from '../../application/dto/create-collection.dto';
import { CollectionRepository } from '../../infrastructure/repositories/collection.repository';
import { CreateCollectionUseCase } from '../../application/use-cases/create-collection.use-case';
import { UserPointsRepository } from 'src/modules/user-points/infrastructure/repositories/user-points.repository';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { RoleReference } from 'src/shared/domain/role-reference.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';


@Controller('collections')
export class CollectionController {
  constructor(
    private readonly collectionRepo: CollectionRepository,
    private readonly userPointsRepo: UserPointsRepository,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard) // protege a rota
  @Roles(RoleReference.ECOOPERATOR)   
  @Post()
  async create(@Body() dto: CreateCollectionDto): Promise<void> {
    const uc = new CreateCollectionUseCase(
      this.collectionRepo,
      this.userPointsRepo,
    );
    await uc.execute(dto);
  }
}
