import { DataSource, DataSourceOptions } from 'typeorm'
import { config } from 'dotenv'
import { SnakeNamingStrategy } from 'typeorm-naming-strategies'
import { entities } from '../entities'
import path from 'node:path'

config({
  path: `.${process.env.NODE_ENV?.replace('-cli', '') || 'development'}.env`
})

const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  entities,
  migrations: (
    process.env.NODE_ENV?.endsWith('-cli') 
      ? [path.join(process.cwd(), 'src/migrations/*{.ts,.js}')] 
      : undefined
  ),
  namingStrategy: new SnakeNamingStrategy(),
  synchronize: false,
  logging: true,
}

const dataSource = new DataSource(dataSourceOptions)
export default dataSource
