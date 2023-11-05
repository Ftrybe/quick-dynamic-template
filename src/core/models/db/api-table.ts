import { Expose } from "class-transformer";
import Column from "@/core/base/column";
import Table from '@/core/base/table';

export default class ApiTable implements Table {
    
    @Expose({name:"tableSchema"})
    tableSchema: string;

    @Expose({name:"tableName"})
    tableName: string;

    @Expose({name:"tableComment"})
    tableComment: string;

    connType: string;
    
    columns: Column[] = new Array<Column>();


    get primaryKeyColumns(): Column[] {
        let primaryKeyColumns = new Array<Column>();
        primaryKeyColumns = this.columns.filter(column => column.columnKey === "PRI");
        return primaryKeyColumns;
    }


    get baseColumns(): Column[] {
        let primaryKeyColumns = new Array<Column>();
        primaryKeyColumns = this.columns.filter(column => column.columnKey !== "PRI");
        return primaryKeyColumns;
    }
}
