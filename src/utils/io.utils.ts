import * as fs from 'fs-extra';
import {workspace, ExtensionContext, extensions, commands, window } from 'vscode';
import * as path from "path";
import { IFiles } from '../core/models/file';
import { IPath } from '../core/models/path';
import Extension from '../extension';
import * as Path from "path"
export default class IOUtil {
  private constructor() { }
  public static async createFiles(loc: IPath, files: IFiles[]): Promise<string> {
    try {
     await this.writeFiles(files);
        
    } catch (ex) {
      window.showErrorMessage(`文件不能创建. ${ex}`);
    }
    return loc.dirPath;
  }

  public static async writeFiles(files: IFiles[]) {
    const filesPromises: Promise<any>[] = files.map(file=> fs.outputFile(file.name,file.content));
    await Promise.all(filesPromises);
  }

  public static async searchFiles(folderDir: string, fileName: string, buttonKey: string): Promise<boolean> {
    
    if (!await fs.pathExists(folderDir)) {
      return false;
    }
    let flag = false;
    
    const buttonGroup = Extension.getConfig().group;
    const button = buttonGroup[buttonKey];
    let suffix = button?.suffix;
    const longFilename = fileName + suffix;
    fs.readdirSync(folderDir).forEach(file => {
      if (file === longFilename) {
        flag = true;
      }
    });
    return flag;
  }

  public static directoryExists(directoryPath: string): boolean {
    try {
      const stats = fs.statSync(directoryPath);
      return stats.isDirectory();
    } catch (error: any) {
      if (error.code === 'ENOENT') {
        // 路径不存在
        return false;
      }
      throw error;  // 其他错误，例如权限问题
    }
  }
  

  public static getWorksapcePath(): string | undefined {
    const workspaceFolders = workspace.workspaceFolders;
    if (!workspaceFolders) {
      return undefined;
    }
		const rootFolder = workspaceFolders[0]; 
		const rootPath = rootFolder.uri.fsPath;
    return rootPath;
  }

  public static readText(url: string): string {
      const rootPath = this.getWorksapcePath();
      if (!rootPath) {
        return "";
      }
			let filePath: string;
      if (path.isAbsolute(url)) {
        filePath = url;
      } else {
        filePath = path.join(rootPath,".quick-dynamic-template", url);
      }
			const hasFile = fs.existsSync(filePath);
			if (hasFile) {
				const data = fs.readFileSync(filePath, "utf8");
        return data;
			}
      return "";
  }

  public static readDirTexts(dir: string): string[] {
    const rootPath = this.getWorksapcePath();
    if (!rootPath) {
      return [];
    }
    let fileDir: string;
    if (path.isAbsolute(dir)) {
      fileDir = dir;
    } else {
      fileDir = path.join(rootPath,".quick-dynamic-template", dir);
    }
    const hasDir = fs.existsSync(fileDir);
    if (hasDir) {
      const dirFiles = fs.readdirSync(fileDir);
      let texts: string[] = [];
      dirFiles.forEach(filenName => {
        const data = fs.readFileSync(Path.join(fileDir, filenName), "utf8");
        texts.push(data);
      })
      return texts;
    }
    return [];
}

  public static createPlugInResourceDir(subPath?: string): string {
    const rootPath = this.getWorksapcePath();
    if (!rootPath) {
      return "";
    }
    let resourcePath ;
    if (subPath) {
      resourcePath = path.join(rootPath,".quick-dynamic-template", subPath);
    } else {
      resourcePath = path.join(rootPath,".quick-dynamic-template");
    }
    
    const exists = IOUtil.directoryExists(resourcePath)
    if (!exists) {
      fs.mkdirSync(resourcePath);
    }
    return resourcePath;
  }
}