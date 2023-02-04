import { AppDataSource } from "../data-source";
import { WinnerDto } from "../dto/WinnerDto";
import { Winner } from "../entity/Winner";

export class WinnerService {
  private winnerRepository = AppDataSource.getRepository(Winner);

  async all(): Promise<Winner[]> {
    return this.winnerRepository.find();
  }

  async save(dto: WinnerDto): Promise<Winner> {
    const WinnerEntity = new Winner(dto.name, dto.avatar, dto.prize);
    return this.winnerRepository.save(WinnerEntity);
  }
}
