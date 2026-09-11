# Territory Capture — Web Demo (Story Mode)

เกม Web Demo สไตล์ Arcade Territory Capture (แนวคลาสสิกอย่าง **Qix / Xonix / Gals Panic**)  
ในรูปแบบ **แนวตั้ง 9:16** พร้อมโหมดเนื้อเรื่อง **4 ฉากต่อเนื่อง (1 เรื่องราว)**  
พัฒนาด้วย Pure HTML5, CSS3, และ JavaScript (Canvas 2D API) โดยไม่มี Framework หรือ External Dependency ใด ๆ

---

## 📖 ระบบเนื้อเรื่องและการเปิดเผยภาพ (Story Mode & Image Reveal)

1. **อัตราส่วน 9:16 (Vertical Layout)**: ปรับขนาดกระดาน Base 450×800 px ให้พอดีกับหน้าจอมือถือและรูปภาพแนวตั้ง
2. **การเปิดเผยภาพ (Image Reveal)**:
   - พื้นที่ว่างที่มีบอสวิ่งอยู่จะถูกปกคลุมด้วยม่านหมอกสีมืด
   - เมื่อตัดยึดพื้นที่สำเร็จ (CLAIMED) จะเปิดเผยรูปภาพฉากนั้น ๆ ด้านใต้ออกมาทันที
   - เมื่อยึดพื้นที่ได้ครบตามเป้าหมาย (≥ 80%) ตัวเกมจะ **เปิดเผยรูปภาพเต็ม 100%** ให้ผู้เล่นได้ชมความสมบูรณ์ของภาพก่อน
3. **การดำเนินเรื่องต่อเนื่อง (4 ฉาก / 1 เรื่องราว)**:
   - **ฉากที่ 1**: `assets/scene/1/1.jpeg`
   - **ฉากที่ 2**: `assets/scene/1/2.jpeg`
   - **ฉากที่ 3**: `assets/scene/1/3.jpeg`
   - **ฉากที่ 4**: `assets/scene/1/4.jpeg`
   - เมื่อผ่านแต่ละฉาก สามารถกดปุ่ม **NEXT SCENE** เพื่อเล่นฉากถัดไปตามลำดับจนจบเรื่องราว (STORY COMPLETE)

---

## 🎮 กฎกติกาการเล่น (Objective & Rules)

1. **การควบคุม**: ผู้เล่นเริ่มต้นอยู่บนเส้นขอบ (Border) ของสนาม
2. **การลากเส้น (Drawing)**: ก้าวออกจากขอบเข้าสู่พื้นที่ว่างสีดำ (EMPTY) เพื่อลากเส้น Trail สีส้ม
3. **การยึดพื้นที่ (Capture)**: ลากเส้นกลับไปเชื่อมต่อกับขอบอีกฝั่ง ระบบจะใช้ BFS Flood Fill คำนวณและยึดพื้นที่ส่วนที่ **ไม่มี Boss** ให้กลายเป็นพื้นที่ของคุณ (CLAIMED สีฟ้า)
4. **อันตราย (Danger)**:
   - ห้ามให้ Boss สีแดงชนเส้น Trail หรือชนตัวผู้เล่นในขณะที่กำลังลากเส้น
   - ห้ามถอยหลัง 180 องศา หรือเลี้ยวกลับมาชนเส้น Trail ของตัวเอง
5. **เป้าหมายชัยชนะ (Win Condition)**: ยึดพื้นที่ให้ได้อย่างน้อย **80%** เพื่อผ่านด่าน (LEVEL CLEAR!)

---

## 🕹️ การควบคุม (Controls)

### 💻 Desktop (คีย์บอร์ด)
| ปุ่ม | หน้าที่ |
| :--- | :--- |
| **Arrow Keys** หรือ **W, A, S, D** | เคลื่อนที่ (ขึ้น, ลง, ซ้าย, ขวา) |
| **R** | รีสตาร์ทเกม (Restart) |
| **P** | พักเกมชั่วคราว (Pause / Resume) |
| **`** (Tilde / Backquote) | เปิด / ปิด โหมด Debug Overlay (FPS, Grid, Coordinates) |

### 📱 Mobile (หน้าจอสัมผัส / มือถือ)
| การควบคุม | หน้าที่ |
| :--- | :--- |
| **Virtual D-Pad** (ปุ่ม ▲, ▼, ◀, ▶) | แตะปุ่มลูกศรเพื่อควบคุมทิศทาง |
| **Swipe บนหน้าจอ Canvas** | ปัดนิ้ว (ปัดขึ้น/ลง/ซ้าย/ขวา) เพื่อเปลี่ยนทิศทาง |
| **ปุ่ม ⏸ (ในแถบ HUD)** | พักเกมชั่วคราว (Pause) |
| **ปุ่ม 🔄 (ในแถบ HUD)** | รีสตาร์ทเกม (Restart) |

---

## 🚀 วิธีการรันเกมในเครื่อง (Local Run)

### วิธีที่ 1: เปิดไฟล์ตรง ๆ บน Browser
ดับเบิลคลิกเปิดไฟล์ `index.html` ด้วย Web Browser ใดก็ได้ (เช่น Chrome, Safari, Edge)

### วิธีที่ 2: รันผ่าน Local HTTP Server
```bash
npx serve .
# หรือ
python3 -m http.server 8000
```
จากนั้นเปิด Browser ไปที่ `http://localhost:8000` (หรือ URL ที่แสดงใน Terminal)

---

## 🌐 วิธีนำขึ้น GitHub (Push to GitHub)

1. สร้าง Repository ใหม่บน [GitHub.com](https://github.com/new) (เช่น ตั้งชื่อว่า `territory-capture`)
2. เชื่อมต่อ Remote และ Push โค้ดขึ้น GitHub:
```bash
git remote add origin https://github.com/<YOUR_USERNAME>/territory-capture.git
git branch -M main
git push -u origin main
```
*(หากใช้ SSH: `git remote add origin git@github.com:<YOUR_USERNAME>/territory-capture.git`)*

---

## ⚡ วิธี Deploy บน Vercel (Vercel Deployment)

โปรเจกต์นี้มีไฟล์ `vercel.json` และโครงสร้างเว็บแบบ Static HTML/JS พร้อมใช้งานบน Vercel ทันที:

### วิธีที่ 1: Deploy ผ่าน Vercel Dashboard (แนะนำ — อัปเดตอัตโนมัติเมื่อ push code)
1. ไปที่ [Vercel Dashboard](https://vercel.com/dashboard) แล้วล็อกอิน
2. คลิก **Add New...** > **Project**
3. เลือก Repository `territory-capture` จาก GitHub ของคุณ
4. Framework Preset ให้เลือกเป็น **Other** (หรือ Vercel จะตรวจจับเป็น Static Site ให้อัตโนมัติ)
5. คลิก **Deploy** — รอไม่เกิน 15 วินาที เว็บเกมจะพร้อมเล่นทันทีผ่าน Public URL!

### วิธีที่ 2: Deploy ผ่าน Vercel CLI บนเครื่อง
```bash
npx vercel
```
ทำตามขั้นตอนบน Terminal เพื่อล็อกอินและเลือก Deploy ได้ทันที

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
territory-capture/
├── index.html        # โครงสร้างหน้าเว็บ หน้าเลือกด่าน Canvas HUD และ Modals
├── style.css         # ดีไซน์สไตล์มินิมอล รองรับจอ 9:16 บนมือถือและ Desktop
├── game.js           # Game Engine, ฟิสิกส์บอสและลูกน้อง, BFS Flood Fill
├── package.json      # Metadata และ npm scripts
├── vercel.json       # การตั้งค่า Cache และ Clean URLs สำหรับ Vercel
├── .gitignore        # กำหนดไฟล์ที่ไม่ต้องนำขึ้น Git
├── README.md         # เอกสารแนะนำและคู่มือการใช้งาน
├── assets/           # โฟลเดอร์รูปภาพแยกตามเรื่องราว
│   └── scene/
│       ├── 1/        # เรื่องราวที่ 1 (1.jpeg, 2.jpeg, 3.jpeg, 4.jpeg)
│       └── 2/        # เรื่องราวที่ 2 (1.jpeg, 2.jpeg, 3.jpeg, 4.jpeg)
└── ai/               # ข้อกำหนดและเอกสาร Task breakdown
```

---

## ⚙️ คุณสมบัติทางเทคนิค (Technical Highlights)

- **Canvas 2D Rendering**: แสดงผล 60 FPS บนสัดส่วนแนวตั้ง 9:16 (450×800) เหมาะกับหน้าจอมือถือ
- **Boss & Minions AI**: บอสตัวใหญ่พร้อมลูกน้องปิศาจค้างคาวเพิ่มขึ้นตามความยากของแต่ละด่าน
- **BFS Flood Fill Capture**: คำนวณแบ่งอาณาเขตที่ถูกตัดยึดอย่างรวดเร็วและแม่นยำ
- **Zero Dependencies**: ไม่มี Framework หนัก ๆ ทำงานลื่นไหล เบา โหลดเร็ว ไม่ต้องพึ่งไลบรารีภายนอก

