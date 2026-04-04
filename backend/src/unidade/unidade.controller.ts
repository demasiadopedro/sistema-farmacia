import {
	Body,
	Controller,
	Delete,
	Get,
	Param,
	Patch,
	Post,
} from '@nestjs/common';
import { UnidadeService } from './unidade.service';
import { UpdateUnidadeDto } from './dto/update-user.dto';
import { CreateUnidadeDto } from './dto/create-unidade.dto';

@Controller('unidade')
export class UnidadeController {
	constructor(private readonly unidadeService: UnidadeService) {}
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
