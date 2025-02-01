import { Injectable } from '@nestjs/common';
import { WalletsRepository } from './wallets.repository';
import { IdentifierQuery } from '@app/common';
import { CreateWalletDto } from './dto/create-wallet.dto';
import { GetWalletDto } from './dto/get-wallet.dto';
import { UpdateWalletDto } from './dto/update-wallet.dto';
import { User, Wallet } from '@app/store';

@Injectable()
export class WalletsService {
  constructor(private readonly walletsRepository: WalletsRepository) {}

  async create(createWalletDto: CreateWalletDto, user: User) {
    const wallet = new Wallet({
      ...createWalletDto,
      user_id: user.id,
    });

    const result = await this.walletsRepository.create(wallet);

    return this.findOne({ id: result.id }, user);
  }

  async findOne(walletDto: GetWalletDto, user: Partial<User>) {
    try {
      const wallet = await this.walletsRepository.findOne({
        ...walletDto,
        user_id: user.id,
      });

      return wallet;
    } catch (error) {
      return { balance: 0 };
    }
  }

  async update(
    id: number,
    updateWalletDto: UpdateWalletDto,
    identifierQuery: IdentifierQuery,
  ) {
    const updateData: Partial<Wallet> = {
      ...updateWalletDto,
    };

    const result = await this.walletsRepository.findOneAndUpdate(
      { id, ...identifierQuery },
      { ...updateData },
    );

    return this.findOne({ id: result.id }, { id: identifierQuery.user_id });
  }

  async remove(id: number, identifierQuery: IdentifierQuery) {
    return this.walletsRepository.findOneAndDelete({ id, ...identifierQuery });
  }
}
