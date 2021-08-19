import { MigrationInterface, QueryRunner } from "typeorm";
import { __TEST__ } from "../../constants";

export class TestSetup1629350287189 implements MigrationInterface {
  name = "TestSetup1629350287189";

  public async up(queryRunner: QueryRunner): Promise<void> {
    if (__TEST__) {
      await queryRunner.query(
        "INSERT INTO users (`id`, `firstname`, `lastname`, `email`, `password`, `accountStatus`, `role`) VALUES('1', 'Jayant', 'Malik', 'user1@mail.com', '$argon2i$v=19$m=4096,t=3,p=1$KspchaoFlXO6wNIDi+K7sA$dG5bupo677BuaXVZuSaj8Ct5FAuhgP5JuKUcwTSwe60', 'account_active', 'role_client');"
      );
    }
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    if (__TEST__) {
      await queryRunner.query("DELETE FROM users WHERE email='user1@mail.com';");
    }
  }
}
