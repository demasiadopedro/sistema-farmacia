import { Module } from '@nestjs/common';
import { RemedyService } from './remedy.service';
import { RemedyController } from './remedy.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
	imports: [AuthModule],
	controllers: [RemedyController],
	providers: [RemedyService],
})
export class RemedyModule {}
