import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { LoginUserDto } from '../../application/dto/login-user.dto';
import { AuthResponseDto } from '../../application/dto/auth-response.dto';
import { LoginUserUseCase } from '../../application/user-cases/login-user.use-case';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly loginUserUseCase: LoginUserUseCase,
  ) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(@Body() dto: LoginUserDto): Promise<AuthResponseDto> {
    return this.loginUserUseCase.execute(dto);
  }
}
