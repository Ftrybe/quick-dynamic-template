import { workspace, ExtensionContext, extensions, commands, window } from "vscode";
import Dialog from "./dialog";
import { Menu } from "./enums/menu";

import * as fs from 'fs-extra';
import * as path from "path";
import * as os from "os";

import { GlobalConfig } from "@/types/global.config";
import { ButtonConfig } from "@/types/button.config";
import MysqlClient from "./core/client/mysql.client";
import DmClient from "./core/client/dm.client";
import Table from "./core/base/table";
import IOUtil from "./utils/io.utils";
import DBClient from "./core/base/db-client";

export default class Extension {

	public static TABLE_LIST: Table[] = [];

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

	public registerRefreshDatabaseCommands(context: ExtensionContext): void {
		const command = `quick-dynamic-template.refreshDatabase`;
		const disposable = commands.registerCommand(command, () => this.connectDatabases(true));
		context.subscriptions.push(disposable);
	}


	public async connectDatabases(refresh: boolean = false): Promise<void> {
		const text = IOUtil.readText("database.json");
		if (text && text != "" && !refresh) {
			Extension.TABLE_LIST = JSON.parse(text);
			return;
		}

		const databases = Extension.getConfig().databases;
		if (databases) {
			const enableDatabases = databases.filter(database => !database.disabled);
			if (!databases || databases.length == 0) {
				return
			}

			let tableList: Table[] = [];
			for (const database of enableDatabases) {
				let client: DBClient;
				const dbType = database.dbType;
				if (dbType == "mysql") {
					client = new MysqlClient(database);
				} else if (dbType == "dm") {
					client = new DmClient(database);
				} else {
					return;
				}
				const mysqlTables = await client.selectTables();
				tableList.push(...mysqlTables);
				client.close();
			}

			Extension.TABLE_LIST = tableList;

			if (tableList.length > 0) {
				const rootPath = IOUtil.createPlugInResourceDir();
				if (rootPath == "") {
					return;
				}
				const tableInfo = JSON.stringify(tableList);
				fs.outputFileSync(rootPath, tableInfo)
			}

		}
	}


	public static getConfig() {
		const text = IOUtil.readText("config.json");
		let config: GlobalConfig | undefined = JSON.parse(text);
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
		if (defaultConfig != group) {
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
