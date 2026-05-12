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
	UseGuards,
} from '@nestjs/common';
import { PrescriptionService } from './prescription.service';
import { CreatePrescriptionDto } from './dto/create-prescription.dto';
import { UpdatePrescriptionDto } from './dto/update-prescription.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { Roles } from '../auth/roles/roles.decorator';

@Controller('prescription')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles()
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
	@HttpCode(HttpStatus.NO_CONTENT)
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.prescriptionService.remove(id);
	}
}
