# Task 5: Boss Implementation & Collision Detection

> **ลำดับขั้นตอน**: 5 / 9  
> **ไฟล์ที่เกี่ยวข้อง**: `game.js`  
> **สิ่งที่ต้องทำก่อนหน้า**: [ai/task4.md](file:///Users/pptv/web/territory-capture/ai/task4.md)  
> **งานถัดไป**: [ai/task6.md](file:///Users/pptv/web/territory-capture/ai/task6.md)  
> **อ้างอิง Requirement**: Sections 19, 20, 21, 22, 28, 35

---

## 🎯 วัตถุประสงค์
สร้างตัวละคร Boss ที่เคลื่อนที่ด้วยความเร็วคงที่และเด้งสะท้อนผนัง (CLAIMED cells) อยู่ภายในพื้นที่เล่นว่าง (EMPTY) พร้อมระบบตรวจจับการชน (Collision Detection) หาก Boss สัมผัสโดนเส้น Trail หรือตัว Player จะส่งผลให้ Player ตายทันที

---

## 📋 รายการงานย่อย (Subtasks)

### [ ] TASK-5.1: Boss Entity & Constant Velocity Physics
- **ไฟล์**: `game.js`
- **รายละเอียด**:
  - สร้าง Object Boss:
    ```javascript
    const boss = {
      x: 400, // พิกัดพิกเซลจริงบน Canvas (ไม่ใช่ grid index เพื่อการเคลื่อนไหวที่ลื่นไหล)
      y: 300,
      vx: 80, // pixels per second (~80 px/s)
      vy: 80,
      radius: 8 // รัศมีพิกเซล
    };
    ```
  - สุ่มทิศทางหรือใช้มุมเริ่มต้น (เช่น เคลื่อนที่เป็นมุมทแยง)
  - เขียนฟังก์ชัน `updateBoss(deltaTime)`:
    - คำนวณตำแหน่งใหม่: `newX = boss.x + boss.vx * deltaTime`, `newY = boss.y + boss.vy * deltaTime`
    - ตรวจจับการชนขอบหรือเซลล์ `CELL_TYPE.CLAIMED`:
      - ตรวจสอบพิกัด Grid cell ที่อยู่รอบทิศทางของ Boss (ตามแนวรัศมี)
      - หากชนผนังในแนวนอน -> สลับทิศทาง `boss.vx = -boss.vx`
      - หากชนผนังในแนวตั้ง -> สลับทิศทาง `boss.vy = -boss.vy`
    - อัปเดตตำแหน่ง `boss.x` และ `boss.y`
- **เกณฑ์การตรวจรับ**:
  - Boss เคลื่อนที่ลื่นไหลและเด้งสะท้อนเมื่อชนกับผนังขอบ CLAIMED ไม่หลุดออกนอกพื้นที่ EMPTY

---

### [ ] TASK-5.2: Boss Rendering
- **ไฟล์**: `game.js`
- **รายละเอียด**:
  - เขียนฟังก์ชัน `renderBoss(ctx)`:
    - วาดรูปทรงวงกลมสีแดงสดเด่นชัด (`#ef4444` หรือ `#dc2626`)
    - วาดตาหรือสัญลักษณ์ง่าย ๆ กึ่งกลางวงกลมเพื่อให้ดูมีมิติเหมือนสัตว์ประหลาด / Boss
    - ขนาดรัศมีประมาณ 8-10px สอดคล้องกับขนาด Grid Cell (10px)
- **เกณฑ์การตรวจรับ**:
  - Boss แสดงผลบน Canvas อย่างชัดเจนและเคลื่อนไหวลื่นไหล ไม่กระตุก

---

### [ ] TASK-5.3: Collision Detection (Boss vs Trail & Boss vs Player)
- **ไฟล์**: `game.js`
- **รายละเอียด**:
  - เขียนฟังก์ชัน `checkCollisions()`:
    - **Boss vs Trail Collision**:
      - หา Grid Cell ที่ Boss กำลังทับอยู่: `const bossGridX = Math.floor(boss.x / CELL_SIZE); const bossGridY = Math.floor(boss.y / CELL_SIZE);`
      - ตรวจสอบว่า Cell ปัจจุบันหรือ Cell ที่รัศมีของ Boss สัมผัส มีสถานะเป็น `CELL_TYPE.TRAIL` หรือไม่
      - หากสัมผัสกับ Trail ขณะที่ผู้เล่นกำลังอยู่ในสถานะ `DRAWING` -> เรียก `killPlayer()` ทันที
    - **Boss vs Player Collision**:
      - คำนวณระยะห่างระหว่างจุดศูนย์กลาง Boss กับ Player (พิกัดพิกเซล)
      - หาก Player อยู่ในสถานะ `DRAWING` และถูก Boss ชน -> เรียก `killPlayer()`
- **เกณฑ์การตรวจรับ**:
  - เมื่อ Boss ลอยมาชนเส้น Trail ที่กำลังลากอยู่ ผู้เล่นจะตายทันที
  - เมื่อ Boss ลอยมาชนตัวผู้เล่นขณะที่อยู่นอก Border ผู้เล่นจะตายทันที

---

## 🔍 Verification Checklist
- [ ] Boss เคลื่อนที่แบบสะท้อนผนังอยู่ในพื้นที่ EMPTY อย่างถูกต้อง
- [ ] Boss ปรากฏเป็นรูปทรงสีแดงเด่นชัดบนหน้าจอ
- [ ] เมื่อ Boss ชน Trail หรือตัว Player ผู้เล่นจะตายทันที
