import { Controller, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { DispensationService } from './dispensation.service';
import { CreateDispensationDto } from './dto/create-dispensation.dto';
import { ReturnDispensationDto } from './dto/return-dispensation.dto';

@Controller('dispensation')
export class DispensationController {
	constructor(private readonly dispensationService: DispensationService) {}

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
