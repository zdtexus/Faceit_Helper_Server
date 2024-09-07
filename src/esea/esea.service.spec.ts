import { Test, TestingModule } from '@nestjs/testing';
import { EseaService } from './esea.service';

describe('EseaService', () => {
  let service: EseaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EseaService],
    }).compile();

    service = module.get<EseaService>(EseaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
