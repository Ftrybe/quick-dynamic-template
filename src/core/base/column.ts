/**
 * 基础列信息
 */
export default interface Column {

    // 关联的数据库
    tableSchema: string;
    // 表名
    tableName: string;
    // 列名
    columnName: string;

    // 字段默认值
    columnDefault: string;

    // 是否为空
    isNullable: string;

    // 数据类型
    dataType: string;

    // 对于字符类型（如 VARCHAR、CHAR 等），这是该列可存储的最大字符数
    characterMaximumLength: number;
	
    // 该列的最大字节长度。对于多字节字符集，这可能与 characterMaximumLength 不同
    characterOctetLength: number;

    // 对于数字类型，这是可存储的最大数字位数
    numericPrecision: number;

    // 对于小数类型（如 DECIMAL），这是小数点右侧的位数
    numericScale: number;

    // 列使用的字符集名称。
    characterSetName: string;

    columnType: string;

    columnKey: string;

    columnComment: string;
    
}