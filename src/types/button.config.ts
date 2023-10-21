export interface ButtonConfig {
	
	/**
	 * 是否显示
	 */ 
	visible: boolean;

	/**
	 * 按钮名称
	 */ 
	name: string;

	/**
	 * 文件后缀 如：.vue .ts .js
	 */ 
	suffix: string;

	/**
	 * 文件名格式化类型 如驼峰式, 下划线形式， 中线形式
	 */ 
	fileNameFormat: string;

	/**
	 * 模版名称 不填写默认当前按钮名称 如 button 1
	 */ 
	templateName: string;
}