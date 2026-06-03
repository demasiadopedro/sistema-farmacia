import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Param,
	Body,
	UseGuards,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/createPatient.dto';
import { UpdatePatientDto } from './dto/updatePatient.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '@prisma/client';

@Controller('pacientes')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class PatientController {
	constructor(private readonly patientService: PatientService) {}

	@Post()
	create(@Body() createPatientDto: CreatePatientDto) {
		return this.patientService.createPatient(createPatientDto);
	}
	@Get('/unidade/:id')
	findPatientByUnidade(@Param('id') id: string) {
		return this.patientService.BuscarPacientesUnidade(id);
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.patientService.buscarPatient(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
		return this.patientService.updatePatient(id, updatePatientDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.patientService.deletePatient(id);
	}
}
