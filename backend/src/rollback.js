import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Sequelize } from "sequelize";
import sequelize from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function rollbackMigration() {
  try {
    const queryInterface = sequelize.getQueryInterface();

    const [executedMigrations] = await sequelize.query(
      'SELECT "name" FROM "SequelizeMeta" ORDER BY "name" DESC',
    );
 
    if (executedMigrations.length === 0) {
      console.log("No migrations to rollback.");
      return;
    }

    const latestMigration = executedMigrations[0].name;
    console.log(`Rolling back: ${latestMigration}`);

    const migrationsPath = path.join(__dirname, "migrations");
    const migrationPath = path.join(migrationsPath, latestMigration);

    if (!fs.existsSync(migrationPath)) {
      throw new Error(`Migration file not found: ${latestMigration}`);
    }

    const migration = await import(migrationPath);
    await migration.down(queryInterface, Sequelize);

    await sequelize.query('DELETE FROM "SequelizeMeta" WHERE "name" = :name', {
      replacements: { name: latestMigration },
    });

    console.log(`Rollback completed: ${latestMigration}`);
  } catch (error) {
    console.error("Rollback failed:");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

rollbackMigration();
