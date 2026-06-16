# LeadFlow Pro — AI-Powered Lead Generation Platform 🚀

**LeadFlow Pro** is a modern, high-performance, bilingual (Arabic & English) lead generation dashboard. It integrates seamlessly with **N8N** and the **Google Places API** to help businesses search, analyze, and export potential B2B leads instantly based on industry sector, location, and radius.

Designed with a premium dark mode, glassmorphism aesthetics, interactive charts, and full RTL layout support for Arabic language.

---

## 🌟 Key Features

- 🌐 **Bilingual User Interface**: Toggle between English (LTR) and Arabic (RTL) with localized forms, tables, and statistics.
- 📊 **Interactive Analytics Dashboard**:
  - **Doughnut Chart**: Visualizes lead rating distributions.
  - **Bar Chart**: Highlights top business categories/types found.
  - **Stats Cards**: Displays total leads, average rating, percentage of leads with phone numbers, and percentage of leads with websites.
- 🔍 **Flexible Search Parameters**: Search by business type/industry, location (coordinates or city name), and adjustable search radius.
- 📋 **Professional Data Table**: Complete with real-time text filtering, minimum rating filters, sorting, and pagination.
- 📤 **One-Click Export**: Export lead results directly to **CSV** or **Excel** spreadsheets.
- 🔗 **N8N Workflow Integration**: Fully automated backend pipeline that handles text search, place details extraction, and response formatting.

---

## 📁 Repository Structure

```bash
├── src/
│   ├── main.js        # App entry point
│   ├── app.js         # Main UI rendering, translation, and charts logic
│   ├── api.js         # API integration layer and encoding correction
│   ├── config.js      # App configurations & Environment fallbacks
│   ├── utils.js       # Helper utilities (Excel export, counters, alerts)
│   └── style.css      # Custom CSS tokens & Glassmorphism styles
├── index.html         # Frontend HTML structure with i18n
├── n8n_workflow.json  # Exported N8N Workflow (ready to import)
├── .env.example       # Example Environment variables template
├── .gitignore         # Untracked files list
└── package.json       # Node.js project scripts & dependencies
```

---

## ⚙️ Installation & Setup

### 1️⃣ Import the N8N Workflow
1. Open your N8N workspace.
2. Create a new workflow.
3. Click on the top-right menu and select **Import from File**.
4. Choose the `n8n_workflow.json` file from this repository.
5. In N8N, double-click the **Google Maps Search** and **Get Place Details** nodes, and insert your **Google Maps API Key** where it says `YOUR_GOOGLE_MAPS_API_KEY`.
6. Save and **Publish** the workflow (or keep it in test mode to try it first).

### 2️⃣ Clone the Frontend Repository
```bash
git clone <your-repository-url>
cd lead-gen
```

### 3️⃣ Configure Environment Variables
Copy `.env.example` to `.env` and fill in your N8N webhook URL:
```bash
cp .env.example .env
```
Open `.env` and configure:
```env
VITE_N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook/leadflow-search
VITE_USE_MOCK_DATA=false
```
> ⚠️ **Note**: If your N8N workflow is **inactive (testing mode)**, use the `/webhook-test/` path. If the workflow is **active (production)**, use the `/webhook/` path in the URL.

### 4️⃣ Install Dependencies & Run Locally
Make sure you have [Node.js](https://nodejs.org/) installed, then run:
```bash
# Install dependencies
npm install

# Start local development server (Vite)
npm run dev
```
Open `http://localhost:3000` in your browser to view the application!

---

## 🔒 Security & API Key Protection
This project is built following strict security best practices:
- **No Client-Side Secrets**: All Google Maps API Keys are securely stored and executed on the **N8N Server (backend)**. The frontend only communicates with N8N via a webhook URL.
- **Environment Variables**: Frontend configurations (like the N8N Webhook URL) are loaded using Vite environment variables (`.env`), which are excluded from Git commits via `.gitignore`.

---

## 🛠️ Built With
- **Frontend**: HTML5, Vanilla JavaScript (ES Modules), Vanilla CSS
- **Charts**: [Chart.js](https://www.chartjs.org/)
- **Spreadsheet Library**: [SheetJS (XLSX)](https://sheetjs.com/)
- **Backend/Automation**: [N8N](https://n8n.io/)
- **Data Source**: [Google Places API](https://developers.google.com/maps/documentation/places/web-service/overview)

---

# LeadFlow Pro — منصة توليد العملاء المحتملين بالذكاء الاصطناعي 🚀

منصة متطورة واحترافية ثنائية اللغة (عربي وإنجليزي) للبحث عن العملاء وتصدير البيانات، متصلة بشكل مباشر مع نظام الأتمتة **N8N** و **Google Places API**.

## 🌟 مميزات المنصة:
- **واجهة ثنائية اللغة**: تدعم التبديل السلس بين العربية (RTL) والإنجليزية (LTR).
- **لوحة تحكم تفاعلية**: إحصائيات حية، ومخططات بيانية دائرية وعمودية لتوزيع التقييمات وتصنيف الأعمال.
- **تصدير سهل بضغطة زر**: تصدير النتائج إلى ملفات **Excel** أو **CSV**.
- **حماية كاملة للبيانات**: لا توجد أي مفاتيح برمجية (API Keys) في كود الفرونتد، فجميع المفاتيح الحساسة محفوظة ومخفية بشكل آمن داخل خادم الـ N8N.
