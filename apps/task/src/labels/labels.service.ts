import { Injectable } from '@nestjs/common';
import { LabelsRepository } from './labels.repository';
import { CreateLabelDto } from './dto/create-label.dto';
import { GetLabelDto } from './dto/get-label.dto';
import { UpdateLabelDto } from './dto/update-label.dto';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { LABEL_PAGINATION_CONFIG } from './pagination-config';
import { Label } from '@app/task';

@Injectable()
export class LabelsService {
  constructor(private readonly labelsRepository: LabelsRepository) {}

  async create(createLabelDto: CreateLabelDto) {
    const label = new Label({
      ...createLabelDto,
    });

    const result = await this.labelsRepository.create(label);

    return this.findOne({ id: result.id });
  }

  async findAll(query: PaginateQuery) {
    return paginate(
      query,
      this.labelsRepository.entityRepository,
      LABEL_PAGINATION_CONFIG,
    );
  }

  async findOne(labelDto: GetLabelDto) {
    return this.labelsRepository.findOne(labelDto);
  }

  async read(labelDto: Omit<GetLabelDto, 'images'>) {
    return this.labelsRepository.findOne(labelDto);
  }

  async update(id: number, updateLabelDto: UpdateLabelDto) {
    const updateData: Partial<Label> = {
      ...updateLabelDto,
    };

    const result = await this.labelsRepository.findOneAndUpdate(
      { id },
      { ...updateData },
    );

    return this.findOne({ id: result.id });
  }

  async remove(id: number) {
    return this.labelsRepository.findOneAndDelete({ id });
  }
}
