import { Module } from '@nestjs/common';
import { DispensationService } from './dispensation.service';
import { DispensationController } from './dispensation.controller';

@Module({
  controllers: [DispensationController],
  providers: [DispensationService],
})
export class DispensationModule {}
