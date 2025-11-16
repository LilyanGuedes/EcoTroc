import { Controller, Get, Query } from '@nestjs/common';
import { GpuService } from './gpu.service';

@Controller('gpu')
export class GpuController {
  constructor(private readonly gpuService: GpuService) {}

  @Get('info')
  info() {
    return this.gpuService.getGpuInfo();
  }

  @Get('test')
  test() {
    const weights = [1, 2, 3, 4, 5];
    const points = this.gpuService.calculateRecyclingPoints(weights, 10);

    return {
      message: 'GPU.js funcionando!',
      input: weights,
      output: points,
      ...this.gpuService.getGpuInfo(),
    };
  }

  @Get('benchmark')
  benchmark(@Query('size') size?: string) {
    const arraySize = size ? parseInt(size, 10) : 10000;
    return this.gpuService.benchmark(arraySize);
  }

  @Get('discount')
  discount() {
    const prices = [100, 200, 300, 400, 500];
    const discounted = this.gpuService.applyBulkDiscount(prices, 20);
    
    return {
      original: prices,
      discounted: discounted,
      discount: '20%',
    };
  }
}
