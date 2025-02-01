import { Test, TestingModule } from '@nestjs/testing';
import { ScrapesController } from './scrapes.controller';
import { ScrapesService } from './scrapes.service';

describe('ScrapesController', () => {
  let controller: ScrapesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScrapesController],
      providers: [ScrapesService],
    }).compile();

    controller = module.get<ScrapesController>(ScrapesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
