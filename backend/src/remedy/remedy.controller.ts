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
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';
import { TokenPayloadParam } from '../auth/params/token-payload.param';

@Controller('remedy')
@UseGuards(AuthTokenGuard)
export class RemedyController {
	constructor(private readonly remedyService: RemedyService) {}

	@Post()
	create(
		@Body() createRemedyDto: CreateRemedyDto,
		@TokenPayloadParam() tokenPayload: TokenPayloadDto,
	) {
		return this.remedyService.create(createRemedyDto, tokenPayload);
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
	update(
		@Param('id') id: string,
		@Body() updateRemedyDto: UpdateRemedyDto,
		@TokenPayloadParam() tokenPayload: TokenPayloadDto,
	) {
		return this.remedyService.update(id, updateRemedyDto, tokenPayload);
	}

	@Delete(':id')
	remove(
		@Param('id') id: string,
		@TokenPayloadParam() tokenPayload: TokenPayloadDto,
	) {
		return this.remedyService.remove(id, tokenPayload);
	}
}
