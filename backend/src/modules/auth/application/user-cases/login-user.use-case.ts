import { Injectable, Inject } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { IUserRepository } from 'src/modules/user/domain/repositories/user.repository.interface';
import { LoginUserDto } from '../dto/login-user.dto';
import { AuthResponseDto } from '../dto/auth-response.dto';

@Injectable()
export class LoginUserUseCase {
  constructor(
    @Inject('IUserRepository')
    private readonly userRepo: IUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(dto: LoginUserDto): Promise<AuthResponseDto> {
    const user = await this.userRepo.findByEmail(dto.email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Entidade User agora verifica sua própria senha
    const isPasswordValid = await user.verifyPassword(dto.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      role: user.role
    };

    return {
      accessToken: await this.jwtService.signAsync(payload)
    };
  }
}