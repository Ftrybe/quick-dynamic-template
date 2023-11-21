
import { createPool, Pool } from "mysql2";
import { plainToInstance } from "class-transformer";
import Column from "../models/db/mysql-column"
import Table from "../models/db/mysql-table"
import DbClient from '../base/db-client';
import { ConnectionConfig } from "@/types/connection.config";
import { window as vsWindow } from "vscode";

/**
 * MYsql数据库连接
 */

export default class MysqlClient implements DbClient {

  private connection: Pool;

  constructor(private connConfig: ConnectionConfig) {

    this.connection = createPool({
      user: connConfig.user,
      password: connConfig.password,
      database: connConfig.scheme,
      host: connConfig.host,
      port: connConfig.port ?? 3306,
    });
  }

  private query(sql: string, values?: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this.connection.query(sql, values, (err, rows) => {
        if (err) {
          vsWindow.setStatusBarMessage(`Error initializing pool: ${err.message}`);
          reject(err);
        } else {
          resolve(rows);
        }
      })
    })
  }

  public async selectTables(): Promise<Array<Table>> {


    const tableSchema = this.connConfig.scheme;

    const table: Table = await this.query("select * from INFORMATION_SCHEMA.TABLES where table_schema = ?", [tableSchema]);

    const columns: Column[] = await this.query("select * from INFORMATION_SCHEMA.Columns where  table_schema = ?", [tableSchema]);

    const tables = new Array<Table>();
    Object.values(table).map(tableInfo => {
      const resultTable = plainToInstance(Table, tableInfo, {excludeExtraneousValues: true});
      Object.values(columns).map((columnV: Column, index) => {
        const col = plainToInstance(Column, columnV, { excludeExtraneousValues: true});
        if (col.tableName == resultTable.tableName) {
          resultTable.columns.push(col);
        }
      });
      resultTable.connType = "mysql";
      tables.push(resultTable);
    });
    return tables;
  }

  public close(): void {
    this.connection.end();
  }
}