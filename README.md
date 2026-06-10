# 🏆 「贏」養複利計畫

**基於 InBody 的動態 AI 生理資產配置平台**

[![Competition](https://img.shields.io/badge/競賽-2026第十屆Healthy×Happy-teal?style=flat)](https://incubation.ntunhs.edu.tw/tab/528/id/1911)
[![Award](https://img.shields.io/badge/🥉_全國第三名-2026_Healthy×Happy-CD7F32?style=flat)]()
[![Team](https://img.shields.io/badge/團隊-贏家精算師-orange?style=flat)]()
[![Live Demo](https://img.shields.io/badge/🌐_線上Demo-Live-success?style=flat)](https://nutrition-demo-nine.vercel.app)

> 「我們不是在做營養 APP，我們是在打造每個人的 AI 健康導航員」  
> 讓數據有溫度、讓健康有價值、讓人生有複利。

> 🥉 **榮獲 2026 第十屆全國大專校院「Healthy × Happy」創新創業競賽 — 全國第三名**

**🌐 線上體驗：[https://nutrition-demo-nine.vercel.app](https://nutrition-demo-nine.vercel.app)**

---

## 專案背景

多數使用者會定期測量 InBody，獲取精準的肌肉量、體脂肪率與基礎代謝率，但這些數據往往只停留在健身房報表或 App 的「過去紀錄」裡，**無法即時導向當下的飲食決策**。

現行健康管理工具面臨兩大核心痛點：

| 問題 | 現況 |
|------|------|
| **資訊孤島** | 數據分散各平台，無法整合，僅停留「過去紀錄」 |
| **行動斷層** | 只記錄過去熱量，無法告訴你「接下來該補充什麼」 |

**贏養複利計畫** 的目標是填補這個缺口：將 InBody 靜態生理數據，轉化為動態 AI 營養導航，讓每一口營養攝取都成為具備複利效益的健康投資。

---

## 核心功能

### 1. InBody 數據自動同步助手
透過深度 API 串接，使用者完成量測後數據即時同步至雲端，自動抓取肌肉量、BMR、體水份比例等關鍵指標，徹底解決手動輸入繁瑣問題。

### 2. 動態營養導航儀表板
整合穿戴裝置（Apple Watch、Garmin）即時活動量，啟動「動態代謝補償」引擎，將模糊熱量概念轉化為結構化行動指標（蛋白質預算、水份缺口）。

### 3. 代謝人格分析（Metabolic MBTI）
利用小語言模型（SLM）將累積的生理行為數據轉化為可解釋的「代謝行為人格」，提供具體可執行的資產配置建議。

### 4. 健康複利共學社群
透過代謝人格分類、匿名基準比較與遊戲化任務機制，將孤立的飲食控制行為升級為「群體共學場域」，實質強化行為持續性。

### 5. 精準營養學堂
與儀表板數據連動的 AI 導學系統，形成「遇到問題 → 學會概念 → 回到實作」的學習閉環。

---

## 技術架構

```
精準生理數據          AI 代謝解析           營養預算導航
InBody + 穿戴裝置  →  SLM 小語言模型    →  主動告訴你下一餐怎麼吃
即時同步合一           動態分析需求
```

**技術棧：**

![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-0055FF?style=flat&logo=framer&logoColor=white)
![Python](https://img.shields.io/badge/Python-3776AB?style=flat&logo=python&logoColor=white)
![API](https://img.shields.io/badge/InBody_API-Deep_Integration-teal?style=flat)
![SLM](https://img.shields.io/badge/SLM-小語言模型-purple?style=flat)

---

## 線上體驗 & 本地啟動

### 線上 Demo
👉 **[https://nutrition-demo-nine.vercel.app](https://nutrition-demo-nine.vercel.app)**

> 建議使用 **Chrome** 開啟以獲得最佳體驗：
> - 🎙️ **語音輸入**：需允許麥克風權限（Web Speech API）
> - 📷 **掃描營養標示**：首次使用會下載中文辨識語言包，需網路連線（Tesseract.js OCR）
> - 🎬 **學堂影片**：YouTube 嵌入播放，需網路連線

### 本地開發

```bash
# 1. 取得專案
git clone https://github.com/BoRenCheng/healthy-happy-2026.git
cd healthy-happy-2026

# 2. 安裝相依套件
npm install

# 3. 啟動開發伺服器（http://localhost:5173）
npm run dev

# 其他指令
npm run build      # 產出 production 版本至 dist/
npm run preview    # 在本地預覽 build 結果
```

### Demo 實作技術棧

| 類別 | 使用技術 |
|------|----------|
| 前端框架 | React 18 + Vite 5 |
| 樣式 | Tailwind CSS v4 |
| 動畫 | Framer Motion |
| 圖表 | Recharts（趨勢圖、雷達圖、雙欄對比） |
| 語音辨識 | Web Speech API（瀏覽器原生，免金鑰） |
| 影像辨識 | Tesseract.js（前端 OCR，繁中＋英文） |
| 圖示 / 字型 | lucide-react · Noto Sans TC |
| 部署 | Vercel |

> 📌 本 Demo 採前端純客戶端實作，所有辨識與運算皆在瀏覽器完成、**不需任何 API Key**，可直接部署與公開展示。

---

## 商業模式

採「**C 端驗證需求，B 端放大規模**」雙軌策略：

| 階段 | 時間 | 核心目標 |
|------|------|----------|
| POC | 0–6 個月 | 免費工具切入，累積生理行為數據 |
| POS | 6–18 個月 | Freemium 訂閱（NT$149/月），驗證付費意願 |
| POB | 18–36 個月 | B2B2C 模組授權（健身房、企業ESG、健檢機構） |

預估推廣成熟期付費會員 **4,800 人**，年經常性收入（ARR）約 **858 萬元**。

---

## 🏅 競賽成績

> 🥉 **全國第三名** — 2026 第十屆全國大專校院「Healthy × Happy」創新創業競賽  
> 主辦單位：國立臺北護理健康大學育成中心

---

## 📄 授權

Copyright (c) 2026 贏家精算師 Team  
本專案採用 MIT License 授權。
