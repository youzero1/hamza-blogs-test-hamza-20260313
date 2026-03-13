import "reflect-metadata";
import { DataSource } from "typeorm";
import { Post } from "./entities/Post";
import { Category } from "./entities/Category";
import path from "path";

const dbPath = process.env.DATABASE_PATH
  ? path.resolve(process.cwd(), process.env.DATABASE_PATH)
  : path.resolve(process.cwd(), "data", "blog.sqlite");

let dataSource: DataSource | null = null;

export async function getDataSource(): Promise<DataSource> {
  if (dataSource && dataSource.isInitialized) {
    return dataSource;
  }

  dataSource = new DataSource({
    type: "better-sqlite3",
    database: dbPath,
    synchronize: true,
    logging: false,
    entities: [Post, Category]
  });

  await dataSource.initialize();
  return dataSource;
}
