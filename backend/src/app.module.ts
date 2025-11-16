import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './modules/user/user.module';
import { config } from 'dotenv';
import { AuthModule } from './modules/auth/auth.module';
import { CollectionModule } from './modules/collection/collection.module';
import { GpuModule } from './gpu/gpu.module';

config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: 5432,
      username: 'postgres',
      password: '123',
      database: 'ecotroc',
      entities: [__dirname + '/**/*.orm-entity.{ts,js}'],
      synchronize: true,
    }),
    UserModule,
    AuthModule,
    CollectionModule,
    GpuModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
