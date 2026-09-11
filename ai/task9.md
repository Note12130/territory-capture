# Task 9: Documentation & Full Acceptance Verification

> **ลำดับขั้นตอน**: 9 / 9 (Last Task)  
> **ไฟล์ที่เกี่ยวข้อง**: `README.md`, โค้ดทั้งหมดของโปรเจกต์  
> **สิ่งที่ต้องทำก่อนหน้า**: [ai/task8.md](file:///Users/pptv/web/territory-capture/ai/task8.md)  
> **งานถัดไป**: ไม่มี (เสร็จสิ้นโครงการตาม Requirement)  
> **อ้างอิง Requirement**: Sections 46, 47, 48, 49, 53

---

## 🎯 วัตถุประสงค์
เขียนเอกสาร `README.md` สำหรับแนะนำวิธีเล่นและวิธีรันเกมบน Browser พร้อมทำการทดสอบและตรวจสอบเกณฑ์การส่งมอบงานทั้งหมดตาม Acceptance Criteria (AC-01 ถึง AC-21) ให้ครบถ้วนสมบูรณ์

---

## 📋 รายการงานย่อย (Subtasks)

### [ ] TASK-9.1: Project Documentation (README.md)
- **ไฟล์**: `README.md`
- **รายละเอียด**:
  - สร้างไฟล์ `README.md` ที่ Workspace Root
  - ระบุหัวข้อหลักตาม Requirement ข้อ 46 และ 47:
    - **บทนำ (About)**: คำอธิบายเกม Arcade Territory Capture แรงบันดาลใจจาก Qix/Xonix
    - **วิธีการเปิดเกม (How to Run)**:
      1. เปิดไฟล์ `index.html` บน Web Browser โดยตรง
      2. หรือรันผ่าน Local Server:
         ```bash
         python3 -m http.server 8000
         ```
         แล้วเปิด Browser ที่ `http://localhost:8000`
    - **การควบคุม (Controls)**:
      - `Arrow Keys` หรือ `W, A, S, D`: ควบคุมการเคลื่อนที่
      - `R`: รีสตาร์ทเกม (Restart)
      - `P`: พักเกม (Pause)
      - `` ` `` (Tilde): เปิด/ปิด Debug Mode
    - **กติกาและเป้าหมาย (Objective)**:
      - ลากเส้นออกจากขอบเข้าสู่พื้นที่ว่าง และลากกลับเข้าขอบเพื่อยึดพื้นที่
      - ห้ามให้ Boss ชนเส้น หรือ ชนตัวเอง
      - ยึดพื้นที่ให้ได้ **80%** ขึ้นไปเพื่อผ่านด่าน
- **เกณฑ์การตรวจรับ**:
  - ไฟล์ `README.md` มีเนื้อหาครบถ้วน ชัดเจน และอ่านเข้าใจง่าย

---

### [ ] TASK-9.2: Complete Acceptance Criteria (AC) Verification
- **ไฟล์**: ทุกไฟล์ในโปรเจกต์
- **รายละเอียด**:
  - ตรวจสอบและทดสอบการทำงานของเกมเทียบกับข้อกำหนดใน Requirement ข้อ 48 ครบทั้ง 21 ข้อ:
    - [ ] **AC-01**: เปิดเกมบน Browser ได้โดยตรง
    - [ ] **AC-02**: แสดงผล Game Board บนหน้าจอ
    - [ ] **AC-03**: Player อยู่บน Border ตอนเริ่มเกม
    - [ ] **AC-04**: Player เคลื่อนที่บน Border ได้ราบรื่น
    - [ ] **AC-05**: Player สามารถออกจาก Border และสร้าง Trail ได้
    - [ ] **AC-06**: Trail แสดงบนหน้าจอแบบ real-time
    - [ ] **AC-07**: Player สามารถลากกลับไปเชื่อม Border ได้
    - [ ] **AC-08**: เมื่อกลับถึง Border ระบบ Capture Territory ทันที
    - [ ] **AC-09**: พื้นที่ที่ไม่มี Boss ถูกยึดเป็น CLAIMED
    - [ ] **AC-10**: พื้นที่ที่มี Boss ไม่ถูกยึด และคงเป็นพื้นที่เล่นต่อไป
    - [ ] **AC-11**: Captured Percentage อัปเดตทันทีหลังการยึดพื้นที่
    - [ ] **AC-12**: Boss เคลื่อนที่และสะท้อนขอบได้ถูกต้อง
    - [ ] **AC-13**: Boss ชน Trail แล้ว Player ตาย (Game Over)
    - [ ] **AC-14**: Player ชน Boss แล้ว Player ตาย
    - [ ] **AC-15**: Death Screen แสดงผลพร้อมเปอร์เซ็นต์และปุ่ม Restart
    - [ ] **AC-16**: สามารถกดปุ่ม R หรือกดปุ่มบนหน้าจอเพื่อเริ่มใหม่ได้
    - [ ] **AC-17**: เมื่อ Capture >= 80% แสดงหน้าจอ Level Clear
    - [ ] **AC-18**: ทำงานได้ที่ ~60 FPS ลื่นไหล
    - [ ] **AC-19**: ไม่มี Ads
    - [ ] **AC-20**: ไม่มี Backend
    - [ ] **AC-21**: ไม่มี External Asset หรือ Library ภายนอก
- **เกณฑ์การตรวจรับ**:
  - ติ๊กเครื่องหมายถูกครบทุกข้อและไม่มี Bug ร้ายแรงตาม Definition of Done

---

## 🔍 Verification Checklist
- [ ] มีไฟล์ `README.md` ครบถ้วนตามมาตรฐาน
- [ ] ทดสอบ Gameplay Loop ครบถ้วนตั้งแต่เริ่ม ลากเส้น หลบ Boss ชนะ และ แพ้
- [ ] ผ่านเกณฑ์ AC-01 ถึง AC-21 ครบ 100%
