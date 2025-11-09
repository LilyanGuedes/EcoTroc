import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserOrmEntity } from '../user/infrastructure/orm/user.orm-entity';
import { UserRepository } from '../user/infrastructure/repositories/user.repository';
import { AuthController } from './interface/controllers/auth.controller';
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy';
import { jwtConstants } from './constants/jwt.constants';
import { LoginUserUseCase } from './application/user-cases/login-user.use-case';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: jwtConstants.expiresIn },
    }),
    TypeOrmModule.forFeature([UserOrmEntity]),
  ],
  providers: [
    UserRepository,
    JwtStrategy,
    LoginUserUseCase,
    {
      provide: 'IUserRepository',
      useClass: UserRepository,
    },
  ],
  controllers: [AuthController],
  exports: [PassportModule, JwtModule, LoginUserUseCase],
})
export class AuthModule {}
