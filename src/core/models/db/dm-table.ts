import { Expose } from "class-transformer";
import Column from "@/core/base/column";
import Table from '@/core/base/table';

export default class DmsqlTable implements Table {
    
    @Expose({name:"OWNER"})
    tableSchema: string;

    @Expose({name:"TABLE_NAME"})
    tableName: string;

    @Expose({name:"COMMENTS"})
    tableComment: string;

    dbType: string;
    
    columns:Column[] = new Array<Column>();


    get primaryKeyColumns(): Column[] {
        let primaryKeyColumns = new Array<Column>();
        primaryKeyColumns = this.columns.filter(column => column.columnKey === "P");
        return primaryKeyColumns;
    }


    get baseColumns(): Column[] {
        let primaryKeyColumns = new Array<Column>();
        primaryKeyColumns = this.columns.filter(column => column.columnKey !== "P");
        return primaryKeyColumns;
    }
}
