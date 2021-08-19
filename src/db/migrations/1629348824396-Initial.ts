import { MigrationInterface, QueryRunner } from "typeorm";

export class Initial1629348824396 implements MigrationInterface {
  name = "Initial1629348824396";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE \`auth_tokens\` (\`id\` char(36) NOT NULL, \`email\` varchar(255) NOT NULL, \`code\` varchar(255) NOT NULL, \`expirationTime\` text NOT NULL, \`purpose\` enum ('account_password_reset', 'account_confirmation') NOT NULL DEFAULT 'account_confirmation', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
    await queryRunner.query(
      `CREATE TABLE \`users\` (\`id\` char(36) NOT NULL, \`firstname\` varchar(255) NOT NULL, \`lastname\` varchar(255) NOT NULL, \`email\` varchar(255) NOT NULL, \`password\` text NOT NULL, \`accountStatus\` enum ('account_blocked', 'account_inactive', 'account_active') NOT NULL DEFAULT 'account_inactive', \`role\` enum ('role_client', 'role_admin') NOT NULL DEFAULT 'role_client', \`createdAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), \`updatedAt\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), UNIQUE INDEX \`IDX_97672ac88f789774dd47f7c8be\` (\`email\`), PRIMARY KEY (\`id\`)) ENGINE=InnoDB`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP INDEX \`IDX_97672ac88f789774dd47f7c8be\` ON \`users\``);
    await queryRunner.query(`DROP TABLE \`users\``);
    await queryRunner.query(`DROP TABLE \`auth_tokens\``);
  }
}
