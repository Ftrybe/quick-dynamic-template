import Column from './column';

/**
 * 基础表信息
 */
export default interface Table {
   
    // 关联的数据库
    tableSchema: string;
   
    // 表名
    tableName: string;

    // 注释
    tableComment: string;

    // 字段信息
    columns:Column[];


    // 数据库类型
    connType: string;

    // 主键列表
    get primaryKeyColumns(): Column[];


    // 普通列表
    get baseColumns(): Column[];
}