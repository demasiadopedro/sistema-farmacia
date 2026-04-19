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
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';
import { TokenPayloadParam } from '../auth/params/token-payload.param';
@Controller('user')
export class UserController {
	constructor(private readonly userService: UserService) {}

	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.createUser(createUserDto);
	}

	@UseGuards(AuthTokenGuard)
	@Get()
	findAll() {
		return this.userService.buscarTodosUsers();
	}

	@UseGuards(AuthTokenGuard)
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.buscarUser(id);
	}

	@UseGuards(AuthTokenGuard)
	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
		@TokenPayloadParam() tokenPayload: TokenPayloadDto,
	) {
		return this.userService.updateUser(id, updateUserDto, tokenPayload);
	}

	@UseGuards(AuthTokenGuard)
	@Delete(':id')
	remove(
		@Param('id') id: string,
		@TokenPayloadParam() tokenPayload: TokenPayloadDto,
	) {
		return this.userService.deleteUser(id, tokenPayload);
	}
}
