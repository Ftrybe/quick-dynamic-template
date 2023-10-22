// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import { workspace, ExtensionContext, extensions, commands } from 'vscode';
import Extension from '../extension';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export async function activate(context: ExtensionContext) {
   const ex: Extension = new Extension();
   ex.parseConfig();
   ex.registerButtonCommands(context);
   ex.registerReloadCommands(context);
   ex.connectDatabases();
   console.log("activate")
}
// this method is called when your extension is deactivated
export function deactivate() {
   console.log("deactivate")
}
