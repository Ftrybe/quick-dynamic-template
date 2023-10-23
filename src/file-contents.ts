import * as fs from 'fs-extra';
import * as path from 'path';
import { HandleBarsHelper } from './handlebars-helper';
import * as vscode from 'vscode';
import { Menu, getMenuValue } from './enums/menu';
import { Validator } from './validator';
import Extension from './extension';
import { ButtonConfig } from './types/button.config';
import IOUtil from './utils/io.utils';
// import { TemplateConfig } from "./core/models/template/template-config";
export class FileContents {
  private templatesMap: Map<string, string>;


  constructor() {
    this.loadTemplates();
  }

  private async loadTemplates() {
    this.templatesMap = new Map<string, string>();
    this.templatesMap = await this.getTemplates();
  }
  // 获取模板信息
  private async getTemplates(): Promise<Map<string, string>> {

    const config = Extension.getConfig()

    const templateConfig: any = config.templateDirPath;

    const workspaceFolders = vscode.workspace.workspaceFolders;

    const rootFolder = workspaceFolders![0];
    const rootPath = rootFolder.uri.fsPath;
    const defaultFilePath = path.join(rootPath, ".quick-dynamic-template");

    const existsDefaultPath = await IOUtil.directoryExists(defaultFilePath);

    // const templatesFiles: string[] = await fs.readdir(defaultFilePath);

    const customPath = templateConfig;

    const templatesFilesPromises = Object.entries(config.group).map(item => {
      const key = item[0] as any;
      const value = item[1] as ButtonConfig;
      const file = (value.templateName ?? getMenuValue(key)) + ".hbr";
      // * 有自定义文件
      if (customPath && fs.existsSync(path.join(customPath, file))) {
        return fs.readFile(path.join(customPath, file), 'utf8').then((data: any) => [key, data]);
      }
      if (!existsDefaultPath) {
        return [key, ""];
      }
      if (!fs.existsSync(path.join(defaultFilePath, file))) {
        vscode.window.showErrorMessage(`缺少${key}对应的模版文件${file}`)
        return [key, ""];
      }
      return fs.readFile(path.join(defaultFilePath, file), 'utf8').then((data: any) => [key, data])
    });

    const templates = await Promise.all(templatesFilesPromises);
    return new Map(templates.map(x => {
      return x as [string, string]
    }));
  }
  // 获得修改后的模板内容
  public getTemplateContent(buttonKey: string, inputName: string, args: string[]) {
    let result = '';
    if (this.templatesMap.has(buttonKey)) {
      const template = this.templatesMap.get(buttonKey) || '';
      const text = this.getParams(buttonKey, inputName, args);
      const intance = HandleBarsHelper.getInstance();
      const templateDelegate = intance.compile(template, { noEscape: true });
      result = templateDelegate(text);
    }
    return result;
  }

  private getParams(buttonKey: string, inputName: string, args: string[]): {} {
    // const resourcesName = FileNameUtils.removeSuffix(templateName).toLocaleLowerCase();
    let className = inputName;
    var inputArgs: string[] = [];
    let tableName: string = "";
    if (args) {
      inputArgs = args;
      args.forEach((value: string, index: number, array: string[]) => {
        const nextValue = array[index + 1];
        if (value.startsWith("-")) {
          switch (value) {
            case "-t" || "-table":
              if (Validator.hasArgs(nextValue)) {
                tableName = nextValue.toLocaleLowerCase();
              }
              break;
          }
        }
      })
    }

    const tables =  Extension.TABLE_LIST;
    const table = tableName != "" ? tables.filter(item => item.tableName.toLocaleLowerCase() == tableName)[0] : {};

    const result = {
      inputName: inputName,
      args: inputArgs,
      table: table
    }
    return result;
  }

  async directoryExists(directoryPath: string) {
    try {
      const stats = await fs.stat(directoryPath);
      return stats.isDirectory();
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // 路径不存在
        return false;
      }
      throw error;  // 其他错误，例如权限问题
    }
  }
}
