import { Test } from '@nestjs/testing';
import { HealthCheckController } from './healthCheck.controller';

describe('HealthCheckController', () => {
  let healthCheckController: HealthCheckController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [HealthCheckController],
    }).compile();

    healthCheckController = moduleRef.get<HealthCheckController>(
      HealthCheckController,
    );
  });

  describe('Health Check endpoint tests', () => {
    it('Should return required properties when calling /health/ready', async () => {
      const health = await healthCheckController.getHealthReady();
      expect(health).toEqual({ ready: 'healthy' });
    });

    it('Should return required properties when calling /health/ping', async () => {
      const health = await healthCheckController.getHealthPing();
      expect(health).toEqual({ ping: { status: 'healthy' } });
    });
  });
});
