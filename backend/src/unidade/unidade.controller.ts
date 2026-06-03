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
import { TokenPayloadParam } from '../auth/params/token-payload.param';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';
import { UpdateMicroareaDto } from './dto/update-microarea.dto';
import { CreateMicroareaDto } from './dto/create-microarea.dto';

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
		@TokenPayloadParam() token: TokenPayloadDto,
	) {
		return this.unidadeService.updateUnidade(id, updateUnidadeDto, token);
	}

	@Post()
	createUnidade(@Body() createUnidadeDto: CreateUnidadeDto) {
		return this.unidadeService.criarUnidade(createUnidadeDto);
	}

	@Post(':unidadeId/microarea')
	@Roles(Role.ADMIN, Role.MANAGER)
	createMicroarea(
		@Param('unidadeId') unidadeId: string,
		@Body() createMicroareaDto: CreateMicroareaDto,
	) {
		return this.unidadeService.criarMicroarea(unidadeId, createMicroareaDto);
	}

	@Get(':unidadeId/microarea')
	@Roles(Role.ADMIN, Role.MANAGER)
	findAllMicroareas(@Param('unidadeId') unidadeId: string) {
		return this.unidadeService.buscarTodasMicroareasDaUnidade(unidadeId);
	}

	@Get(':unidadeId/microarea/:microareaId')
	@Roles(Role.ADMIN, Role.MANAGER)
	findOneMicroarea(
		@Param('unidadeId') unidadeId: string,
		@Param('microareaId') microareaId: string,
	) {
		return this.unidadeService.buscarMicroareaPorId(unidadeId, microareaId);
	}

	@Patch(':unidadeId/microarea/:microareaId')
	@Roles(Role.ADMIN, Role.MANAGER)
	updateMicroarea(
		@Param('unidadeId') unidadeId: string,
		@Param('microareaId') microareaId: string,
		@Body() updateMicroareaDto: UpdateMicroareaDto,
	) {
		return this.unidadeService.atualizarMicroarea(
			unidadeId,
			microareaId,
			updateMicroareaDto,
		);
	}

	@Delete(':unidadeId/microarea/:microareaId')
	@Roles(Role.ADMIN)
	deleteMicroarea(
		@Param('unidadeId') unidadeId: string,
		@Param('microareaId') microareaId: string,
	) {
		return this.unidadeService.deletarMicroarea(unidadeId, microareaId);
	}
}
