import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateRemedyDto } from './dto/create-remedy.dto';
import { UpdateRemedyDto } from './dto/update-remedy.dto';
import { PrismaService } from '../prisma/prisma.service';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';
import { Role } from '@prisma/client';

@Injectable()
export class RemedyService {
	constructor(private readonly prismaService: PrismaService) {}

	async create(
		createRemedyDto: CreateRemedyDto,
		tokenPayload: TokenPayloadDto,
	) {
		this.verificarPermissão(tokenPayload);
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

	async update(
		id: string,
		updateRemedyDto: UpdateRemedyDto,
		tokenPayload: TokenPayloadDto,
	) {
		this.verificarPermissão(tokenPayload);
		await this.findOne(id);
		return await this.prismaService.medicamento.update({
			where: { id },
			data: updateRemedyDto,
		});
	}

	async remove(id: string, tokenPayload: TokenPayloadDto) {
		this.verificarPermissão(tokenPayload);
		await this.findOne(id);

		return await this.prismaService.medicamento.delete({
			where: { id },
		});
	}

	verificarPermissão(tokenPayload: TokenPayloadDto) {
		const isAdmin = tokenPayload.role === Role.ADMIN;

		if (!isAdmin) {
			throw new ForbiddenException(
				'Voce não tem permissao para editar esse medicamento',
			);
		}
	}
}
