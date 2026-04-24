import {
	Controller,
	Get,
	Post,
	Patch,
	Delete,
	Param,
	Body,
} from '@nestjs/common';
import { PatientService } from './patient.service';
import { CreatePatientDto } from './dto/createPatient.dto';
import { UpdatePatientDto } from './dto/updatePatient.dto';

@Controller('pacientes')
export class PatientController {
	constructor(private readonly patientService: PatientService) {}

	@Post()
	create(@Body() createPatientDto: CreatePatientDto) {
		return this.patientService.createPatient(createPatientDto);
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
