import { Expose } from "class-transformer";
import Column from '@/core/base/column';
export default class DmsqlColumn implements Column {

    // 关联的数据库
    @Expose({ name: "OWNER" })
    tableSchema: string;
    // 表名
    @Expose({ name: "TABLE_NAME" })
    tableName: string;
    // 列名
    @Expose({ name: "COLUMN_NAME" })
    columnName: string;

    // 字段默认值
    @Expose({ name: "DATA_DEFAULT" })
    columnDefault: string;
    // 是否为空
    @Expose({ name: "NULLABLE" })
    isNullable: string;
    // 数据类型
    @Expose({ name: "DATA_TYPE" })
    dataType: string;
    // 特征最大长度
    @Expose({ name: "CHAR_COL_DECL_LENGTH" })
    characterMaximumLength: number;
    // 字符长度
    @Expose({ name: "DATA_LENGTH" })
    characterOctetLength: number;

    @Expose({ name: "DATA_PRECISION" })
    numericPrecision: number;

    @Expose({ name: "DATA_SCALE" })
    numericScale: number;

    @Expose({ name: "CHARACTER_SET_NAME" })
    characterSetName: string;

    @Expose({ name: "COLUMN_TYPE" })
    columnType: string;

    @Expose({ name: "CONSTRAINT_TYPE" })
    columnKey: string;

    @Expose({ name: "COMMENTS" })
    columnComment: string;

}
