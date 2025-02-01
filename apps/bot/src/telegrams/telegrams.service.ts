import { Injectable } from '@nestjs/common';
import { TelegramsRepository } from './telegrams.repository';

@Injectable()
export class TelegramsService {
  constructor(private readonly telegramsRepository: TelegramsRepository) {}
}
