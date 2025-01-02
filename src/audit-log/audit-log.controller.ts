import { Controller, Get } from '@nestjs/common';
import { AuditLogService } from './audit-log.service';
import { ApiBearerAuth } from '@nestjs/swagger';

@ApiBearerAuth()
@Controller('audit-log')
export class AuditLogController {
  constructor(private readonly auditLogService: AuditLogService) {}

  @Get()
  findAll() {
    return this.auditLogService.findAll();
  }
}
