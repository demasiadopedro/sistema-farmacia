import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRemedyDto } from './dto/create-remedy.dto';
import { UpdateRemedyDto } from './dto/update-remedy.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class RemedyService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(createRemedyDto: CreateRemedyDto) {
		return await this.prismaService.medicamento.create({
			data: createRemedyDto,
		});
	}

	async findAll() {
		return await this.prismaService.medicamento.findMany();
	}

	async findOne(id: string) {
		const remedy = await this.prismaService.medicamento.findUnique({
			where: { id },
		});

		if (!remedy) {
			throw new NotFoundException(
				`Medicamento com o ID #${id} não encontrado.`,
			);
		}

		return remedy;
	}

	async update(id: string, updateRemedyDto: UpdateRemedyDto) {
		await this.findOne(id);
		return await this.prismaService.medicamento.update({
			where: { id },
			data: updateRemedyDto,
		});
	}

	async remove(id: string) {
		await this.findOne(id);

		return await this.prismaService.medicamento.delete({
			where: { id },
		});
	}

	// verificarPermissão(tokenPayload: TokenPayloadDto) {
	// 	const isAdmin = tokenPayload.role === Role.ADMIN;

	// 	if (!isAdmin) {
	// 		throw new ForbiddenException(
	// 			'Voce não tem permissao para editar esse medicamento',
	// 		);
	// 	}
	// }
}
