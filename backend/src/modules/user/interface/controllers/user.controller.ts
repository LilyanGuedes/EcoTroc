import { Body, Controller, Post, HttpCode, HttpStatus } from '@nestjs/common';
import { RegisterUserDto } from '../../application/dto/register-user.dto';
import { RegisterUserUseCase } from '../../application/use-cases/rigester-user.use-case';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

@Controller('users')
export class UserController {
  constructor(private readonly repo: UserRepository) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() dto: RegisterUserDto) {
    const uc = new RegisterUserUseCase(this.repo);
    const user = await uc.execute(dto);
    return { id: user.id, name: user.name, email: user.email, role: user.role };
  }
}
