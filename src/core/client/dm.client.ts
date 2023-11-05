import { plainToInstance } from "class-transformer";
import Column from "../models/db/dm-column";
import Table from "../models/db/dm-table";
import DbClient from "../base/db-client";
import { ConnectionConfig } from "@/types/connection.config";
import {
  Pool,
  createPool,
  PoolAttributes,
  OUT_FORMAT_OBJECT,
} from "dmdb";

/**
 * 达梦数据库连接
 */
export default class DmClient implements DbClient {
  private pool: Pool;

  constructor(private connConfig: ConnectionConfig) {
  }

  private async initPool(connConfig: ConnectionConfig): Promise<void> {
    try {
      const connAttrs: PoolAttributes = {
        connectString: `dm://${connConfig.user}:${connConfig.password}\@${connConfig.host}:${connConfig.port ?? 5236}?loginEncrypt=false`,
        poolMax: 10,
        poolMin: 0,
      };
      this.pool = await createPool(connAttrs);
      console.log("Pool initialized.");
    } catch (error) {
      console.error("Error initializing pool:", error);
    }
  }

  private query(sql: string, values?: any): any {
    return new Promise(async (resolve, reject) => {
      if (!this.pool) {
        await this.initPool(this.connConfig);
      }
      const connection = await this.pool.getConnection();
      connection.execute(
        sql,
        values,
        { resultSet: false, outFormat: OUT_FORMAT_OBJECT },
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
  }

  public async selectTables(): Promise<Array<any>> {
    const tableSchema = this.connConfig.scheme;

    const { rows: table } = await this.query(
      "SELECT t.*, c.COMMENTS FROM ALL_TABLES t JOIN ALL_TAB_COMMENTS c ON t.TABLE_NAME = c.TABLE_NAME AND t.OWNER = c.OWNER WHERE t.OWNER = ?",
      [tableSchema]
    );

    const columnsSql = `
	  SELECT 
		col.*, 
		com.COMMENTS,
		cons.CONSTRAINT_TYPE
	  FROM 
		ALL_TAB_COLUMNS col 
	  JOIN 
		ALL_COL_COMMENTS com 
	  ON 
		col.TABLE_NAME = com.TABLE_NAME 
		AND col.COLUMN_NAME = com.COLUMN_NAME 
		AND col.OWNER = com.OWNER
	  LEFT JOIN 
		ALL_CONS_COLUMNS cons_col 
	  ON 
		col.TABLE_NAME = cons_col.TABLE_NAME 
		AND col.COLUMN_NAME = cons_col.COLUMN_NAME 
		AND col.OWNER = cons_col.OWNER
	  LEFT JOIN 
		ALL_CONSTRAINTS cons 
	  ON 
		cons_col.CONSTRAINT_NAME = cons.CONSTRAINT_NAME 
		AND cons_col.OWNER = cons.OWNER 
	  WHERE 
		col.OWNER = ?`;

    const { rows: columns } = await this.query(columnsSql,[tableSchema]);

    const tables = new Array<any>();
    Object.values(table).map((tableInfo) => {
      const resultTable = plainToInstance(Table, tableInfo, {excludeExtraneousValues: true});
      Object.values(columns).map((columnV: any, index) => {
        const col = plainToInstance(Column, columnV, { excludeExtraneousValues: true});
        if (col.tableName == resultTable.tableName) {
          resultTable.columns.push(col);
        }
      });
      resultTable.connType = "dm";
      tables.push(resultTable);
    });
    return tables;
  }

  public close(): void {
    this.pool.close();
  }
}
