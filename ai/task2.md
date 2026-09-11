# Task 2: Grid System & Territory Representation

> **ลำดับขั้นตอน**: 2 / 9  
> **ไฟล์ที่เกี่ยวข้อง**: `game.js`  
> **สิ่งที่ต้องทำก่อนหน้า**: [ai/task1.md](file:///Users/pptv/web/territory-capture/ai/task1.md)  
> **งานถัดไป**: [ai/task3.md](file:///Users/pptv/web/territory-capture/ai/task3.md)  
> **อ้างอิง Requirement**: Sections 7, 8, 26, 28, 30

---

## 🎯 วัตถุประสงค์
สร้างระบบข้อมูลตารางกริด (Grid-based system) ขนาด 80×60 เซลล์ เพื่อจำลองพื้นที่ EMPTY, CLAIMED, TRAIL รวมถึงสร้างฟังก์ชัน Render พื้นที่และฟังก์ชันคำนวณเปอร์เซ็นต์พื้นที่ที่ถูกยึด

---

## 📋 รายการงานย่อย (Subtasks)

### [ ] TASK-2.1: Grid Data Structure & Initial Border Setup
- **ไฟล์**: `game.js`
- **รายละเอียด**:
  - กำหนดค่าคงที่ของตาราง:
    ```javascript
    const GRID_WIDTH = 80;
    const GRID_HEIGHT = 60;
    const CELL_SIZE = 10; // 80 * 10 = 800px, 60 * 10 = 600px

    const CELL_TYPE = {
      EMPTY: 0,
      CLAIMED: 1,
      TRAIL: 2
    };
    ```
  - สร้าง Array เก็บข้อมูลกริด (เช่น 2D Array `grid[y][x]` หรือ 1D Flat Array ขนาด `GRID_WIDTH * GRID_HEIGHT`)
  - สร้างฟังก์ชัน `initGrid()`:
    - ตั้งค่าแถวขอบรอบนอกทั้งหมด (x=0, x=GRID_WIDTH-1, y=0, y=GRID_HEIGHT-1) ให้เป็น `CELL_TYPE.CLAIMED`
    - ตั้งค่าช่องด้านในทั้งหมดให้เป็น `CELL_TYPE.EMPTY`
- **เกณฑ์การตรวจรับ**:
  - ช่องขอบทั้งหมดมีค่าเป็น `1` (CLAIMED)
  - ช่องด้านในทั้งหมดมีค่าเป็น `0` (EMPTY)

---

### [ ] TASK-2.2: Grid Rendering System
- **ไฟล์**: `game.js`
- **รายละเอียด**:
  - เขียนฟังก์ชัน `renderGrid(ctx)`:
    - วนลูปวาดแต่ละ Cell ตามตำแหน่ง `x * CELL_SIZE`, `y * CELL_SIZE`
    - กำหนดสีตาม Visual Style:
      - `EMPTY`: สีมืดโทนน้ำเงิน-ดำ (เช่น `#111827`)
      - `CLAIMED`: สีฟ้าสว่างที่เห็นเด่นชัด (เช่น `#2563eb` หรือ `#3b82f6`)
      - `TRAIL`: สีส้มสดใสสะดุดตา (เช่น `#f59e0b`)
  - ปรับการวาดให้มีประสิทธิภาพ (เช่น วาดเฉพาะ cell ที่ไม่ใช่ EMPTY หรือ fillRect พื้นหลังเป็นสี EMPTY ก่อน แล้วค่อยวาดเฉพาะ CLAIMED และ TRAIL)
- **เกณฑ์การตรวจรับ**:
  - เมื่อรันเกม หน้าจอจะแสดงกรอบสี่เหลี่ยมสีฟ้า (CLAIMED) ล้อมรอบพื้นที่ด้านในสีดำ (EMPTY)

---

### [ ] TASK-2.3: Percentage Calculation Logic
- **ไฟล์**: `game.js`
- **รายละเอียด**:
  - เขียนฟังก์ชัน `calculateCapturedPercentage()`:
    - พื้นที่เล่นด้านในทั้งหมด (ไม่รวมขอบรอบนอก):
      `totalPlayableCells = (GRID_WIDTH - 2) * (GRID_HEIGHT - 2)` (เท่ากับ 78 × 58 = 4524 เซลล์)
    - นับจำนวนเซลล์ที่เป็น `CELL_TYPE.CLAIMED` เฉพาะภายในขอบเขต `1 <= x < GRID_WIDTH - 1` และ `1 <= y < GRID_HEIGHT - 1`
    - คำนวณ:
      ```javascript
      const percentage = Math.floor((claimedPlayableCells / totalPlayableCells) * 100);
      return percentage;
      ```
- **เกณฑ์การตรวจรับ**:
  - เริ่มต้นเกม `calculateCapturedPercentage()` ต้องได้ผลลัพธ์เป็น `0%`
  - หากทดสอบเปลี่ยนเซลล์ด้านในเป็น CLAIMED ค่า % ต้องเพิ่มขึ้นถูกต้อง

---

## 🔍 Verification Checklist
- [ ] กริดเริ่มต้นแสดงขอบล้อมรอบอย่างถูกต้องบน Canvas
- [ ] พื้นที่ด้านในเป็นสี EMPTY และขอบเป็นสี CLAIMED
- [ ] เรียก `calculateCapturedPercentage()` คืนค่า 0 ในตอนเริ่มเกม
