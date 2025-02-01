import { Injectable } from '@nestjs/common';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { SettingsRepository } from './settings.repository';
import { CreateSettingDto } from './dto/create-setting.dto';
import { Setting } from '@app/store';

const SettingId = 1;

@Injectable()
export class SettingsService {
  constructor(private readonly settingsRepository: SettingsRepository) {}

  async create(createSettingDto: CreateSettingDto) {
    const category = new Setting({
      ...createSettingDto,
    });

    return this.settingsRepository.create(category);
  }

  async readSetting() {
    return this.settingsRepository.findOne({ id: SettingId });
  }

  async update(updateSettingDto: UpdateSettingDto) {
    return this.settingsRepository.findOneAndUpdate(
      { id: SettingId },
      {
        ...updateSettingDto,
      },
    );
  }

  async updateOrCreate(updateSettingDto: UpdateSettingDto) {
    const setting = await this.findOneNoCheck();

    if (setting) return this.update(updateSettingDto);
    else
      return this.create({
        ...updateSettingDto,
        id: SettingId,
      } as CreateSettingDto);
  }

  async findOneNoCheck() {
    return this.settingsRepository.findOneNoCheck({ id: SettingId });
  }

  async getSystemSetting() {
    return this.settingsRepository.findOne({ id: SettingId });
  }
}
