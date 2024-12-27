import { Injectable } from '@nestjs/common';
import { CreateStockManagementDto } from './dto/create-stock-management.dto';
import { UpdateStockManagementDto } from './dto/update-stock-management.dto';

@Injectable()
export class StockManagementService {
  create(createStockManagementDto: CreateStockManagementDto) {
    return 'This action adds a new stockManagement';
  }

  findAll() {
    return `This action returns all stockManagement`;
  }

  findOne(id: number) {
    return `This action returns a #${id} stockManagement`;
  }

  update(id: number, updateStockManagementDto: UpdateStockManagementDto) {
    return `This action updates a #${id} stockManagement`;
  }

  remove(id: number) {
    return `This action removes a #${id} stockManagement`;
  }
}
