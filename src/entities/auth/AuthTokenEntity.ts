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

  @Column()
  expirationTime: number;

  @Column({ type: "enum", enum: TokenPurpose, default: TokenPurpose.signup_account_activation })
  purpose?: TokenPurpose;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
