import { Test, TestingModule } from '@nestjs/testing';
import { RemedyController } from './remedy.controller';
import { RemedyService } from './remedy.service';

describe('RemedyController', () => {
  let controller: RemedyController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RemedyController],
      providers: [RemedyService],
    }).compile();

    controller = module.get<RemedyController>(RemedyController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
