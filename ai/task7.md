# Task 7: Game Lifecycle, HUD & Win/Loss Conditions

> **ลำดับขั้นตอน**: 7 / 9  
> **ไฟล์ที่เกี่ยวข้อง**: `index.html`, `style.css`, `game.js`  
> **สิ่งที่ต้องทำก่อนหน้า**: [ai/task6.md](file:///Users/pptv/web/territory-capture/ai/task6.md)  
> **งานถัดไป**: [ai/task8.md](file:///Users/pptv/web/territory-capture/ai/task8.md)  
> **อ้างอิง Requirement**: Sections 22, 23, 24, 25, 27, 29

---

## 🎯 วัตถุประสงค์
พัฒนาระบบวงจรชีวิตของเกม (Game Lifecycle) ประกอบด้วย การแสดงผล HUD ด้านบน (Captured % / Target 80%), หน้าจอ Game Over เมื่อผู้เล่นตายพร้อมปุ่ม Restart (และคีย์ลัด R), หน้าจอ Level Clear เมื่อยึดพื้นที่ได้ >= 80% พร้อมปุ่ม Play Again, และระบบ Pause ชั่วคราว (ปุ่ม P)

---

## 📋 รายการงานย่อย (Subtasks)

### [ ] TASK-7.1: HUD Display Implementation
- **ไฟล์**: `index.html`, `style.css`, `game.js`
- **รายละเอียด**:
  - สร้าง DOM Elements หรือวาดบน Canvas ด้านบน:
    - `CAPTURED: 0%`
    - `TARGET: 80%`
  - สไตล์ให้อ่านง่าย มี Contrast ชัดเจน วางตำแหน่งด้านบน Canvas โดยไม่บดบังกระดานเกม
  - เขียนฟังก์ชัน `updateHUD()`: อัปเดตตัวเลข Captured % ทุกครั้งที่เกิดการ Capture
- **เกณฑ์การตรวจรับ**:
  - ตัวเลข Captured อัปเดตทันทีที่ยึดพื้นที่ได้สำเร็จ

---

### [ ] TASK-7.2: Death State & Game Over Modal
- **ไฟล์**: `index.html`, `style.css`, `game.js`
- **รายละเอียด**:
  - เขียนฟังก์ชัน `killPlayer()`:
    - เปลี่ยน Game State เป็น `GameState.DEAD`
    - `player.state = 'DEAD'`
    - หยุดการเคลื่อนที่ของ Player และ Boss
    - แสดง Modal "GAME OVER" บนหน้าจอ:
      - ข้อความแสดงเปอร์เซ็นต์ที่ทำได้ เช่น `Captured: 63%`
      - ปุ่ม `[RESTART]` (กดแล้วเรียก `resetGame()`)
  - รองรับการกดปุ่ม `R` บนคีย์บอร์ดเพื่อสั่ง Restart ได้ตลอดเวลา
- **เกณฑ์การตรวจรับ**:
  - เมื่อชน Boss หรือเส้นตัวเอง เกมหยุดและหน้าจอ Game Over ปรากฏ
  - กดปุ่ม Restart หรือกดปุ่ม 'R' แล้วเกมรีเซ็ตกระดานเริ่มใหม่ทันที

---

### [ ] TASK-7.3: Win State & Level Clear Modal
- **ไฟล์**: `index.html`, `style.css`, `game.js`
- **รายละเอียด**:
  - เขียนฟังก์ชัน `winLevel()`:
    - ตรวจสอบหลัง `captureTerritory()`: หาก `calculateCapturedPercentage() >= 80`:
      - เปลี่ยน Game State เป็น `GameState.WIN`
      - หยุดการเคลื่อนไหวของเกม
      - แสดง Modal "LEVEL CLEAR!":
        - ข้อความแสดงเปอร์เซ็นต์ที่ยึดได้ เช่น `85% CAPTURED`
        - ปุ่ม `[PLAY AGAIN]` (กดแล้วเรียก `resetGame()`)
- **เกณฑ์การตรวจรับ**:
  - เมื่อยึดพื้นที่ได้ตั้งแต่ 80% ขึ้นไป เกมหยุดและแสดงหน้าต่าง Level Clear พร้อมเปอร์เซ็นต์จริง

---

### [ ] TASK-7.4: Pause Functionality
- **ไฟล์**: `game.js`, `style.css`
- **รายละเอียด**:
  - ดักจับการกดปุ่ม `P`:
    - หากสถานะเป็น `PLAYING` หรือ `DRAWING` -> สลับเป็น `PAUSED` และแสดง Overlay "PAUSED"
    - หากสถานะเป็น `PAUSED` -> สลับกลับเป็นสถานะเดิมและซ่อน Overlay
  - ในขณะที่เกมอยู่ในสถานะ `PAUSED`:
    - ข้ามขั้นตอนการอัปเดตตำแหน่ง Player และ Boss (`updateGame` ไม่ทำงาน)
    - ยังคงวาดเฟรมภาพนิ่งตามปกติ
- **เกณฑ์การตรวจรับ**:
  - กดปุ่ม P แล้วทุกอย่างหยุดนิ่ง กด P ซ้ำอีกครั้งแล้วเกมดำเนินต่อไปได้ปกติ

---

## 🔍 Verification Checklist
- [ ] HUD แสดง Captured % และ Target 80% ด้านบนอย่างชัดเจน
- [ ] เมื่อผู้เล่นตาย แสดงหน้าจอ Game Over และกด R เพื่อเริ่มใหม่ได้
- [ ] เมื่อยึดพื้นที่ >= 80% แสดงหน้าจอ Level Clear
- [ ] ปุ่ม P สามารถหยุดเกมชั่วคราวและกลับมาเล่นต่อได้
