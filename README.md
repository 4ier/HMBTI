<div align="center">
<img width="1200" height="475" alt="HMBTI Banner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />

# HMBTI 
### Heavy Music Beholder Type Indicator (重型音乐体验者类型指标)
</div>

HMBTI 是一套用于描述「人如何通过重型音乐与自身产生连接」的类型系统，专为中文语境下的重型音乐乐迷（Hardcore / Metal / Punk / 极端音乐相关圈层）设计。

> [!NOTE]
> HMBTI 旨在提供一个关于音乐体验的描述框架，而非人格、性格或心理诊断工具。

## 核心特性
- **中文语境优先**：针对国内重型音乐圈层定制。
- **四个维度分析**：多维度剖析音乐体验。
- **匿名与隐私**：完全匿名，无需登录，数据仅供研究。
- **永久链接**：每次测试生成唯一的、可分享的永久结果页面。

## 用户流程
1. **首页**：了解项目背景与说明。
2. **测试页**：完成 4 个维度的随机抽题作答。
3. **回访问卷**：提供基础的乐迷背景信息。
4. **结果页**：查看 HMBTI 类型代码、解释及分享。

## 技术栈
- **前端**: React + Vite + TypeScript (部署于 GitHub Pages)
- **后端**: Supabase (PostgreSQL, RLS)
- **样式**: CSS + SVG 动态生成
- **设计**: 基于重型音乐美学的视觉设计

## 本地运行

**前置条件:** Node.js (v18+)

1. **克隆并安装依赖:**
   ```bash
   npm install
   ```

2. **配置环境变量:**
   参考 `.env.example` 创建 `.env` 文件，填入你的 Supabase 凭证。

3. **启动开发服务器:**
   ```bash
   npm run dev
   ```

## 贡献与研究
本项目由 [4ier](https://github.com/4ier) 发起。如果您对研究数据或合作感兴趣，请通过 GitHub Issue 联系。
