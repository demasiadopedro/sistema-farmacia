import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
	UseGuards,
} from '@nestjs/common';
import { UnidadeService } from './unidade.service';
import { UpdateUnidadeDto } from './dto/update-user.dto';
import { CreateUnidadeDto } from './dto/create-unidade.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '@prisma/client';
@UseGuards(JwtAuthGuard, RoleGuard)
@Controller('unidade')
@Roles(Role.ADMIN)
export class UnidadeController {
	constructor(private readonly unidadeService: UnidadeService) {}
	@Roles(Role.ADMIN, Role.MANAGER)
	@Get()
	findAll() {
		return this.unidadeService.buscarTodos();
	}
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.unidadeService.buscarUnidade(id);
	}

	@Delete(':id')
	deleteUnidade(@Param('id') id: string) {
		return this.unidadeService.deleteUnidade(id);
	}

	@Patch(':id')
	patchUnidade(
		@Param('id') id: string,
		@Body() updateUnidadeDto: UpdateUnidadeDto,
	) {
		return this.unidadeService.updateUnidade(id, updateUnidadeDto);
	}

	@Post()
	createUnidade(@Body() createUnidadeDto: CreateUnidadeDto) {
		return this.unidadeService.criarUnidade(createUnidadeDto);
	}
}
