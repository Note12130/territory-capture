# Task 6: Territory Capture & BFS Flood Fill

> **ลำดับขั้นตอน**: 6 / 9  
> **ไฟล์ที่เกี่ยวข้อง**: `game.js`  
> **สิ่งที่ต้องทำก่อนหน้า**: [ai/task5.md](file:///Users/pptv/web/territory-capture/ai/task5.md)  
> **งานถัดไป**: [ai/task7.md](file:///Users/pptv/web/territory-capture/ai/task7.md)  
> **อ้างอิง Requirement**: Sections 15, 16, 17, 18, 34, 42

---

## 🎯 วัตถุประสงค์
สร้าง Core Mechanic สำคัญที่สุดของเกม คือ อัลกอริทึมการยึดพื้นที่ (Territory Capture) โดยใช้ Flood Fill (BFS) เริ่มต้นจากตำแหน่งของ Boss เพื่อค้นหาพื้นที่ที่ Boss เข้าถึงได้ (Reachable) และเปลี่ยนพื้นที่ส่วนที่เหลือทั้งหมดที่ไม่มี Boss รวมถึงเส้น Trail ให้กลายเป็นพื้นที่ยึดครอง (CLAIMED)

---

## 📋 รายการงานย่อย (Subtasks)

### [ ] TASK-6.1: Border Reconnection Detection
- **ไฟล์**: `game.js`
- **รายละเอียด**:
  - ในฟังก์ชัน `updatePlayer`:
    - ขณะที่ `player.state === 'DRAWING'`:
      - เมื่อผู้เล่นก้าวเข้าสู่พิกัดเป้าหมาย `(nextX, nextY)` ซึ่งเป็น `CELL_TYPE.CLAIMED`:
        - ผู้เล่นกลับมาถึงขอบสำเร็จ
        - เปลี่ยน Game State เป็น `GameState.CAPTURING`
        - เรียกฟังก์ชัน `captureTerritory()`
        - ย้ายตำแหน่ง Player ไปที่ `nextX, nextY`
        - เปลี่ยน `player.state = 'ON_BORDER'`
- **เกณฑ์การตรวจรับ**:
  - เมื่อลากเส้นจากขอบหนึ่งไปเชื่อมกับอีกขอบหนึ่ง ตัวเกมตรวจจับการสิ้นสุดการลากได้ถูกต้อง

---

### [ ] TASK-6.2: BFS Flood Fill from Boss Position
- **ไฟล์**: `game.js`
- **รายละเอียด**:
  - เขียนฟังก์ชัน `findBossRegion()`:
    - หาพิกัด Grid Cell ของ Boss:
      ```javascript
      const bossGridX = Math.floor(boss.x / CELL_SIZE);
      const bossGridY = Math.floor(boss.y / CELL_SIZE);
      ```
    - กำหนดให้เซลล์ `CELL_TYPE.CLAIMED` และ `CELL_TYPE.TRAIL` ถือเป็น **ผนัง (Blocked)**
    - ใช้ Queue สำหรับอัลกอริทึม Breadth-First Search (BFS):
      1. เพิ่มตำแหน่ง `(bossGridX, bossGridY)` ลงใน Queue
      2. ใช้ `visited` (2D Boolean array หรือ Set) บันทึกเซลล์ที่เดินถึงแล้ว
      3. ดึงพิกัดจาก Queue และตรวจสอบเพื่อนบ้าน 4 ทิศ (บน, ล่าง, ซ้าย, ขวา)
      4. หากเพื่อนบ้านอยู่ในตาราง, ยังไม่เคยเยี่ยมชม, และเป็น `CELL_TYPE.EMPTY` ให้ใส่ลงใน Queue และทำเครื่องหมาย `visited`
    - คืนค่าโครงสร้างข้อมูลที่ระบุเซลล์ทั้งหมดที่ Boss เข้าถึงได้ (`reachableSet`)
- **เกณฑ์การตรวจรับ**:
  - ฟังก์ชัน BFS สามารถระบุเซลล์ในฝั่งที่ Boss อาศัยอยู่ได้อย่างถูกต้องโดยไม่ทะลุผ่าน Trail หรือ Claimed cells

---

### [ ] TASK-6.3: Claim Territory & Percentage Update
- **ไฟล์**: `game.js`
- **รายละเอียด**:
  - เขียนฟังก์ชัน `captureTerritory()`:
    - เรียก `const reachable = findBossRegion();`
    - วนลูปตรวจสอบทุก Grid Cell ในพื้นที่เล่น:
      - หากเซลล์ใดเป็น `CELL_TYPE.EMPTY` และ **ไม่ปรากฏ** ใน `reachable`:
        - เปลี่ยนเป็น `CELL_TYPE.CLAIMED` (ถูกยึด)
    - เปลี่ยนเซลล์ทั้งหมดใน `trail` ให้กลายเป็น `CELL_TYPE.CLAIMED`
    - ล้างอาร์เรย์ `trail = []`
    - เรียก `calculateCapturedPercentage()` เพื่ออัปเดตคะแนน
    - เปลี่ยน Game State กลับเป็น `GameState.PLAYING`
- **เกณฑ์การตรวจรับ**:
  - พื้นที่ฝั่งที่ไม่มี Boss กลายเป็นสี CLAIMED ทันที
  - เส้น Trail ทั้งหมดกลายเป็น CLAIMED ถาวร
  - เปอร์เซ็นต์พื้นที่ที่ถูกยึดเพิ่มขึ้นตามสัดส่วนพื้นที่จริง

---

### [ ] TASK-6.4: Multi-Region Handling & Edge Cases
- **ไฟล์**: `game.js`
- **รายละเอียด**:
  - ทดสอบกรณีที่ Trail แบ่งพื้นที่ออกเป็นหลายส่วน (Islands / Multi-regions):
    - ทุกส่วนที่ไม่มี Boss ต้องถูกยึด 100%
  - ตรวจสอบว่า Boss จะไม่ติดอยู่ในเซลล์ที่กลายเป็น CLAIMED (Safety Check: หาก Boss ทับเซลล์ที่กำลังจะถูก Claim ให้ผลัก Boss เข้าสู่พื้นที่ว่างใกล้เคียง)
  - ป้องกันการรัน Flood Fill ใน Game Loop ปกติ (ต้องรันเฉพาะเมื่อจบการลากเส้นเท่านั้นตาม Performance Rule)
- **เกณฑ์การตรวจรับ**:
  - ลากเส้นตัดขอบหลายมุม พื้นที่ที่ไม่มีบอสถูกยึดครบถ้วนทุกส่วน
  - Boss ยังคงเคลื่อนไหวในพื้นที่ว่างที่เหลือได้อย่างอิสระ

---

## 🔍 Verification Checklist
- [ ] เมื่อลากเส้นกลับเข้าขอบ พื้นที่ฝั่งที่ไม่มีบอสจะกลายเป็นสี CLAIMED
- [ ] บอสยังคงเคลื่อนไหวเฉพาะในพื้นที่ที่เหลืออยู่
- [ ] เปอร์เซ็นต์พื้นที่ถูกคำนวณใหม่และเพิ่มขึ้นทันที
- [ ] เส้น Trail กลายเป็นส่วนหนึ่งของ Border ใหม่
