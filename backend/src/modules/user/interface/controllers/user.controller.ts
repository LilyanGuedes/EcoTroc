import { Body, Controller, Post, Get, HttpCode, HttpStatus, UseGuards, Query, Request } from '@nestjs/common';
import { RegisterUserDto } from '../../application/dto/register-user.dto';
import { RegisterUserUseCase } from '../../application/use-cases/rigester-user.use-case';
import { GetUsersUseCase } from '../../application/use-cases/get-users.use-case';
import { RedeemPointsUseCase, RedeemPointsDto } from '../../application/use-cases/redeem-points.use-case';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { Roles } from 'src/common/decorators/roles.decorator';
import { RoleReference } from 'src/shared/domain/role-reference.enum';

@Controller('users')
export class UserController {
  constructor(
    private readonly registerUserUseCase: RegisterUserUseCase,
    private readonly getUsersUseCase: GetUsersUseCase,
    private readonly redeemPointsUseCase: RedeemPointsUseCase,
  ) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.registerUserUseCase.execute(dto);
    return user.toJSON(); // Retorna versão segura sem senha
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleReference.ECOOPERATOR)
  @Get()
  async getUsers(@Query('role') role?: string) {
    const users = await this.getUsersUseCase.execute();

    // Filtrar por role se fornecido
    if (role) {
      return users
        .filter(u => u.role === role)
        .map(u => u.toJSON());
    }

    return users.map(u => u.toJSON());
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(RoleReference.RECYCLER)
  @Post('redeem-points')
  async redeemPoints(@Body() dto: Omit<RedeemPointsDto, 'userId'>, @Request() req) {
    return await this.redeemPointsUseCase.execute({
      ...dto,
      userId: req.user.id,
    });
  }
}
