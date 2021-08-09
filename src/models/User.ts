import { UserEntity } from "../entities/auth/UserEntity";
import { Field, ObjectType } from "type-graphql";
import { UserRole } from "../entities/auth/UserRole";

interface UserConstructorOptions {
  id: string;
  firstname: string;
  lastname: string;
  role: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

@ObjectType()
export class User {
  @Field()
  public id: string;

  @Field()
  public firstname: string;

  @Field()
  public lastname: string;

  @Field()
  public email: string;

  @Field()
  public role: string;

  @Field()
  public createdAt: Date;

  @Field()
  public updatedAt: Date;

  constructor(options: UserConstructorOptions) {
    this.id = options.id;
    this.firstname = options.firstname;
    this.lastname = options.lastname;
    this.role = options.role;
    this.email = options.email;
    this.createdAt = options.createdAt;
    this.updatedAt = options.updatedAt;
  }

  public static fromEntity(entity: UserEntity): User {
    return new User({
      id: entity.id || "",
      email: entity.email,
      firstname: entity.firstname,
      role: entity.role as UserRole,
      lastname: entity.lastname,
      createdAt: entity.createdAt as Date,
      updatedAt: entity.updatedAt as Date
    });
  }

  public static parse(entity: User): User {
    return new User({
      id: entity.id || "",
      email: entity.email,
      firstname: entity.firstname,
      role: entity.role as UserRole,
      lastname: entity.lastname,
      createdAt: new Date(entity.createdAt),
      updatedAt: new Date(entity.updatedAt)
    });
  }
}
