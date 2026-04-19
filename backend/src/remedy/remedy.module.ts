import { Module } from '@nestjs/common';
import { RemedyService } from './remedy.service';
import { RemedyController } from './remedy.controller';

@Module({
  controllers: [RemedyController],
  providers: [RemedyService],
})
export class RemedyModule {}
