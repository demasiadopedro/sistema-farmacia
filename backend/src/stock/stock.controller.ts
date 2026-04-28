import {
	Controller,
	Get,
	Post,
	Body,
	Patch,
	Param,
	Delete,
	ParseUUIDPipe,
	UseGuards,
} from '@nestjs/common';
import { StockService } from './stock.service';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { Roles } from '../auth/roles/roles.decorator';
import { Role } from '@prisma/client';

@Controller('stock')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.MANAGER, Role.ADMIN)
export class StockController {
	constructor(private readonly stockService: StockService) {}

	@Post()
	create(@Body() createStockDto: CreateStockDto) {
		return this.stockService.create(createStockDto);
	}

	@Get()
	findAll() {
		return this.stockService.findAll();
	}

	@Get(':id')
	findOne(@Param('id', ParseUUIDPipe) id: string) {
		return this.stockService.findOne(id);
	}

	@Patch(':id')
	update(
		@Param('id', ParseUUIDPipe) id: string,
		@Body() updateStockDto: UpdateStockDto,
	) {
		return this.stockService.update(id, updateStockDto);
	}

	@Delete(':id')
	remove(@Param('id', ParseUUIDPipe) id: string) {
		return this.stockService.remove(id);
	}
}
