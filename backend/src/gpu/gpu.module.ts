import { Module } from '@nestjs/common';
import { GpuService } from './gpu.service';
import { GpuController } from './gpu.controller';

@Module({
  controllers: [GpuController],
  providers: [GpuService],
  exports: [GpuService],
})
export class GpuModule {}
