import { plainToInstance } from "class-transformer";
import Column from "../models/db/api-column";
import Table from "../models/db/api-table";
import DbClient from "../base/db-client";
import { window as vsWindow} from 'vscode';
import { ConnectionConfig } from "@/types/connection.config";
import axios from "axios";

/**
 * 达梦数据库连接
 */

export default class ApiClient implements DbClient {

	constructor(private connConfig: ConnectionConfig) {
	}

	private async queryTable(): Promise<any> {

		return new Promise((resolve,reject) => {
			axios.get(`http://${this.connConfig.host ?? '127.0.0.1'}:${this.connConfig.port ?? 80}/scheme/${this.connConfig.scheme}`).then(response => {
				if ( response.status != 200) {
					resolve([]);
					return;
				}
				const data = response.data;
				return resolve(data);
			}).catch(error => {
				vsWindow.setStatusBarMessage(`api error: `, error);
			})
		})
	
	}

	private async queryColumn(): Promise<any> {
		return new Promise((resolve,reject) => {
			axios.get( `http://${this.connConfig.host ?? '127.0.0.1'}:${this.connConfig.port ?? 80}/scheme/${this.connConfig.scheme}/columns `).then(response => {
				if ( response.status != 200) {
					resolve([]);
					return;
				}
				const data = response.data;
				return resolve(data);
			}).catch(error => {
				vsWindow.setStatusBarMessage(`api error: `, error);
			})
		})
	}

	public async selectTables(): Promise<Array<any>> {
		const tableSchema = this.connConfig.scheme;
		if (!tableSchema) {
			return [];
		}
		const table = await this.queryTable();

		const columns = await this.queryColumn();

		const tables = new Array<any>();
		Object.values(table).map((tableInfo) => {
			const resultTable = plainToInstance(Table, tableInfo, { excludeExtraneousValues: true });
			Object.values(columns).map((columnV: any, index) => {
				const col = plainToInstance(Column, columnV, { excludeExtraneousValues: true });
				if (col.tableName == resultTable.tableName) {
					resultTable.columns.push(col);
				}
			});
			resultTable.connType = "api";
			tables.push(resultTable);
		});
		return tables;
	}

	public close(): void {
		console.log("close")
	}
}
