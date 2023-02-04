import { AppDataSource } from "../data-source";
import { Balance } from "../entity/Balance";

export class BalanceService {
  private balanceRepository = AppDataSource.getRepository(Balance);

  async one(id: string): Promise<Balance | null> {
    return this.balanceRepository.findOneBy({ id });
  }

  async save(balance: Balance): Promise<Balance> {
    return this.balanceRepository.save(balance);
  }
}
