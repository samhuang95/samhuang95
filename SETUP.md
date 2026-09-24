# 使用說明

## 放到你的 repo

把這個資料夾的內容（除了 `preview/`，那個只是給你看預覽用的，不用放進 repo）整個複製到
`samhuang95/samhuang95` 的根目錄：

```
projects.json
README.template.en.md
README.template.zh.md
package.json
.github/workflows/update-readme.yml
.github/scripts/...
```

`assets/` 資料夾第一次可以留空，跑完 workflow 就會自動產生 SVG 進去。

**語言：** 只做 light 版面（沒有 dark mode 了）。改用兩個語言版本：`README.md`
是英文、預設顯示（GitHub repo 首頁固定顯示 `README.md`），`README.zh-TW.md` 是繁體中文，
兩邊頁首互相有切換連結。GitHub 本身不支援像 dark mode 那種自動切換語言，所以是兩份獨立檔案，
不是一份檔案動態切換。

## 1. 填 projects.json

先把 `projects.json` 裡所有 `TODO` 開頭的欄位改成真的資料。`title` / `summary` /
`highlight` / `scaleNote` 都是 `{ "en": "...", "zh": "..." }` 兩個語言各一份 —— 英文我先
照你告訴我的事實翻了一版，麻煩你看一下用詞順不順、有沒有翻錯的地方。

- `tags`：**自由標籤陣列**，一個專案可以貼好幾個，例如 `["App", "LLM", "n8n"]`。標籤本身
  不分語言，英文版跟中文版頁面顯示同一個字串（跟 `stack` 的技術名稱一樣處理）。
  「標籤分布」那張圖會統計*每一個*標籤出現幾次（不限主標籤），畫成一牆徽章（pill），
  出現次數 >1 的會在文字後面加 `×N`。少數標籤（目前是 `.NET`、`Android`、`Three.js`）
  會多顯示一個真實品牌 logo，見下方「想幫標籤加品牌 icon」。
  **第一個標籤（`tags[0]`）是這個專案的「主分類」**，只有這個會拿來決定「開發時程」圖裡
  這個專案的 bar 要塗什麼顏色——因為一個專案的時間軸只能畫一種顏色，多標籤沒辦法直接拿來
  上色，所以需要一個「代表色」。想幫某個主分類換顏色或新增一個，去
  `.github/scripts/lib/i18n.js` 的 `CATEGORY_COLOR_ORDER` 加（最多 8 個，已經用 dataviz
  skill 的色盲安全驗證跑過）；沒登記的主分類不會報錯，就是圖上畫成灰色。
  （「開發頻率」圖不吃這個欄位——它是單一線圖，畫的是你整個 GitHub 帳號的貢獻活躍度，
  不分專案，詳見下面第 2 節。）
- `start` / `end`：`"YYYY-MM"` 格式，還在做的專案 `end` 填 `"ongoing"`。沒填的專案會直接
  從「開發時程」圖裡消失（不會亂猜日期），圖下面會註記還有幾個專案沒填。
- `repo`：如果是 public repo，填 `"owner/repo"`，該專案在「Projects」段落的標題就會變成連到
  GitHub repo 的連結；不是 public 的（例如 ASPNexV2）就留 `null`，標題就不會是連結。
- `scaleNote`：手寫的規模說明（兩個語言各一份，或整個留 `null` 表示不顯示這行），例如
  「導入 3 家企業客戶」「服務約 200 位內部使用者」，會顯示在該專案卡片的「規模」那一行。
  故意設計成手動填、不是自動算出來的，因為你最有代表性的專案（ASPNexV2）大概率是 private
  repo，GitHub API 本來就抓不到真實規模。（原本另外有一張獨立的「專案規模」長條圖，比較
  GitHub 上的程式碼庫大小，已經拿掉——意義不夠清楚，這行 `scaleNote` 才是真正有用的資訊。）

## 2. 設定 GitHub Secret

「開發頻率」現在是一張線圖，資料來自 GitHub 的 GraphQL `contributionsCollection`（跟你
個人頁面上那個貢獻方格是同一份資料，只是畫成折線），涵蓋你**所有** repo，不只是
`projects.json` 裡列的那幾個；如果你自己帳號設定有開「Include private contributions」，
連 private repo 的貢獻也會算進去。這個查詢用預設的 `GITHUB_TOKEN` 通常抓不到（scope
不夠）。去 GitHub 開一組 **Fine-grained personal access token**（或 classic token 也可以），
至少要有：

- `read:user`（讀 contribution 資料）

開好後，到 `samhuang95/samhuang95` → Settings → Secrets and variables → Actions，新增一個
名字叫 **`GH_README_TOKEN`** 的 repository secret，貼上 token。

## 3. 跑第一次

Push 上去之後，到 repo 的 Actions 分頁，找到「Update README data & charts」，手動點
**Run workflow** 跑一次（不用等排程的每日 21:00 UTC）。跑完會自動 commit `assets/*.svg`、
`README.md`、`README.zh-TW.md`。之後只要 `projects.json` 有改動、或每天排程，就會自動重新
整理。

## 本機測試（不會動到 GitHub）

```bash
npm install             # 唯一的套件依賴是 simple-icons（標籤徽章的品牌 logo 資料）
npm run charts          # 真的會打 GitHub API，需要環境變數 GH_README_TOKEN / GH_LOGIN
npm run readme          # 只重新組 README.md + README.zh-TW.md，不打 API
```

想單純看圖表設計、不想打真的 API，可以看 `preview/` 資料夾——`preview/render-preview.mjs`
是用示意資料畫的，`preview/full-readme-en.png` / `full-readme-zh.png` 是整頁組起來的樣子。

## 之後想調整

- 文案、段落順序：英文改 `README.template.en.md`，中文改 `README.template.zh.md`，
  `{{PROJECT_CARDS}}` 和 `{{GENERATED_AT}}` 是唯二的自動置換點，其他文字隨你改，兩份檔案
  互相獨立，不會互相覆蓋。
- 圖表上的固定文字（標題、圖例用語等）：都集中在 `.github/scripts/lib/i18n.js`，一個地方
  改兩個語言。
- 圖表顏色/版型：都在 `.github/scripts/charts/*.js`，每個檔案開頭都寫了這張圖對應哪種資料
  視覺化「job」（量值比較 / 時間趨勢 / 分類上色），改之前建議先看一下同一份注解。
- 想加一個新的主分類顏色：改 `.github/scripts/lib/i18n.js` 的 `CATEGORY_COLOR_ORDER`，
  目前 8 色是通過色盲安全驗證的順序（見下方指令），新增顏色前建議先驗證過：
  ```bash
  node <dataviz skill 路徑>/scripts/validate_palette.js "hex1,hex2,..." --mode light
  ```
- 想幫標籤加品牌 icon：只有「這個標籤本身就是一個品牌/技術」才適合加 icon（例如
  `.NET`、`Android`、`Three.js`），像 `App`、`Backend`、`AI/LLM` 這種概念性分類本來就
  沒有對應的 logo，不會、也不該幫它們硬套一個。步驟：
  1. 到 [simpleicons.org](https://simpleicons.org) 或跑
     `node -e "import('simple-icons').then(si => console.log(Object.keys(si)))"`
     找到品牌對應的 export 名稱（例如 Android 是 `siAndroid`）。
  2. 在 `.github/scripts/lib/icons.js` 的 `ICONS` 物件裡加一行
     `'標籤字串': siXxx,`（key 要跟 `projects.json` 裡 `tags` 的字串完全一樣）。
  3. 重新跑 `npm run charts`（或本機看 `preview/render-preview.mjs`），沒有對應到的
     標籤會自動維持純文字徽章，不會噴錯。
  icon 顏色用的是 simple-icons 內建的官方品牌色，不是走 `CATEGORY_COLOR_ORDER` 那組
  色盲安全分類色——因為這裡是品牌識別（一個牌子只有一種顏色），不是在對一個資料維度做
  分類編碼，兩者語意不同，故意分開處理。
