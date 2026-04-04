import { PrismaService } from '../src/prisma/prisma.service';
import { UnidadeService } from '../src/unidade/unidade.service';
import { CreateUnidadeDto } from '../src/unidade/dto/create-unidade.dto';
import { Test, TestingModule } from '@nestjs/testing';
import { UpdateUnidadeDto } from '../src/unidade/dto/update-user.dto';

describe('Unidade Service', () => {
	let unidadeService: UnidadeService;
	let prismaService: PrismaService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				UnidadeService,
				{
					provide: PrismaService,
					useValue: {
						unidade_saude: {
							create: jest.fn(), // O mock do Prisma
							findMany: jest.fn(),
							update: jest.fn(),
							findUnique: jest.fn(),
							delete: jest.fn(),
						},
					},
				},
			],
		}).compile();

		unidadeService = module.get<UnidadeService>(UnidadeService);
		prismaService = module.get<PrismaService>(PrismaService);
	});

	describe('create', () => {
		it('deve chamar o prisma.create com os dados corretos', async () => {
			// 1. Arrange (Preparar)
			const unidadeExemplo: CreateUnidadeDto = {
				nome: 'USF FATIMA',
				CEP: 12345678, // ou undefined, se opcional
				numero_edificio: 1536, // ou undefined
				cnes: '1356677',
			};
			await unidadeService.criarUnidade(unidadeExemplo);

			expect(
				// eslint-disable-next-line @typescript-eslint/unbound-method
				prismaService.unidade_saude.create as jest.Mock,
			).toHaveBeenCalledWith({
				data: {
					nome: unidadeExemplo.nome,
					CEP: unidadeExemplo.CEP,
					cnes: unidadeExemplo.cnes,
					numero_edificio: unidadeExemplo.numero_edificio,
				},
			});
		});
	});

	describe('get', () => {
		it('deve retornar os dados anteriores', async () => {
			const unidadeExemplo: CreateUnidadeDto = {
				nome: 'USF FATIMA',
				CEP: 12345678, // ou undefined, se opcional
				numero_edificio: 1536, // ou undefined
				cnes: '1356677',
			};

			const unidadeCriada = { id: '1', ...unidadeExemplo };
			const listaUnidades = [unidadeCriada];

			const findManySpy = jest.spyOn(prismaService.unidade_saude, 'findMany');
			findManySpy.mockResolvedValue(listaUnidades);
			const resultado = await unidadeService.buscarTodos();

			expect(findManySpy).toHaveBeenCalledTimes(1);
			expect(findManySpy).toHaveBeenCalledWith();
			expect(resultado).toEqual(listaUnidades);
		});
	});

	describe('delete', () => {
		it('deve apagar', async () => {
			const unidadeExemplo: CreateUnidadeDto = {
				nome: 'USF FATIMA',
				CEP: 12345678, // ou undefined, se opcional
				numero_edificio: 1536, // ou undefined
				cnes: '1356677',
			};

			const unidadeCriada = { id: '1', ...unidadeExemplo };
			const findUniqueSpy = jest.spyOn(
				prismaService.unidade_saude,
				'findUnique',
			);
			const deleteSpy = jest.spyOn(prismaService.unidade_saude, 'delete');
			findUniqueSpy.mockResolvedValue(unidadeCriada);
			await unidadeService.deleteUnidade('1');

			expect(findUniqueSpy).toHaveBeenCalledTimes(1);
			expect(findUniqueSpy).toHaveBeenCalledWith({
				where: { id: '1' },
			});
			expect(deleteSpy).toHaveBeenCalledTimes(1);
			expect(deleteSpy).toHaveBeenCalledWith({ where: { id: '1' } });
		});
	});

	describe('update', () => {
		it('deve atualizar a unidade', async () => {
			const unidadeExemplo: CreateUnidadeDto = {
				nome: 'USF FATIMA',
				CEP: 12345678, // ou undefined, se opcional
				numero_edificio: 1536, // ou undefined
				cnes: '1356677',
			};

			const unidadeCriada = { id: '1', ...unidadeExemplo };

			const atualizacaoNome: UpdateUnidadeDto = {
				nome: 'USF de pindamonhagaba',
			};

			const unidadeAtualizada = { ...unidadeCriada, ...atualizacaoNome };

			const findUniqueSpy = jest.spyOn(
				prismaService.unidade_saude,
				'findUnique',
			);

			const updateSpy = jest.spyOn(prismaService.unidade_saude, 'update');

			findUniqueSpy.mockResolvedValue(unidadeCriada);
			updateSpy.mockResolvedValue(unidadeAtualizada);
			const resultado = await unidadeService.updateUnidade(
				'1',
				atualizacaoNome,
			);

			// 1. Verifica se o findUnique foi chamado para checar a existência
			expect(findUniqueSpy).toHaveBeenCalledTimes(1);
			expect(findUniqueSpy).toHaveBeenCalledWith({
				where: { id: '1' },
			});

			// 2. Verifica se o update foi chamado com os parâmetros corretos
			expect(updateSpy).toHaveBeenCalledTimes(1);
			expect(updateSpy).toHaveBeenCalledWith({
				where: { id: '1' },
				data: atualizacaoNome,
			});

			// 3. Verifica se o serviço retornou a unidade atualizada
			expect(resultado).toEqual(unidadeAtualizada);
		});
	});
});
