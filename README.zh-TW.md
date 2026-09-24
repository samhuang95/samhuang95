<h1 align="center">黃威儒 Sam Huang</h1>
<p align="center">全端工程師・碳盤查 × AI 系統｜.NET 8 / C# ・ Vue 3 ・ MSSQL</p>

<p align="center">
  <a href="README.md">English</a> ·
  <a href="https://www.linkedin.com/">LinkedIn</a> ·
  <a href="mailto:sam.huang.veda@gmail.com">Email</a> ·
  <!-- TODO: 換成你的 Linktree / 作品集連結 -->
  <a href="https://sam-showcase.com/">作品集</a>
</p>

比起「會什麼語言」，我更想讓這頁 README 說清楚**我實際做過什麼類型的專案、花多久做出來、做到多大**。技術棧列在最後面，當附錄。

目前身分：全端工程師，同時是中興大學（資工所）在職碩士生；主線工作是企業碳排放管理系統，另外有幾個自己維護專案。

---

### 標籤分布

<img src="assets/tags-zh.svg" alt="專案標籤出現次數">

### 開發時程

<img src="assets/timeline-zh.svg" alt="專案開發時程圖">

### 貢獻活躍度

<img src="assets/activity-zh.svg" alt="近 12 個月貢獻活躍度圖，涵蓋所有 repo">

---

### 專案

#### ASPNexV2

`Enterprise` `Carbon/GHG` `.NET` · ? – 進行中

企業碳排放管理系統：多語系碳盤查報告、GHG Protocol 合規、排放係數管理、CBAM 相關功能

- 亮點: 7 語系 SQL Views、NPOI Excel 匯出含圖片、GHG 資料彙整邏輯
- 技術: .NET 8 · C# · Vue 3 · MSSQL · EF Core · Dapper · AutoMapper · NPOI

#### 即時語音翻譯系統（碩士論文）

`AI/LLM` `Research` `Speech` · ? – 進行中

Speech-to-text 銜接 LLM 翻譯的即時系統；建立人工校正的 ground truth 資料集並比對系統輸出準確度

- 亮點: 處理多語言 code-switching 場景下的辨識與翻譯準確度問題
- 技術: LLM · Speech-to-Text · Python

#### Tool Retrieval 架構設計

`AI/LLM` `Backend` · ? – ?

大型 API 系統的 Tool Retrieval 架構：正規化 SQL API catalog schema + LLM (Gemini) 選路設計

- 亮點: API 文件格式最佳實務整理，並區分哪些建議有研究依據、哪些是自行歸納
- 技術: .NET 8 · C# · SQL · Gemini

#### VocaPeak

`App` `Android` · ? – 進行中

單字練習 App（Web + Android）：Daily 卡片、複習、Goals 目標排程，用來準備多益

- 亮點: Goals 頁面可依目標範圍與期限自動換算每日練習量
- 技術: Vue 3 · Android

#### 叭噗 Babu

`Creative AI` `3D` `Three.js` · ? – 進行中

原創角色叭噗（冰淇淋生物）的 3D 建模與生成式 AI 開發，目標是做成 LINE 貼圖／社群曝光

- 亮點: Three.js 重建：lathe geometry + toon shading + inverted hull outline
- 技術: Three.js · Stable Diffusion / Flux LoRA

---

<details>
<summary>技術棧（附錄）</summary>
<br>

**後端：** C# ・ .NET 8 ・ Entity Framework Core ・ Dapper ・ AutoMapper
**前端：** Vue 3
**資料庫：** MSSQL
**其他：** NPOI ・ Docker ・ Three.js ・ LLM 應用（RAG / 工具檢索）

</details>

<p align="right"><sub>最後更新：2026-09-24 02:32 UTC（GitHub Actions 自動產生，資料來源見 <code>projects.json</code>）</sub></p>
