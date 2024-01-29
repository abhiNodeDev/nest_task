import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { constantVar } from '../config'

export const userDbConf: TypeOrmModuleOptions = {
  type: 'postgres',
  host: constantVar.host,
  port: parseInt(constantVar.port),
  username: constantVar.username,
  password: constantVar.password,
  database: constantVar.database,
  synchronize: true,
  entities: ['dist/**/*.model.js'],
};
