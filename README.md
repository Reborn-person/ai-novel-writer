# AI 小说创作工作室

一个专为超长篇网文创作打造的全流程工作流工具，从脑洞具象化到爆款小说生成。

## 🚀 功能特性

### 核心创作模块
- **脑洞具象化**：将模糊的脑洞转化为结构化的创作基础
- **大纲生成**：生成包含三幕式结构的500+章超级长篇大纲
- **细纲生成**：基于大纲生成逐章的详细细纲
- **开篇生成**：创作高留存率的前三章内容
- **章节批量**：基于细纲批量生成后续章节
- **仿写创作**：模仿特定风格进行原创内容创作
- **AI辅助写作**：智能续写和写作建议

### 智能储存管理
- **统一储存管理**：集中管理所有创作数据
- **可视化储存统计**：实时查看储存使用情况
- **项目导入导出**：支持完整项目的备份和恢复
- **TXT文件夹导出**：自动整理大纲、细纲、正文到结构化文件夹
- **数据安全备份**：本地自动备份功能

## 🛠️ 技术栈

- **前端框架**：Next.js 16.1.1 (App Router)
- **UI框架**：Tailwind CSS 4
- **图标库**：Lucide React
- **AI接口**：支持多种AI模型（SiliconFlow、OpenAI等）
- **储存**：浏览器本地储存（localStorage）
- **打包工具**：内置Next.js打包

## 📦 快速开始

### 本地开发

1. 克隆项目
```bash
git clone https://github.com/your-username/ai-novel-writer.git
cd ai-novel-writer
```

2. 安装依赖
```bash
npm install
```

3. 启动开发服务器
```bash
npm run dev
```

4. 打开浏览器访问 [http://localhost:3000](http://localhost:3000)

### 部署到 Vercel

1.  Fork 这个仓库到你的 GitHub 账户
2.  登录 [Vercel](https://vercel.com)
3.  点击 "New Project" 并选择你的 fork
4.  点击 "Deploy" 即可一键部署

## 📁 项目结构

```
ai-novel-writer/
├── app/                    # Next.js App Router
│   ├── module/[id]/       # 各模块页面
│   ├── settings/          # 设置页面
│   ├── storage/           # 储存管理页面
│   └── page.tsx           # 主页
├── components/            # 组件
│   ├── Sidebar.tsx        # 侧边栏
│   └── Module7Editor.tsx  # AI辅助写作编辑器
├── lib/                   # 工具库
│   ├── storage.ts         # 储存管理
│   └── ai.ts              # AI接口
└── public/                # 静态资源
```

## 🔧 储存功能详解

### 储存管理器 (StorageManager)

位于 `lib/storage.ts`，提供以下功能：

- **统一键名管理**：使用 `STORAGE_KEYS` 常量避免硬编码
- **数据操作**：`get()`, `set()`, `getJSON()`, `setJSON()`, `remove()`
- **项目导出**：`exportProject()` - 导出完整项目数据
- **项目导入**：`importProject()` - 导入项目数据
- **TXT导出**：`exportToTxtZip()` - 导出结构化TXT文件夹
- **储存统计**：`getStorageStats()` - 获取储存使用情况

### 储存键名规范

```typescript
// 设置相关
RAG_PROVIDER: 'novel_writer_rag_provider'
RAG_API_KEY: 'novel_writer_rag_api_key'
RAG_BASE_URL: 'novel_writer_rag_base_url'
RAG_MODEL: 'novel_writer_rag_model'

// 模块数据
MODULE_INPUT: (id: string) => `novel_writer_${id}_input`
MODULE_OUTPUT: (id: string) => `novel_writer_${id}_output`

// 模块7内容
MODULE7_CONTENT: 'novel_writer_module7_content'
```

## 🎯 使用指南

### 创作流程

1. **脑洞具象化** (模块1)：输入你的创意想法
2. **大纲生成** (模块2)：基于脑洞生成超级长篇大纲
3. **细纲生成** (模块2.5)：将大纲细化为逐章细纲
4. **开篇创作** (模块3)：创作高留存率的前三章
5. **章节批量** (模块4)：基于细纲批量生成后续章节
6. **仿写创作** (模块5)：模仿特定风格创作内容
7. **润色优化** (模块6)：对生成的内容进行润色
8. **AI辅助写作** (模块7)：智能续写和写作建议

### 储存管理

- 点击侧边栏 "储存管理" 进入储存页面
- 查看储存使用情况和数据统计
- 使用 "导出项目" 备份完整项目数据
- 使用 "导出TXT文件夹" 导出结构化文本文件
- 使用 "导入项目" 恢复之前备份的数据

## 🔒 环境变量

项目支持配置不同的AI服务提供商：

```env
# RAG服务配置
RAG_API_KEY=your_rag_api_key
RAG_BASE_URL=https://api.siliconflow.cn/v1
RAG_MODEL=deepseek-ai/DeepSeek-R1

# 写作服务配置
WRITING_API_KEY=your_writing_api_key
WRITING_BASE_URL=https://api.siliconflow.cn/v1
WRITING_MODEL=deepseek-ai/DeepSeek-R1
```

## 🤝 贡献指南

欢迎提交 Issue 和 Pull Request 来帮助改进这个项目。

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 🙏 致谢

- 感谢 Next.js 团队提供优秀的框架
- 感谢 Tailwind CSS 团队提供优雅的UI解决方案
- 感谢所有开源贡献者

---

**⭐ 如果这个项目对你有帮助，请给个 Star 支持一下！**