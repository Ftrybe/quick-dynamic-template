import Table from '@/core/base/table';
import Extension from '../extension';
import { CharacterType } from "@/types/global.config";
import StringUtils from "../formatting";

import * as vscode from 'vscode';

export default class FieldCompletionItemProvider implements vscode.CompletionItemProvider {

    public provideCompletionItems(
        document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken):
        Thenable<vscode.CompletionItem[]> | vscode.CompletionItem[] {
        const tableList: Table[] = Extension.TABLE_LIST;
        const charType = Extension.getConfig().characterType;

        let completionList: vscode.CompletionItem[] = [];
        tableList.filter( table => this.convertChar(table.tableName, charType).startsWith(document.getText()) )
        for (let table of tableList) {
            const tableLabel: vscode.CompletionItemLabel = { label: this.convertChar(table.tableName, charType), description: table.tableComment, detail: "" }
            completionList.push(new vscode.CompletionItem(tableLabel))
            for (let column of table.columns) {
                const columnLabel: vscode.CompletionItemLabel = { label: this.convertChar(column.columnName, charType), description: column.columnComment, detail: "" }
                completionList.push(new vscode.CompletionItem(columnLabel))
            }
        }

        // You can return a single completion item or an array of items
        return completionList;
    }


    private convertChar(str: string, charType: CharacterType) {
        switch (charType) {
            case "LowerCase":
                return str.toLowerCase();
            case "UpperCase":
                return str.toUpperCase();
            case 'CamelCase':
                return StringUtils.toCamelCase(str);
            case 'TitleCase':
                return StringUtils.toTitleCase(str);
            case 'PascalCase':
                return StringUtils.toPascalCase(str);
            case 'HyphenCase':
                return StringUtils.toHyphenCase(str);
            case 'LowerCaseFirst':
                return StringUtils.toLocaleLowerCaseFirst(str);
            case "LowerCamelCase":
                return  StringUtils.toCamelCase(str.toLocaleLowerCase());
            default:
                return str;
        }
    }
}

