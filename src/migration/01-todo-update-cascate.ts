import { MigrationInterface, QueryRunner } from "typeorm";

export class PostRefactoringTIMESTAMP implements MigrationInterface {
	async up(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query(
			`ALTER TABLE "post" RENAME COLUMN "title" TO "name"`,
		);
	}

	async down(queryRunner: QueryRunner): Promise<any> {
		await queryRunner.query(
			`ALTER TABLE "post" RENAME COLUMN "name" TO "title"`,
		); // reverts things made in "up" method
	}
}
