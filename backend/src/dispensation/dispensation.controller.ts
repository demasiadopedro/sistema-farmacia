import {
	Controller,
	Get,
	Post,
	Body,
	Param,
	ParseUUIDPipe,
	UseGuards,
} from '@nestjs/common';
import { DispensationService } from './dispensation.service';
import { CreateDispensationDto } from './dto/create-dispensation.dto';
import { ReturnDispensationDto } from './dto/return-dispensation.dto';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role/role.guard';

@Controller('dispensation')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.ADMIN, Role.MANAGER)
export class DispensationController {
	constructor(private readonly dispensationService: DispensationService) {}

	@Get('unidade/:id')
	findAllByUnidade(@Param('id', ParseUUIDPipe) id: string) {
		return this.dispensationService.findAllByUnidade(id);
	}

	@Post()
	create(@Body() createDispensationDto: CreateDispensationDto) {
		return this.dispensationService.create(createDispensationDto);
	}

	@Post(':id/reverse')
	reverseDispensation(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() returnDispensationDto: ReturnDispensationDto,
	) {
		return this.dispensationService.reverseDispensation(
			id,
			returnDispensationDto,
		);
	}
}
