import { Entity, PrimaryGeneratedColumn, Column } from "typeorm";

@Entity("winner")
export class Winner {
  constructor(name: string, avatar: string, prize: string) {
    this.name = name;
    this.avatar = avatar;
    this.prize = prize;
  }

  @PrimaryGeneratedColumn()
  id!: string;

  @Column()
  name: string;

  @Column()
  avatar: string;

  @Column()
  prize: string;
}
