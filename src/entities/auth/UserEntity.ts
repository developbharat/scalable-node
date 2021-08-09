import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { UserRole } from "./UserRole";

@Entity("users")
export class UserEntity {
  @PrimaryGeneratedColumn("uuid")
  id?: string;

  @Column()
  firstname: string;

  @Column()
  lastname: string;

  @Column({ unique: true })
  email: string;

  @Column({ type: "text" })
  password: string;

  @Column({ default: false })
  isEmailVerified?: boolean;

  @Column({ type: "enum", enum: UserRole, default: UserRole.client })
  role?: UserRole;

  @CreateDateColumn()
  createdAt?: Date;

  @UpdateDateColumn()
  updatedAt?: Date;
}
