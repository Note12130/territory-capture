# Task 1: Setup, Canvas Foundation & Game Loop

> **ลำดับขั้นตอน**: 1 / 9  
> **ไฟล์ที่เกี่ยวข้อง**: `index.html`, `style.css`, `game.js`  
> **สิ่งที่ต้องทำก่อนหน้า**: ไม่มี (เริ่มต้นโปรเจกต์)  
> **งานถัดไป**: [ai/task2.md](file:///Users/pptv/web/territory-capture/ai/task2.md)  
> **อ้างอิง Requirement**: Sections 1, 2, 3, 5, 6, 28, 31, 32, 43, 49

---

## 🎯 วัตถุประสงค์
วางโครงสร้างพื้นฐานของโปรเจกต์ ทั้งไฟล์ HTML, การจัดวางสไตล์ Responsive CSS (อัตราส่วน 4:3) สำหรับ Canvas 2D ขนาด 800x600 และ Game Loop พร้อม State Machine พื้นฐาน โดยไม่ใช้ Framework หรือ External Library ใด ๆ

---

## 🛑 Guardrails & Non-Goals
- ❌ ห้ามใช้ Library ภายนอก, Bundler, npm packages, หรือ CDN
- ❌ ห้ามใช้ Assets ภายนอก (รูปภาพ, เสียง, ฟอนต์ภายนอก)
- ✅ ใช้ Pure HTML5, CSS3, และ Vanilla JavaScript (Canvas 2D API) เท่านั้น

---

## 📋 รายการงานย่อย (Subtasks)

### [ ] TASK-1.1: Project Skeleton & HTML Structure
- **ไฟล์**: `index.html`
- **รายละเอียด**:
  - สร้างโครงสร้าง HTML5 มาตรฐาน
  - เพิ่ม Element สำหรับเกม:
    - Container หลักสำหรับจัดกึ่งกลางหน้าจอ
    - แถบ HUD ด้านบน (เตรียมไว้สำหรับแสดง Captured % และ Target %)
    - `<canvas id="gameCanvas" width="800" height="600"></canvas>`
    - Overlay modal container (สำหรับ Pause, Game Over, และ Level Clear)
  - นำเข้า `style.css` และ `game.js` (วางแท็ก script ท้าย body)
- **เกณฑ์การตรวจรับ**:
  - เปิด `index.html` บน Browser แล้วไม่มี error ใน Console

---

### [ ] TASK-1.2: Responsive CSS & Layout Styling
- **ไฟล์**: `style.css`
- **รายละเอียด**:
  - จัดให้อยู่กึ่งกลางหน้าจอแบบ Flexbox หรือ Grid ทั้งแนวตั้งและแนวนอน
  - พื้นหลังสีโทนมืด Minimal Flat UI (เช่น `#0a0f1d`)
  - Canvas ต้องรักษาสัดส่วน 4:3 และ Responsive:
    ```css
    #gameCanvas {
      max-width: 100vw;
      max-height: 85vh;
      aspect-ratio: 4 / 3;
      display: block;
      background-color: #111827;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.5);
    }
    ```
  - จัดการ Overlay container ให้แสดงซ้อนทับกลาง Canvas ได้อย่างเหมาะสม
  - ซ่อน Scrollbar ที่ไม่จำเป็น (`overflow: hidden;`)
- **เกณฑ์การตรวจรับ**:
  - ย่อขยายหน้าต่าง Browser แล้ว Canvas ปรับตามโดยไม่ยืดหรือเบี้ยวสัดส่วน 4:3

---

### [ ] TASK-1.3: Game Loop Skeleton & Core State Machine
- **ไฟล์**: `game.js`
- **รายละเอียด**:
  - ประกาศ Game States เป็น Object/Enum:
    ```javascript
    const GameState = {
      READY: 'READY',
      PLAYING: 'PLAYING',
      DRAWING: 'DRAWING',
      CAPTURING: 'CAPTURING',
      DEAD: 'DEAD',
      WIN: 'WIN',
      PAUSED: 'PAUSED'
    };
    ```
  - สร้างโครงสร้างหลักของ Game Loop:
    - ตัวแปรเก็บเวลา `lastTime`
    - `function gameLoop(timestamp)` เรียก `requestAnimationFrame`
    - คำนวณ `deltaTime = (timestamp - lastTime) / 1000`
    - ฟังก์ชัน `initGame()`
    - ฟังก์ชัน `resetGame()`
    - ฟังก์ชัน `updateGame(deltaTime)`
    - ฟังก์ชัน `renderGame()`
  - เริ่มต้นเรียก `initGame()` เมื่อโหลดหน้าเว็บเสร็จ
- **เกณฑ์การตรวจรับ**:
  - เปิดหน้าเว็บแล้ว Game Loop หมุนต่อเนื่องอย่างราบรื่น (~60 FPS)

---

## 🔍 Verification Checklist
- [ ] เปิด `index.html` ด้วย Browser ตรง ๆ หรือผ่าน `python3 -m http.server 8000` ได้โดยไม่มี Error
- [ ] มองเห็น Canvas สี่เหลี่ยม 4:3 อยู่ตรงกลางหน้าจออย่างสวยงาม
- [ ] Game Loop ทำงาน มีการเคลียร์หน้าจอและพร้อมสำหรับวาดองค์ประกอบใน Task 2
