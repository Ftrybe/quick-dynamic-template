import { Menu } from "@/enums/menu";
import { ButtonConfig } from "./button.config";
import { ConnectionConfig } from "./connection.config";

export type CharacterType = 'LowerCase' | 'UpperCase' | 'CamelCase' | 'TitleCase' | 'PascalCase' | 'HyphenCase' | 'LowerCaseFirst' | 'LowerCamelCase';

export interface GlobalConfig {
	/**
	 * 
	 * 模版文件路径 默认为当前项目目录下的.quick-dynamic-template文件夹下
	 */
	templateDirPath: string | undefined;


	/**
	 * 按钮配置
	 */
	group: Record<string, ButtonConfig>;


	/**
	 * 数据库配置
	 */
	databases: ConnectionConfig[] | ConnectionConfig | undefined;

	/**
	 * 是否开启代码提示
	 */
	// enableSnippets: boolean;

	/**
	 * 触发字符串
	 */
	triggerCharacters: string[];

	/**
	 * 触发字符串 default LowerCaseFirst
	 */
	characterType: CharacterType;
}