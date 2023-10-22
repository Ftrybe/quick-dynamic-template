import * as path from 'path';
import { Menu } from "./enums/menu";
import { FileContents } from "./file-contents";
import IOUtil from "./utils/io.utils";
import { IFiles } from "./core/models/file";
import { IPath } from "./core/models/path";
import * as vscode from "vscode";
import Extension from './extension';
export class Generator {
  
  constructor(private readonly fc = new FileContents()) {}

  public async generateResources(buttonKey: string, loc: IPath) {

    const buttonGroup = Extension.getConfig().group;
    const button = buttonGroup[buttonKey];
    
    const files: IFiles[] = [{
      name: path.join(loc.dirPath, `${loc.fileName}${button?.suffix}`),
      content: this.fc.getTemplateContent(buttonKey, loc.fileName, loc.args),
    }]
    

    await IOUtil.createFiles(loc, files);

    this.focusFiles(files[0].name);
  }

  private focusFiles(fileName: string) {
    vscode.window.showTextDocument(vscode.Uri.file(fileName));

    // const position = new vscode.Position(lineNumber, columnNumber);  // lineNumber 和 columnNumber 是你想要光标移动到的位置
    // const range = new vscode.Range(position, position);
    // vscode.window.activeTextEditor?.revealRange(range);
  }

}