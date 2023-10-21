
import Table  from "./table";

export default interface DBClient {

	/**
	 * 获取所有表信息，包括各个表的字段数据
	 * @returns {Promise<Array<Table>>}
	 * @description 获取所有表
	 * @example
	 * ```
	 * const tables = await dbClient.selectTables();
	 * ```
	 * @example
	 * ```
	 * dbClient.selectTables().then(tables=>{
	 *  console.log(tables);
	 * });
	 * ```
	 * @example	
	 * ```
	 */
	selectTables(): Promise<Array<Table>>;
}