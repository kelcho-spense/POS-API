import { Injectable } from '@nestjs/common';

@Injectable()
export class AuditLogService {
  findAll() {
    return `This action returns all auditLog`;
  }
}
