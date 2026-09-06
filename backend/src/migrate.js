import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { Sequelize } from "sequelize";
import sequelize from "./config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  try {
    const queryInterface = sequelize.getQueryInterface();
    const tables = await queryInterface.showAllTables();
    const normalizedTables = tables.map((table) =>
      typeof table === "string" ? table : table.tableName || table,
    );

    if (!normalizedTables.includes("SequelizeMeta")) {
      await queryInterface.createTable("SequelizeMeta", {
        name: {
          type: Sequelize.STRING,
          primaryKey: true,
          allowNull: false,
        },
      });
    }

    const [executedMigrations] = await sequelize.query(
      'SELECT "name" FROM "SequelizeMeta"',
    );
    const executedNames = executedMigrations.map((migration) => migration.name);

    const migrationsPath = path.join(__dirname, "migrations");
    const migrationFiles = fs
      .readdirSync(migrationsPath)
      .filter((file) => file.endsWith(".js"))
      .sort();

    for (const file of migrationFiles) {
      if (executedNames.includes(file)) {
        console.log(`Already executed: ${file}`);
        continue;
      }

      console.log(`Running migration: ${file}`);
      const migration = await import(path.join(migrationsPath, file));
      await migration.up(queryInterface, Sequelize);

      await sequelize.query(
        'INSERT INTO "SequelizeMeta" ("name") VALUES (:name)',
        {
          replacements: { name: file },
        },
      );

      console.log(`Completed: ${file}`);
    }

    console.log("All migrations completed.");
  } catch (error) {
    console.error("Migration failed:");
    console.error(error);
    process.exitCode = 1;
  } finally {
    await sequelize.close();
  }
}

runMigrations();
