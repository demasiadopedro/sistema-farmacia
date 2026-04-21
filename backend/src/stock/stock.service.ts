import {
	Injectable,
	NotFoundException,
	BadRequestException,
} from '@nestjs/common';
import { CreateStockDto } from './dto/create-stock.dto';
import { UpdateStockDto } from './dto/update-stock.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StockService {
	constructor(private readonly prisma: PrismaService) {}

	async create(createStockDto: CreateStockDto) {
		return this.prisma.estoque.create({
			data: createStockDto,
		});
	}

	async findAll() {
		return this.prisma.estoque.findMany();
	}

	async findOne(id: string) {
		const stock = await this.prisma.estoque.findUnique({
			where: { id },
		});

		if (!stock) {
			throw new NotFoundException(
				`Registro de estoque com ID ${id} não encontrado`,
			);
		}

		return stock;
	}

	async update(id: string, updateStockDto: UpdateStockDto) {
		await this.findOne(id);

		return this.prisma.estoque.update({
			where: { id },
			data: updateStockDto,
		});
	}

	async remove(id: string) {
		await this.findOne(id);

		return this.prisma.estoque.delete({
			where: { id },
		});
	}

	async dispensar(id: string, quantidadeDispensada: number) {
		const estoque = await this.findOne(id);

		if (estoque.quantidade < quantidadeDispensada) {
			throw new BadRequestException(
				'Quantidade insuficiente neste lote para a dispensação solicitada.',
			);
		}

		return this.prisma.estoque.update({
			where: { id },
			data: {
				quantidade: {
					decrement: quantidadeDispensada,
				},
			},
		});
	}
}
