import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { TokenPurpose } from "./TokenPurpose";

@Entity("auth_tokens")
export class AuthTokenEntity {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  email: string;

  @Column()
  code: string;

  @Column({
    type: "text",
    transformer: { to: (value: string) => `${new Date(value).getTime()}`, from: (value) => new Date(value) }
  })
  expirationTime: Date;

  @Column({ type: "enum", enum: TokenPurpose, default: TokenPurpose.account_activation })
  purpose?: TokenPurpose;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
