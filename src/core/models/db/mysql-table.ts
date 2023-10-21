import { Expose } from "class-transformer";
import Column from "@/core/base/column";
import Table from '@/core/base/table';

export default class MysqlTable implements Table {
  
    // 关联的数据库
    @Expose({name:"TABLE_SCHEMA"})
    tableSchema: string;
    // 表名
    @Expose({name:"TABLE_NAME"})
    tableName: string;

    @Expose({name:"TABLE_COMMENT"})
    tableComment: string;

    columns:Column[] = new Array<Column>();
}
