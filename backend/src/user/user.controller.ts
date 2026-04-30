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
import { RoleGuard } from '../auth/role/role.guard';
import { Role } from '@prisma/client';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { TokenPayloadParam } from '../auth/params/token-payload.param';
import { AuthTokenGuard } from '../auth/guards/auth-token.guard';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';

@Controller('user')
@UseGuards(JwtAuthGuard, RoleGuard)
export class UserController {
	constructor(private readonly userService: UserService) {}
	@Roles(Role.ADMIN)
	@Post()
	create(@Body() createUserDto: CreateUserDto) {
		return this.userService.createUser(createUserDto);
	}

	// @Roles(Role.ADMIN, Role.MANAGER, Role.USER)
	@Get()
	findAll() {
		return this.userService.buscarTodosUsers();
	}
	// @Roles(Role.ADMIN)
	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.userService.buscarUser(id);
	}
	// @Roles(Role.ADMIN)
	@UseGuards(AuthTokenGuard)
	@Patch(':id')
	update(
		@Param('id') id: string,
		@Body() updateUserDto: UpdateUserDto,
		@TokenPayloadParam() tokenPayload: TokenPayloadDto,
	) {
		return this.userService.updateUser(id, updateUserDto, tokenPayload);
	}
	@Roles(Role.ADMIN)
	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.userService.deleteUser(id);
	}
}
