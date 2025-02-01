import { Injectable } from '@nestjs/common';
import { CreateDeliveryMethodDto } from './dto/create-delivery-method.dto';
import { GetDeliveryMethodDto } from './dto/get-delivery-method.dto';
import { UpdateDeliveryMethodDto } from './dto/update-delivery-method.dto';
import { PaginateQuery, paginate } from 'nestjs-paginate';
import { DeliveryMethod } from '@app/store';
import { DeliveryMethodsRepository } from './delivery-methods.repository';
import { DELIVERY_METHOD_PAGINATION_CONFIG } from './pagination-config';

@Injectable()
export class DeliveryMethodsService {
  constructor(
    private readonly deliveryMethodsRepository: DeliveryMethodsRepository,
  ) {}

  async create(createDeliveryMethodDto: CreateDeliveryMethodDto) {
    const deliveryMethod = new DeliveryMethod({
      ...createDeliveryMethodDto,
    });

    const result = await this.deliveryMethodsRepository.create(deliveryMethod);

    return this.findOne({ id: result.id });
  }

  async findAll(query: PaginateQuery) {
    return paginate(
      query,
      this.deliveryMethodsRepository.entityRepository,
      DELIVERY_METHOD_PAGINATION_CONFIG,
    );
  }

  async findOne(deliveryMethodDto: GetDeliveryMethodDto) {
    return this.deliveryMethodsRepository.findOne({
      ...deliveryMethodDto,
    });
  }

  async findOneNoCheck(deliveryMethodDto: GetDeliveryMethodDto) {
    return this.deliveryMethodsRepository.findOneNoCheck({
      ...deliveryMethodDto,
    });
  }

  async update(id: number, updateDeliveryMethodDto: UpdateDeliveryMethodDto) {
    const deliveryMethod = await this.findOne({ id });

    // update
    deliveryMethod.delivery_type =
      updateDeliveryMethodDto.delivery_type ?? deliveryMethod.delivery_type;
    deliveryMethod.delivery_charge_type =
      updateDeliveryMethodDto.delivery_charge_type ??
      deliveryMethod.delivery_charge_type;
    deliveryMethod.delivery_pricing_type =
      updateDeliveryMethodDto.delivery_pricing_type ??
      deliveryMethod.delivery_pricing_type;
    deliveryMethod.fixed_price =
      updateDeliveryMethodDto.fixed_price ?? deliveryMethod.fixed_price;
    deliveryMethod.per_kilometer =
      updateDeliveryMethodDto.per_kilometer ?? deliveryMethod.per_kilometer;
    deliveryMethod.delivery_method_area_rules =
      updateDeliveryMethodDto.delivery_method_area_rules;
    deliveryMethod.is_enabled = updateDeliveryMethodDto.is_enabled;
    deliveryMethod.description =
      updateDeliveryMethodDto.description ?? deliveryMethod.description;

    const result = await this.deliveryMethodsRepository.save(deliveryMethod);

    return this.findOne({ id: result.id });
  }

  async remove(id: number) {
    return this.deliveryMethodsRepository.findOneAndDelete({ id });
  }
}
