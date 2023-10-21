import * as fs from 'fs-extra';
import * as path from 'path';
import Formatting from './formatting';
import { HandleBarsHelper } from './handlebars-helper';
import * as vscode from 'vscode';
import { Menu } from './enums/menu';
import { Validator } from './validator';
import { FileConfig } from './core/models/template/file-config';
import Extension from './extension';
import { ButtonConfig } from './types/button.config';
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

    const existsDefaultPath = await this.directoryExists(defaultFilePath);

    // const templatesFiles: string[] = await fs.readdir(defaultFilePath);

    const customPath = templateConfig;

    const templatesFilesPromises = Object.entries(config.group).map(item => {
      const key = item[0];
      const value = item[1] as ButtonConfig;
      const file = (value.templateName ?? key) + ".hbr";
      // * 有自定义文件
      if (customPath && fs.existsSync(path.join(customPath, file))) {
        return fs.readFile(path.join(customPath, file), 'utf8').then((data: any) => [file, data]);
      }
      if (!existsDefaultPath) {
        return [file, ""];
      }
      return fs.readFile(path.join(defaultFilePath, file), 'utf8').then((data: any) => [file, data])
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
      const text = this.textCase(buttonKey, inputName, args);
      const intance = HandleBarsHelper.getInstance();
      const templateDelegate = intance.compile(template, { noEscape: true });
      result = templateDelegate(text);
    }
    return result;
  }

  private textCase(buttonKey: string, inputName: string, args: string[]): {} {
    // const resourcesName = FileNameUtils.removeSuffix(templateName).toLocaleLowerCase();
    let className = inputName;
    let fileConfig: FileConfig = new FileConfig();
    var inputArgs: string[] = [];
    // switch (resourcesName) {
    //   case Menu.component:
    //     this.parseConfig("component", async (key: string, jsonKey: any) => {
    //       switch (key) {
    //         case "prefix":
    //           fileConfig.prefix = jsonKey;
    //           break;
    //         case "suffix":
    //           fileConfig.suffix = jsonKey;
    //           break;
    //           case "templates":
    //             if (jsonKey instanceof Array) {
    //                 const array = jsonKey;
    //                 fileConfig.templates = "\t";
    //                 array.map((value, index, array) => {
    //                     fileConfig.templates += value;
    //                     if (index < array.length - 1) {
    //                         fileConfig.templates += "\n\t";
    //                     }
    //                 });
    //             } 
    //           break;
    //         case "styleLang":
    //           fileConfig.styleLang = " lang='" + jsonKey + "'";
    //           break;
    //         case "templateLang":
    //           fileConfig.templateLang = " lang='" + jsonKey + "'";
    //           break;
    //         case "styleScope":
    //           fileConfig.styleScope = " " + jsonKey;
    //       }
    //     })
    //     if (args) {
    //       inputArgs = args;
    //       args.forEach((value: string, index: number, array: string[]) => {
    //         const nextValue = array[index + 1];
    //         if (value.startsWith("-")) {

    //           switch (value) {
    //             case "-c" || "-component":
    //               if (!Validator.hasArgs(nextValue)) {
    //                 fileConfig.prefix = "";
    //                 fileConfig.suffix = "";
    //               }
    //               break;
    //             case "-s" || "-suffix":
    //               if (Validator.hasArgs(nextValue)) {
    //                 fileConfig.suffix = Formatting.toUpperCase(nextValue);
    //               } else {
    //                 fileConfig.suffix = "";
    //               }
    //               break;
    //             case "-p" || "-prefix":
    //               if (Validator.hasArgs(nextValue)) {
    //                 fileConfig.prefix = Formatting.toUpperCase(nextValue);
    //                 className = Formatting.toUpperCase(className);
    //               } else {
    //                 fileConfig.prefix = "";
    //               }
    //               break;
    //           }
    //         }
    //       })
    //     }
    //     break;
    //   case Menu.vuexModule:
    //     this.parseConfig("vuex", (key: string, jsonKey: any) => {
    //       switch (key) {
    //         case "suffix":
    //           fileConfig.suffix = jsonKey;
    //           break;
    //         case "exportModule":
    //           fileConfig.exportModule = jsonKey;
    //           break;
    //       }
    //     })
    //     break;
    // }

    // if(this.parseConfig("file")?.spotStyleName){
    //   className = Formatting.toCamelCaseWithSpot(className);
    // }
    // 获取配置信息
    className = fileConfig.prefix + (fileConfig.prefix ? "-" : "") + className + (fileConfig.suffix ? "-" : "") + fileConfig.suffix;

    const result = {
      // resourcesName: resourcesName,
      upperName: Formatting.toUpperCase(className),
      hyphensName: Formatting.toHyphensCase(className),
      dynamicName: Formatting.toUpperCase(className),
      inputName: inputName,
      args: inputArgs,
      fileName: Formatting.toUpperCase(inputName)
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
