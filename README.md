<h1 align="center">wenda-webui</h1>

## 专为 wenda 设计的 webui

[wenda](https://github.com/l15y/wenda) 是一个 LLM 调用平台。为小模型外挂知识库查找和设计自动执行动作，实现不亚于于大模型的生成能力。
**本项目调用闻达的 api 接口实现类似于 new bing 的功能。**
技术栈：vue3 + element-plus + ts

### 特色功能

- 完整的会话管理功能
- 支持各种快捷键
- 会话中可直接看到知识库来源
- 支持自定义会话角色
- 知识库来源可自定义（待完成）
- chatpdf（待完成）
- 类似于 autogpt 的功能（待完成）

### todo

- [x] 基础功能
- [ ] 设置项
- [ ] 适配手机
- [ ] 闻达 auto

### 注意

请先成功运行闻达主项目后，再运行本 webui。如果您遇到了任何问题，请先确认闻达自带的 ui 是否能正常使用！

### 安装

请先安装 [nodejs](https://pan.baidu.com/s/1p3-0F8eIZg6gMownXhiWQQ?pwd=oigr) ,然后再执行以下语句安装依赖

```bash
# 请在项目根目录下运行
npm install
```

### 启动

使用下面的命令行。  
或者直接运行根目录下的“一键启动.bat”

```bash
# 请在项目根目录下运行
npm run dev
```
