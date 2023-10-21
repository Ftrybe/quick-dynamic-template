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

    
    columns:Column[] = new Array<Column>();
}
