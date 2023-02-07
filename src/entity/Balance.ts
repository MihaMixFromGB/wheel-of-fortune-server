import { Entity, PrimaryColumn, Column } from "typeorm";

@Entity("balance")
export class Balance {
  constructor(id: string, balance: number) {
    this.id = id;
    this.balance = balance;
  }

  @PrimaryColumn()
  id: string;

  @Column()
  balance: number;
}
