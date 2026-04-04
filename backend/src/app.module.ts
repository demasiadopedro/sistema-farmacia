import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { PatientModule } from './patient/patient.module';
import { UnidadeModule } from './unidade/unidade.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
	imports: [UserModule, PatientModule, UnidadeModule, PrismaModule],
	controllers: [AppController],
	providers: [AppService],
})
export class AppModule {}
