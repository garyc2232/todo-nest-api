import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@Controller('/health')
@ApiTags('health')
export class HealthCheckController {
  constructor() {}

  @Get()
  @Get('/ready')
  @ApiOperation({ summary: 'Health Check' })
  @ApiResponse({ status: 200, description: 'successful' })
  async getHealthReady(): Promise<object> {
    return { ready: 'healthy' };
  }

  @Get('/ping')
  @ApiOperation({ summary: 'Health Check for kubernetes' })
  @ApiResponse({ status: 200, description: 'successful' })
  async getHealthPing(): Promise<object> {
    return { ping: { status: 'healthy' } };
  }
}
