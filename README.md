<h1 align="center">wenda-webui</h1>

## 专为 wenda 设计的 webui

[wenda](https://github.com/l15y/wenda) 是一个 LLM 调用平台。为小模型外挂知识库查找和设计自动执行动作，实现不亚于于大模型的生成能力。
**本项目调用闻达的 api 接口实现类似于 new bing 的功能。**
技术栈：vue3 + element-plus + ts

### 特色功能

- 完整的会话管理功能
- 支持各种快捷键
- 会话中可直接看到知识库来源
- 支持自定义会话角色（待完成）
- 知识库来源可自定义（待完成）
- chatpdf（待完成）
- 类似于 autogpt 的功能（待完成）

### demo 演示

![会话管理](https://github.com/AlanLee1996/wenda-webui/blob/main/public/demo/%E4%BC%9A%E8%AF%9D%E7%AE%A1%E7%90%86%E5%8A%9F%E8%83%BD.png?raw=true)
![夜间模式](https://github.com/AlanLee1996/wenda-webui/blob/main/public/demo/%E5%A4%9C%E9%97%B4%E6%A8%A1%E5%BC%8F.png?raw=true)
![消息功能](https://github.com/AlanLee1996/wenda-webui/blob/main/public/demo/%E5%AE%8C%E6%95%B4%E7%9A%84%E6%B6%88%E6%81%AF%E5%8A%9F%E8%83%BD.png?raw=true)
![消息来源查看](https://github.com/AlanLee1996/wenda-webui/blob/main/public/demo/%E6%B6%88%E6%81%AF%E6%9D%A5%E6%BA%90%E6%9F%A5%E7%9C%8B.png?raw=true)

### TodoList

- [x] 基础功能
- [x] 设置项
- [x] 适配手机
- [x] 文档对话，支持 pdf、docx
- [ ] 支持自定义会话角色
- [ ] 知识库来源可自定义

### 更新内容

- 2023/5/19 新增文档对话功能，支持 pdf、docx
- 2023/5/15 完善配置文件和设置功能,完整适配手机
- 2023/4/27 测试版发布

### 注意

请先成功运行闻达主项目后，再运行本 webui。如果您遇到了任何问题，请先确认闻达自带的 ui 是否能正常使用！

### 安装

请先安装 [nodejs](https://pan.baidu.com/s/1p3-0F8eIZg6gMownXhiWQQ?pwd=oigr) ,然后再执行以下语句安装依赖

```bash
# 请在项目根目录下运行
npm install
```

### 环境变量

根目录下的.env 文件请配置为您的实际环境。127.0.0.1 的话只能本地访问。

### 启动

使用下面的命令行。  
或者直接运行根目录下的“一键启动.bat”

```bash
# 请在项目根目录下运行
npm run dev
```

## Star History

[![Star History Chart](https://api.star-history.com/svg?repos=AlanLee1996/wenda-webui&type=Date)](https://star-history.com/#AlanLee1996/wenda-webui&Date)
