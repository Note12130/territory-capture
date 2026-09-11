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

## 🚀 วิธีการรันเกม (How to Run)

### วิธีที่ 1: เปิดไฟล์ตรง ๆ บน Browser
ดับเบิลคลิกเปิดไฟล์ `index.html` ด้วย Web Browser ใดก็ได้ (เช่น Google Chrome, Safari, Edge, Firefox)

### วิธีที่ 2: รันผ่าน Local HTTP Server
เปิด Terminal เข้าสู่โฟลเดอร์โปรเจกต์แล้วรันคำสั่ง:

```bash
python3 -m http.server 8000
```

จากนั้นเปิด Browser ไปที่:
```text
http://localhost:8000
```

---

## 📁 โครงสร้างโปรเจกต์ (Project Structure)

```text
territory-capture/
├── index.html        # โครงสร้างหน้าเว็บ Canvas, HUD และ Overlay Modals
├── style.css         # Minimal Flat UI Responsive styling (4:3 aspect ratio)
├── game.js           # Core Game Engine, BFS Flood Fill, Physics & Collision
├── README.md         # คู่มือการติดตั้งและวิธีเล่น
└── ai/               # ข้อกำหนดและเอกสาร Task breakdown
    ├── requirement.md
    ├── task.md
    ├── task1.md ... task9.md
```

---

## ⚙️ คุณสมบัติทางเทคนิค (Technical Highlights)

- **Canvas 2D Rendering**: ทำงานที่ 60 FPS บนความละเอียด 800×600 พิกเซล
- **Responsive Layout**: รักษาอัตราส่วน 4:3 บนหน้าจอทุกขนาด ทั้ง Desktop และ Mobile
- **Grid Representation**: ตารางจำลองพื้นที่ 80×60 ช่อง (Cell Size 10px) พร้อมคำนวณพื้นที่แบบ 1D Flat Array
- **BFS Flood Fill**: ค้นหาขอบเขตของ Boss อย่างแม่นยำทุกครั้งที่ลากเส้นกลับเข้าขอบ โดยไม่กระทบ Performance ในลูปปกติ
- **Zero Dependencies**: ไม่มี Ads, ไม่มี Database, ไม่มี Frameworks, ไม่มี External Assets
