# 快速模版生成（Quick Dynamic Template）

## 预览 

![image](/images/create-component.gif)  

## 简介

Quick Dynamic Template 是一款为了简化开发的vscode插件。主要用于快速生成文件模版。插件提供10个预置按钮，用户可以通过直接修改vscode插件的package.json文件或者修改插件对应的配置来来实现按钮名称自定义。  

插件可配置连接数据库（目前只支持了达梦，MySql），在项目初始化时插件将获取对应数据库的表信息和列信息存取在当前打开项目的根目录下的`.quick-dynamic-template`文件夹中。与项目有关的配置都将存放在当前文件夹下。如果需要全局配置，请修改vscode内的配置信息。注意：项目内的配置会覆盖全局配置。

PS：插件配置信息不是实时修改的，可能需要多次重启vscode。

## 快速开始

### 配置

### 模版方法 

模版后缀使用hbr推荐安装插件Handlebars

### 自定义扩展 