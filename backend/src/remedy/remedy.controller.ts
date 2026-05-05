import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	UseGuards,
} from '@nestjs/common';
import { RemedyService } from './remedy.service';
import { CreateRemedyDto } from './dto/create-remedy.dto';
import { UpdateRemedyDto } from './dto/update-remedy.dto';
import { RoleGuard } from '../auth/role/role.guard';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '@prisma/client';

@Controller('remedy')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.MANAGER, Role.ADMIN)
export class RemedyController {
	constructor(private readonly remedyService: RemedyService) {}

	@Post()
	create(@Body() createRemedyDto: CreateRemedyDto) {
		return this.remedyService.create(createRemedyDto);
	}

	@Get()
	findAll() {
		return this.remedyService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.remedyService.findOne(id);
	}

	@Patch(':id')
	update(@Param('id') id: string, @Body() updateRemedyDto: UpdateRemedyDto) {
		return this.remedyService.update(id, updateRemedyDto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.remedyService.remove(id);
	}
}
