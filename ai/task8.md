# Task 8: Debug System & Configuration

> **ลำดับขั้นตอน**: 8 / 9  
> **ไฟล์ที่เกี่ยวข้อง**: `game.js`  
> **สิ่งที่ต้องทำก่อนหน้า**: [ai/task7.md](file:///Users/pptv/web/territory-capture/ai/task7.md)  
> **งานถัดไป**: [ai/task9.md](file:///Users/pptv/web/territory-capture/ai/task9.md)  
> **อ้างอิง Requirement**: Sections 39, 41, 44

---

## 🎯 วัตถุประสงค์
แยกค่า Parameter สำคัญของเกมออกมาเป็น Configuration Object เพื่อให้ปรับแต่งได้ง่ายโดยไม่ต้องแตะ Core Engine และสร้างโหมด Debug Overlay (เปิด/ปิดด้วยปุ่มหรือตัวแปร) สำหรับตรวจสอบพิกัด, เส้นกริด, สถานะของเกม, และ FPS

---

## 📋 รายการงานย่อย (Subtasks)

### [ ] TASK-8.1: Config Object Setup
- **ไฟล์**: `game.js`
- **รายละเอียด**:
  - ประกาศ Configuration Object ตาม Requirement ข้อ 39:
    ```javascript
    const levelConfig = {
      width: 80,
      height: 60,
      cellSize: 10,
      targetPercent: 80,
      bossSpeed: 80, // px per second
      playerStepTime: 0.05 // seconds per cell step
    };
    ```
  - Refactor ให้ทุกฟังก์ชันใน `game.js` ดึงค่าจาก `levelConfig` แทนการ Hardcode
- **เกณฑ์การตรวจรับ**:
  - เปลี่ยนแปลงค่าใน `levelConfig` (เช่น ปรับ `bossSpeed` หรือ `targetPercent`) แล้วพฤติกรรมในเกมเปลี่ยนตามโดยไม่มี Bug

---

### [ ] TASK-8.2: Debug Mode Overlay
- **ไฟล์**: `game.js`
- **รายละเอียด**:
  - ประกาศตัวแปร `let DEBUG = false;`
  - ดักจับปุ่มสำหรับเปิด/ปิด Debug Mode (เช่น ปุ่ม Backquote/Tilde `` ` `` หรือปุ่ม `F2`):
    ```javascript
    if (e.code === 'Backquote' || e.key === '`') {
      DEBUG = !DEBUG;
    }
    ```
  - เขียนฟังก์ชัน `renderDebug(ctx)` ทำงานเมื่อ `DEBUG === true`:
    1. วาดเส้น Grid Line บาง ๆ สีจาง (เช่น `rgba(255, 255, 255, 0.05)`)
    2. คำนวณและแสดง FPS จริง
    3. แสดงกล่องข้อความข้อมูลมุมซ้ายบน:
       - `STATE: [CURRENT_STATE]`
       - `PLAYER: [X], [Y]`
       - `BOSS: [X], [Y]`
       - `TRAIL LENGTH: [N]`
       - `CAPTURED: [XX]%`
       - `FPS: [60]`
- **เกณฑ์การตรวจรับ**:
  - เมื่อเปิด DEBUG หน้าจอจะแสดงเส้นกริดและข้อมูลสถานะ Real-time ชัดเจน ไม่ทำให้เกมกระตุก

---

## 🔍 Verification Checklist
- [ ] ค่าต่าง ๆ อ้างอิงจาก `levelConfig` ครบถ้วน
- [ ] กดปุ่มสลับ DEBUG แล้วเปิด/ปิดข้อมูลสถานะและเส้นกริดได้
- [ ] ข้อมูลพิกัด Player, Boss, และ FPS แสดงผลตรงตามสถานะจริง
