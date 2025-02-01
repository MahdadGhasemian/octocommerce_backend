import { Controller, Get, Body, Patch, UseGuards } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { UpdateSettingDto } from './dto/update-setting.dto';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import {
  GeneralCache,
  JwtAuthAccessGuard,
  NoCache,
  Serialize,
} from '@app/common';
import { GetSettingDto } from './dto/get-setting.dto';
import { GetAllSettingDto } from './dto/get-all-setting.dto';

@ApiTags('Settings')
@GeneralCache()
@Controller('settings')
export class SettingsController {
  constructor(private readonly settingsService: SettingsService) {}

  @Get()
  @Serialize(GetSettingDto)
  @ApiOkResponse({
    type: GetSettingDto,
  })
  async getSetting() {
    return this.settingsService.readSetting();
  }

  @Get('all')
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetAllSettingDto)
  @NoCache()
  @ApiOkResponse({
    type: GetAllSettingDto,
  })
  async getAllSetting() {
    return this.settingsService.readSetting();
  }

  @Patch()
  @UseGuards(JwtAuthAccessGuard)
  @Serialize(GetAllSettingDto)
  @ApiOkResponse({
    type: GetAllSettingDto,
  })
  async updateOrCreate(@Body() updateSettingDto: UpdateSettingDto) {
    return this.settingsService.updateOrCreate(updateSettingDto);
  }
}
