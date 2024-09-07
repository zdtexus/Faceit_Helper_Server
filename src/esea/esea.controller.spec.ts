import { Test, TestingModule } from '@nestjs/testing';
import { EseaController } from './esea.controller';
import { EseaService } from './esea.service';

describe('EseaController', () => {
  let controller: EseaController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EseaController],
      providers: [EseaService],
    }).compile();

    controller = module.get<EseaController>(EseaController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
