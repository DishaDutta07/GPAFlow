# GPAFlow — Precision Academic GPA & CGPA Engine

**GPAFlow** is a modern, highly aesthetic, mobile-responsive **GPA and Cumulative GPA (CGPA) Calculator** and academic analytics platform. It features real-time calculation previews, custom grading scale builders, target "what-if" planning, semester history tracking with progression charts, and instant PDF/CSV transcript export.

Built with **React 18, Tailwind CSS, Framer Motion, and Node.js/Express**, GPAFlow is 100% self-hostable with single-command deployment and Docker support.

---

## 🌟 Key Features

### 1. 🎨 Modern Aesthetic Design & UI/UX
- **Dual Themes**: Polished Dark Mode (deep slate backdrop with vibrant indigo/violet accents and glowing effects) & Clean Light Mode.
- **Glassmorphism**: Backdrop blur cards, smooth box shadows, and `rounded-2xl` corners.
- **Interactive Visual Gauge**: Animated SVG radial gauge ring dynamically changes color based on GPA standing (Purple, Indigo, Emerald, Amber, Rose) with celebratory confetti.
- **Fully Responsive**: Mobile-first layout optimized for smartphones, tablets, laptops, and ultra-wide displays.

### 2. 🧮 Comprehensive Calculation Engine
- **Semester GPA Formula**:
  $$\text{GPA} = \frac{\sum (\text{Credits} \times \text{Grade Points})}{\sum \text{Total Credits}}$$
- **Cumulative GPA (CGPA) Mode**:
  $$\text{New CGPA} = \frac{(\text{Prior GPA} \times \text{Prior Credits}) + \text{Semester Quality Points}}{\text{Prior Credits} + \text{Semester Credits}}$$
- **Target GPA Planner ("What-If" mode)**:
  Calculate exactly what GPA you must maintain across future credits to graduate with your desired target CGPA.
- **Academic Honors Badges**:
  Dynamic recognition including *Summa Cum Laude (Dean's List)*, *Magna Cum Laude*, *Cum Laude*, *First Class with Distinction*, and *Good Academic Standing*.

### 3. 🎯 Multi-Scale & Custom Scale Builder
- **Standard US 4.0 Scale** ($A+ = 4.0, A = 4.0, A- = 3.7, B+ = 3.3, \dots$)
- **US 4.33 Scale** ($A+ = 4.33, A = 4.0, \dots$)
- **10.0 Scale** ($O = 10, A+ = 9, A = 8, B+ = 7, \dots$ for Indian & International Universities)
- **5.0 Scale** ($A = 5.0, B = 4.0, \dots$)
- **Direct Percentage Mode (0–100%)**
- **Custom Scale Builder**: Define and store your institution's custom grade-to-point mappings.

### 4. 📚 Semester History & Analytics
- **Persistent Storage**: Save multiple semesters to the backend database with automatic local offline fallback.
- **GPA Progression Timeline**: Interactive trend area chart tracking GPA and credit accumulation over time.
- **1-Click Restore**: Load any historical semester directly back into the calculator.

### 5. 📄 Verified Export & Sharing
- **PDF Academic Transcript**: Download an official formatted report with student details, course table, quality points, and verification badge.
- **CSV Summary**: Export structured calculation spreadsheets compatible with Excel and Google Sheets.
- **Course Schedule Templates**: 1-click presets for Computer Science, Engineering, Pre-Med, Business, and General Education.

---

## 🚀 Quick Start & Self-Hosting Guide

### Prerequisites
- **Node.js**: v18.0.0 or higher
- **npm**: v9.0.0 or higher
- *(Optional)* **Docker & Docker Compose**

---

### Option 1: Quick Local Run (Development)

1. **Clone or navigate to the project directory**:
   ```bash
   cd GPAFlow
   ```

2. **Install all dependencies** (root, frontend, and backend):
   ```bash
   npm run install:all
   ```

3. **Start both backend and frontend concurrently**:
   ```bash
   npm run dev
   ```

4. Open your browser:
   - **Frontend App**: [http://localhost:3000](http://localhost:3000)
   - **Backend REST API**: [http://localhost:5000/api](http://localhost:5000/api)

---

### Option 2: Single-Port Production Run

To run both the frontend and backend on a single port (port `5000`):

1. **Build the frontend**:
   ```bash
   npm run build
   ```

2. **Start the production server**:
   ```bash
   npm start
   ```

3. Open [http://localhost:5000](http://localhost:5000) in your browser. The Express server automatically serves the compiled frontend and all REST endpoints!

---

### Option 3: Docker & Docker Compose (Recommended for Self-Hosting)

Run GPAFlow in a lightweight, isolated Docker container:

1. **Start the container**:
   ```bash
   docker compose up -d
   ```

2. **Access the application**:
   - Web App: [http://localhost:5000](http://localhost:5000)

3. **Stop the container**:
   ```bash
   docker compose down
   ```

Data is persisted automatically in the named volume `gpaflow_data`.

---

### Option 4: PM2 on a Linux VPS (Ubuntu / Debian)

1. **Install PM2**:
   ```bash
   sudo npm install -g pm2
   ```

2. **Build and start**:
   ```bash
   npm run build
   pm2 start backend/src/server.js --name "gpaflow"
   pm2 startup
   pm2 save
   ```

3. **Configure Nginx Reverse Proxy** (`/etc/nginx/sites-available/gpaflow`):
   ```nginx
   server {
       listen 80;
       server_name gpa.yourdomain.com;

       location / {
           proxy_pass http://127.0.0.1:5000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

### Option 5: Free Cloud Hosting (Render / Railway)

1. Connect your GitHub repository to **Render** or **Railway**.
2. Select **Web Service** / **Node.js Environment**.
3. Set **Build Command**:
   ```bash
   npm install && cd frontend && npm install && npm run build && cd ../backend && npm install
   ```
4. Set **Start Command**:
   ```bash
   node backend/src/server.js
   ```
5. Set environment variable `PORT=5000`.

---

## 📡 REST API Reference

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Service health status check |
| `GET` | `/api/scales` | Get all predefined grading scales |
| `POST` | `/api/calculate` | Validate inputs & compute semester/cumulative GPA |
| `POST` | `/api/calculate/target` | Target GPA / What-if planner calculation |
| `GET` | `/api/history` | Retrieve saved semesters history |
| `POST` | `/api/save` | Save or update a semester record |
| `DELETE` | `/api/history/:id` | Remove a semester from history |
| `POST` | `/api/export-pdf` | Generate and download official PDF transcript |

### Sample Calculate Request (`POST /api/calculate`)
```json
{
  "scaleId": "us_4_0",
  "courses": [
    { "name": "Data Structures", "credits": 4, "grade": "A" },
    { "name": "Linear Algebra", "credits": 3, "grade": "A-" },
    { "name": "Physics II", "credits": 4, "grade": "B+" }
  ],
  "cumulativeData": {
    "previousGpa": 3.75,
    "previousCredits": 32
  }
}
```

---

## 📁 Project Structure

```
GPAFlow/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── scales.js           # Scale profiles (4.0, 4.33, 10.0, 5.0, Percentage)
│   │   ├── controllers/
│   │   │   └── gpaController.js    # API controller logic
│   │   ├── db/
│   │   │   └── store.js            # Persistent history storage
│   │   ├── routes/
│   │   │   └── api.js              # REST endpoints definition
│   │   ├── utils/
│   │   │   ├── calculator.js       # Mathematical computation formulas
│   │   │   └── pdfGenerator.js     # PDFKit transcript builder
│   │   └── server.js               # Express server & static asset host
│   ├── package.json
│   └── test-api.js                 # Automated API test suite
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx          # App bar, Theme switcher & Modals triggers
│   │   │   ├── GpaGauge.jsx        # SVG radial gauge ring & honors badge
│   │   │   ├── StatsSummary.jsx    # Hero statistics cards
│   │   │   ├── CourseTable.jsx     # Dynamic subject rows & toolbar
│   │   │   ├── CourseRow.jsx       # Individual course item with micro-motion
│   │   │   ├── CumulativeModal.jsx # Cumulative CGPA & Target Planner
│   │   │   ├── GradeScaleModal.jsx # Grade scale selector & custom builder
│   │   │   ├── HistoryDrawer.jsx   # Saved semester history & trend chart
│   │   │   ├── ExportModal.jsx     # PDF & CSV transcript export dialog
│   │   │   └── PresetsModal.jsx    # Curriculum templates
│   │   ├── services/
│   │   │   └── api.js              # API communication layer + offline fallback
│   │   ├── utils/
│   │   │   ├── calculator.js       # Client calculation logic
│   │   │   └── pdfExport.js        # Client PDF & CSV export
│   │   ├── App.jsx                 # Master application view
│   │   ├── index.css               # Tailwind & Glassmorphism styles
│   │   └── main.jsx
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
├── Dockerfile                      # Multi-stage Docker container specification
├── docker-compose.yml              # 1-click Docker Compose config
├── package.json                    # Root orchestrator
└── README.md                       # Documentation & self-hosting manual
```

---

## 📜 License

MIT License. Free for personal, academic, and commercial hosting.
