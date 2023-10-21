import { workspace, ExtensionContext, extensions, commands, window} from "vscode";
import Dialog from "./dialog";
import { Menu } from "./enums/menu";

import * as fs from "fs";
import * as path from "path";
import * as os from "os";

import { GlobalConfig } from "@/types/global.config";
import { ButtonConfig } from "@/types/button.config";

export default class Extension {
	private dialog: Dialog;
 
	constructor() {
		this.dialog = new Dialog();
	}

	// 注册按钮事件
	public registerButtonCommands(context: ExtensionContext): void {
		Object.entries(Menu).forEach((menu) => {
			const btnKey = menu[0];
			const command = `quick-dynamic-template.${btnKey}`;
			const disposable = commands.registerCommand(command, (url) =>
				this.dialog.showDynamicDialog(url, btnKey)
			);
			context.subscriptions.push(disposable);
		});
	}

	public registerReloadCommands(context: ExtensionContext): void {
		const command = `quick-dynamic-template.reloadConfig`;
		const disposable = commands.registerCommand(command, () => this.parseConfig());
		context.subscriptions.push(disposable);
	}

	public static getConfig() {
		let config: GlobalConfig | undefined = undefined;
		// 读取当前目录下的配置文件信息
		const workspaceFolders = workspace.workspaceFolders;
		// 单工作区
		if (workspaceFolders !== undefined && workspaceFolders.length > 0) {
			const rootFolder = workspaceFolders[0];
			const rootPath = rootFolder.uri.fsPath;
			const filePath = path.join(rootPath, ".quick-dynamic-template.json");

			const hasFile = fs.existsSync(filePath);
			if (hasFile) {
				const data = fs.readFileSync(filePath, "utf8");
				config = JSON.parse(data);
			}
		}

		const defaultConfigg = this.getWorksapceConfiguration();
		if (!config) {
			config = defaultConfigg;
		} else {
			config.templateDirPath = config.templateDirPath ?? defaultConfigg.templateDirPath;
		}

		return config;
	}


	public parseConfig() {
		const config = Extension.getConfig();
		this.updateGroupConfig(config.group);
		this.updateButtonName(config.group);
	}


	

	// 更新按钮名称
	private updateButtonName(group: Record<string, ButtonConfig>) {
		const filePath = this.getJsonFile("package.nls.json");
		const jsonFile = require(filePath);

		let needUpdate = false;
		Object.entries(group).forEach((object) => {
			const key = object[0];
			const value = object[1];

			if (jsonFile[`commands.${key}`] != value.name) {
				jsonFile[`commands.${key}`] = value.name;
				needUpdate = true;
			}
		});

		// 写回文件
		if (needUpdate) fs.writeFileSync(filePath, JSON.stringify(jsonFile, null, 2));
		
	}

	private updateGroupConfig(group: Record<string, ButtonConfig>) {
		const filePath = this.getJsonFile("package.json");
		const jsonFile = require(filePath);
		const defaultConfig = jsonFile.contributes.configuration.properties['quick-dynamic-template.group'].default;
		if (defaultConfig!=group) {
			jsonFile.contributes.configuration.properties['quick-dynamic-template.group'].default = group;
			fs.writeFileSync(filePath, JSON.stringify(jsonFile, null, 2));
		}
	}

	private getJsonFile(fileName: string) {
		const userHomeDir = os.homedir();

		const version = this.getVersion();
		if (version == "") {
			return "";
		}
		const pluginPath = `${userHomeDir}/.vscode/extensions/ftrybe.quick-dynamic-template-${version}/${fileName}`;
		return pluginPath;
	}

	private getVersion(): string {
		const extension = extensions.getExtension("ftrybe.quick-dynamic-template");
		if (extension) {
			const version = extension.packageJSON.version;
			return version;
		}
		return "";
	}

	private static getWorksapceConfiguration(): GlobalConfig {
		const workspaceConfig = workspace.getConfiguration(
			"quick-dynamic-template"
		);
		return workspaceConfig as unknown as GlobalConfig;
	}
}
