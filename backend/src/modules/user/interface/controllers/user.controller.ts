import { Body, Controller, Post } from '@nestjs/common';
import { RegisterUserDto } from '../../application/dto/register-user.dto';
import { RegisterUserUseCase } from '../../application/use-cases/rigester-user.use-case';
import { UserRepository } from '../../infrastructure/repositories/user.repository';

@Controller('users')
export class UserController {
  private readonly registerUserUseCase: RegisterUserUseCase;

  constructor(private readonly userRepository: UserRepository) {
    this.registerUserUseCase = new RegisterUserUseCase(userRepository);
  }

  @Post('register')
  async register(@Body() dto: RegisterUserDto) {
    const user = await this.registerUserUseCase.execute(dto);
    return user;
  }
}
