import * as fs from 'fs-extra';
import { window } from 'vscode';
import { IFiles } from '../core/models/file';
import { IPath } from '../core/models/path';
import Extension from '../extension';

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
}