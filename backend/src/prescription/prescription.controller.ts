import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseUUIDPipe,
	HttpCode,
	HttpStatus,
} from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';

@Controller('prescription')
export class PrescriptionController {
	constructor(private readonly prescriptionService: PrescriptionService) {}

	@Post()
	create(@Body() createPrescriptionDto: CreatePrescriptionDto) {
		return this.prescriptionService.create(createPrescriptionDto);
	}

	@Get()
	findAll() {
		return this.prescriptionService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		// Removido o "+" que tentava converter a string para number
		return this.prescriptionService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updatePrescriptionDto: UpdatePrescriptionDto,
	) {
		return this.prescriptionService.update(id, updatePrescriptionDto);
	}

	@Delete(':id')
	@HttpCode(HttpStatus.NO_CONTENT) // Retorna 204 sem corpo, padrão ideal para deleção
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.prescriptionService.remove(id);
	}
}
