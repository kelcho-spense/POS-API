import { Test, TestingModule } from '@nestjs/testing';
import { StockManagementController } from './stock-management.controller';
import { StockManagementService } from './stock-management.service';

describe('StockManagementController', () => {
  let controller: StockManagementController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StockManagementController],
      providers: [StockManagementService],
    }).compile();

    controller = module.get<StockManagementController>(
      StockManagementController,
    );
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
