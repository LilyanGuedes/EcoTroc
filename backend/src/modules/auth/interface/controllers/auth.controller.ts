import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginUserDto } from '../../application/dto/login-user.dto';
import { AuthResponseDto } from '../../application/dto/auth-response.dto';
import { UserRepository } from '../../../user/infrastructure/repositories/user.repository';
import { LoginUserUseCase } from '../../application/user-cases/login-user.use-case';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly userRepo: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginUserDto): Promise<AuthResponseDto> {
    const uc = new LoginUserUseCase(this.userRepo, this.jwtService);
    return uc.execute(dto);
  }
}
