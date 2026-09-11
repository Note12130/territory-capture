# Task 3: Player Movement & Border Traversal

> **ลำดับขั้นตอน**: 3 / 9  
> **ไฟล์ที่เกี่ยวข้อง**: `game.js`  
> **สิ่งที่ต้องทำก่อนหน้า**: [ai/task2.md](file:///Users/pptv/web/territory-capture/ai/task2.md)  
> **งานถัดไป**: [ai/task4.md](file:///Users/pptv/web/territory-capture/ai/task4.md)  
> **อ้างอิง Requirement**: Sections 9, 10, 11, 29, 30, 37

---

## 🎯 วัตถุประสงค์
สร้างตัวละคร Player และระบบรับ Input (WASD / Arrow keys) พร้อมควบคุมให้ Player สามารถเคลื่อนที่ไปตามขอบ (CLAIMED cells) ในสถานะ `ON_BORDER` ได้อย่างถูกต้อง และห้ามหลุดออกนอกกระดาน

---

## 📋 รายการงานย่อย (Subtasks)

### [ ] TASK-3.1: Input Handling Module
- **ไฟล์**: `game.js`
- **รายละเอียด**:
  - ประกาศ Object จัดการ Input เช่น `input = { dx: 0, dy: 0, nextDx: 0, nextDy: 0 }`
  - ดักจับ `keydown`:
    - ArrowUp / KeyW -> `{ dx: 0, dy: -1 }`
    - ArrowDown / KeyS -> `{ dx: 0, dy: 1 }`
    - ArrowLeft / KeyA -> `{ dx: -1, dy: 0 }`
    - ArrowRight / KeyD -> `{ dx: 1, dy: 0 }`
    - KeyR -> ฟังก์ชันรีสตาร์ท (เตรียมไว้)
    - KeyP -> ฟังก์ชันพักเกม (เตรียมไว้)
  - เพิ่ม `e.preventDefault()` สำหรับปุ่มลูกศรเพื่อไม่ให้หน้าเว็บเลื่อน
  - อัปเดตทิศทางที่ต้องการเดินแบบ Buffered Input เพื่อการตอบสนองที่ลื่นไหล
- **เกณฑ์การตรวจรับ**:
  - กดปุ่มทิศทางแล้วตัวแปรทิศทางในโค้ดเปลี่ยนตามอย่างแม่นยำ

---

### [ ] TASK-3.2: Player Entity & Grid-Aligned Movement
- **ไฟล์**: `game.js`
- **รายละเอียด**:
  - สร้าง Object Player:
    ```javascript
    const player = {
      x: 0, // Grid coordinate
      y: 0,
      state: 'ON_BORDER', // ON_BORDER, DRAWING, DEAD
      moveTimer: 0,
      moveSpeed: 0.05 // วินาทีต่อก้าว (ปรับแต่งได้)
    };
    ```
  - เริ่มต้นเกม วาง Player ไว้ที่ตำแหน่งเริ่มต้นบนขอบ (เช่น `x = 0, y = 0` หรือตรงกลางขอบบน)
  - เขียนฟังก์ชัน `renderPlayer(ctx)`:
    - วาดรูปทรงสี่เหลี่ยมหรือวงกลมขนาดพอดี Grid Cell (เช่น 10x10 px)
    - ใช้สีเด่นที่ตัดกับฉากหลัง เช่น สีเขียวสดใส (`#10b981`) หรือสีขาวสว่าง (`#ffffff`)
- **เกณฑ์การตรวจรับ**:
  - ตัวละคร Player แสดงผลบนเส้นขอบเริ่มต้นอย่างถูกต้อง

---

### [ ] TASK-3.3: Border Movement Constraints
- **ไฟล์**: `game.js`
- **รายละเอียด**:
  - เขียนฟังก์ชัน `updatePlayer(deltaTime)`:
    - ควบคุมการขยับตามระยะเวลา `moveTimer` เพื่อให้เคลื่อนที่เป็นช่องกริด (Grid-aligned)
    - ขณะที่ `player.state === 'ON_BORDER'`:
      - คำนวณตำแหน่งถัดไป `nextX = player.x + dx`, `nextY = player.y + dy`
      - ตรวจสอบ Bounds: `0 <= nextX < GRID_WIDTH` และ `0 <= nextY < GRID_HEIGHT`
      - หากเซลล์ถัดไปเป็น `CELL_TYPE.CLAIMED`: อนุญาตให้เดินไปได้ (`player.x = nextX; player.y = nextY;`)
      - หากไม่มีการกดปุ่ม ให้หยุดนิ่งอยู่กับที่
- **เกณฑ์การตรวจรับ**:
  - ผู้เล่นสามารถกดปุ่มเลื่อนตัวละครไปตามขอบบน ล่าง ซ้าย ขวา ได้อย่างราบรื่น
  - ผู้เล่นไม่สามารถเดินทะลุขอบนอกของหน้าจอออกไปได้

---

## 🔍 Verification Checklist
- [ ] กด Arrow Keys หรือ WASD แล้ว Player เดินบนขอบได้
- [ ] Player ไม่หลุดออกจากขอบเขต Canvas
- [ ] เมื่อไม่กดปุ่ม Player จะหยุดนิ่งบนขอบ
