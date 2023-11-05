import { Expose } from "class-transformer";
import Column from '@/core/base/column';
export default class ApiColumn implements Column{
    
    @Expose({ name: "tableCatalog" })
    tableCatalog: string ;
    // 关联的数据库
    @Expose({ name: "tableSchema" })
    tableSchema: string;
    // 表名
    @Expose({ name: "tableName" })
    tableName: string;
    // 列名
    @Expose({ name: "columnName" })
    columnName: string;

    // 字段默认值
    @Expose({ name: "columnDefault" })
    columnDefault: string;
    // 是否为空
    @Expose({ name: "isNullable" })
    isNullable: string;
    // 数据类型
    @Expose({ name: "dataType" })
    dataType: string;
    // 特征最大长度
    @Expose({ name: "characterMaximumLength" })
    characterMaximumLength: number;
    // 字符长度
    @Expose({ name: "characterOctetLength" })
    characterOctetLength: number;

    @Expose({ name: "numericPrecision" })
    numericPrecision: number;

    @Expose({ name: "NUMERIC_SCALE" })
    numericScale: number;

    @Expose({ name: "characterSetName" })
    characterSetName: string;

    @Expose({ name: "columnType" })
    columnType: string;

    // 主键为 PRI
    @Expose({ name: "columnKey" })
    columnKey: string;

    @Expose({ name: "columnComment" })
    columnComment: string;


}
