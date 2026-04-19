import {
	ForbiddenException,
	Injectable,
	NotFoundException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../prisma/prisma.service';
import { usuario } from '../../generated/prisma/client';
import { UpdateUserDto } from '../user/dto/update-user.dto';
import { HashingServiceProtocol } from '../auth/hashing/hashing.service';
import { Prisma, Role } from '@prisma/client';
import { TokenPayloadDto } from '../auth/dto/token-payload.dto';

@Injectable()
export class UserService {
	constructor(
		private prisma: PrismaService,
		private readonly hashingService: HashingServiceProtocol,
	) {}
	throwNotFound(): never {
		throw new NotFoundException('Nao Foi possivel encontrar');
	}

	async createUser(createUserDto: CreateUserDto): Promise<usuario> {
		const unidade = await this.prisma.unidade_saude.findUnique({
			where: { id: createUserDto.id_unidade },
		});
		if (!unidade) {
			throw new Error('Unidade atrelada ao usuario nao existe');
		}

		const hashedPassword = await this.hashingService.hash(
			createUserDto.password,
		);

		const newUser = await this.prisma.usuario.create({
			data: {
				cpf: createUserDto.cpf,
				nome: createUserDto.nome,
				password: hashedPassword,
				email: createUserDto.email,
				atribuicao: createUserDto.atribuicao,
				comprovante: createUserDto.comprovante,
				id_unidade_pertecente: createUserDto.id_unidade,
			},
		});
		return newUser;
	}

	buscarTodosUsers() {
		return this.prisma.usuario.findMany();
	}

	async buscarUser(id: string) {
		const busca = { where: { id: id } };
		const user = await this.prisma.usuario.findUnique(busca);
		if (!user) this.throwNotFound();
		return user;
	}

	async deleteUser(id: string, tokenPayload: TokenPayloadDto) {
		const isAdmin = tokenPayload.role === Role.ADMIN;
		const isOwner = id === tokenPayload.sub;

		if (!isAdmin && !isOwner) {
			throw new ForbiddenException(
				'Voce não tem permissao para excluir esse usuario',
			);
		}
		const busca = { where: { id: id } };
		const usuario = await this.prisma.usuario.findUnique(busca);
		if (!usuario) this.throwNotFound();
		return this.prisma.usuario.delete({ where: { id: id } });
	}

	async updateUser(
		id: string,
		updateUserDto: UpdateUserDto,
		tokenPayload: TokenPayloadDto,
	) {
		const data: Prisma.usuarioUpdateInput = {};
		const isOwner = id === tokenPayload.sub;
		const isAdmin = tokenPayload.role === Role.ADMIN;
		if (!isOwner && !isAdmin) {
			throw new ForbiddenException(
				'Você não tem permissão para editar este usuário.',
			);
		}
		if (updateUserDto.role && !isAdmin) {
			throw new ForbiddenException(
				'Você não tem permissão para alterar níveis de acesso.',
			);
		}

		if (updateUserDto.nome !== undefined) data.nome = updateUserDto.nome;
		if (updateUserDto.email !== undefined) data.email = updateUserDto.email;
		if (updateUserDto.comprovante !== undefined)
			data.comprovante = updateUserDto.comprovante;
		if (updateUserDto.role) data.role = updateUserDto.role;

		if (updateUserDto.password) {
			data.password = await this.hashingService.hash(updateUserDto.password);
		}

		try {
			return await this.prisma.usuario.update({
				where: { id },
				data,
			});
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === 'P2025'
			) {
				throw new NotFoundException(`Usuário com ID ${id} não encontrado`);
			}
			throw error;
		}
	}
}
