import Table from '@/core/base/table';
import Extension from '../extension';
import { CharacterType } from "@/types/global.config";
import StringUtils from "../formatting";

import * as vscode from 'vscode';

export default class HandlebarsCompletionItemProvider implements vscode.CompletionItemProvider {

    public provideCompletionItems(
        document: vscode.TextDocument, position: vscode.Position, token: vscode.CancellationToken):
        Thenable<vscode.CompletionItem[]> | vscode.CompletionItem[] {
            
        // You can return a single completion item or an array of items
        return [];
    }
}

