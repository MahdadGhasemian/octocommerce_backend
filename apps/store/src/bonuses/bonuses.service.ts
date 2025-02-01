import { Injectable } from '@nestjs/common';
import { BonusesRepository } from './bonuses.repository';
import { CreateBonusDto } from './dto/create-bonus.dto';
import { GetBonusDto } from './dto/get-bonus.dto';
import { UpdateBonusDto } from './dto/update-bonus.dto';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { BONUS_PAGINATION_CONFIG } from './pagination-config';
import { LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import { Bonus, Product, User } from '@app/store';

@Injectable()
export class BonusesService {
  constructor(private readonly bonusesRepository: BonusesRepository) {}

  async create(createBonusDto: CreateBonusDto) {
    const bonus = new Bonus({
      ...createBonusDto,
      allowed_users: createBonusDto.allowed_user_ids?.map(
        (id) => new User({ id }),
      ),
      allowed_products: createBonusDto.allowed_product_ids?.map(
        (id) => new Product({ id }),
      ),
    });

    const result = await this.bonusesRepository.create(bonus);

    return this.findOne({ id: result.id });
  }

  async findAll(query: PaginateQuery) {
    return paginate(
      query,
      this.bonusesRepository.entityRepository,
      BONUS_PAGINATION_CONFIG,
    );
  }

  async findOne(
    bonusDto: Omit<GetBonusDto, 'allowed_users' | 'allowed_products'>,
  ) {
    return this.bonusesRepository.findOne(bonusDto, {
      allowed_users: true,
      allowed_products: true,
    });
  }

  async update(id: number, updateBonusDto: UpdateBonusDto) {
    const bonus = await this.findOne({ id });

    // Update main properties
    bonus.title = updateBonusDto.title ?? bonus.title;
    bonus.description = updateBonusDto.description ?? bonus.description;
    bonus.bonus_type = updateBonusDto.bonus_type ?? bonus.bonus_type;
    bonus.constant_amount =
      updateBonusDto.constant_amount ?? bonus.constant_amount;
    bonus.percentage_amount =
      updateBonusDto.percentage_amount ?? bonus.percentage_amount;
    bonus.is_enabled = updateBonusDto.is_enabled ?? bonus.is_enabled;
    bonus.start_date = updateBonusDto.start_date ?? bonus.start_date;
    bonus.end_date = updateBonusDto.end_date ?? bonus.end_date;

    // Update allowed_users relation
    if (updateBonusDto.allowed_user_ids) {
      bonus.allowed_users = updateBonusDto.allowed_user_ids.map(
        (id) => new User({ id }),
      );
    }

    // Update allowed_products relation
    if (updateBonusDto.allowed_product_ids) {
      bonus.allowed_products = updateBonusDto.allowed_product_ids.map(
        (id) => new Product({ id }),
      );
    }

    // Save the updated Bonus entity
    const result = await this.bonusesRepository.save(bonus);

    return this.findOne({ id: result.id });
  }

  async remove(id: number) {
    return this.bonusesRepository.findOneAndDelete({ id });
  }

  async findOneByDateRange(user_id: number, product_id: number) {
    const currentDate = new Date();

    return this.bonusesRepository.findOneNoCheck({
      is_enabled: true,
      start_date: LessThanOrEqual(currentDate),
      end_date: MoreThanOrEqual(currentDate),
      allowed_users: { id: user_id },
      allowed_products: { id: product_id },
    });
  }
}
