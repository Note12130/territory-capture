# Territory Capture — Task Master Index

เอกสารสารบัญรวม Task งานทั้งหมด สำหรับให้ AI ทำงานทีละขั้นตอน (Step-by-Step / Atomic Tasks)  
อ้างอิงจากข้อกำหนดใน [ai/requirement.md](file:///Users/pptv/web/territory-capture/ai/requirement.md)

---

## 📑 รายการไฟล์ Task ย่อย (task1.md ถึง task9.md)

| Task File | ชื่อ Phase / งาน | วัตถุประสงค์หลัก |
| :--- | :--- | :--- |
| 📄 **[ai/task1.md](file:///Users/pptv/web/territory-capture/ai/task1.md)** | Phase 1: Setup & Canvas Foundation | สร้างโครงสร้าง `index.html`, `style.css`, Canvas 800x600 4:3 และ Game Loop |
| 📄 **[ai/task2.md](file:///Users/pptv/web/territory-capture/ai/task2.md)** | Phase 2: Grid System & Territory Representation | สร้าง Grid 80x60, เซลล์ EMPTY/CLAIMED/TRAIL, Render และคำนวณ % |
| 📄 **[ai/task3.md](file:///Users/pptv/web/territory-capture/ai/task3.md)** | Phase 3: Player Movement & Border Traversal | ระบบ Input (WASD/Arrows), ตัวละคร Player, การเดินบนขอบ (ON_BORDER) |
| 📄 **[ai/task4.md](file:///Users/pptv/web/territory-capture/ai/task4.md)** | Phase 4: Drawing Mechanics & Trail Generation | ก้าวเข้าสู่ EMPTY เกิด Trail, ห้ามกลับทิศ 180°, ชนเส้นตัวเองตาย |
| 📄 **[ai/task5.md](file:///Users/pptv/web/territory-capture/ai/task5.md)** | Phase 5: Boss Logic & Collision Detection | บอสสะท้อนผนังใน EMPTY, บอสชน Trail/Player แล้วตาย |
| 📄 **[ai/task6.md](file:///Users/pptv/web/territory-capture/ai/task6.md)** | Phase 6: Territory Capture & BFS Flood Fill | ชนขอบแล้วเกิดการ Capture, BFS หาเขต Boss, ยึดพื้นที่ส่วนที่ไม่มี Boss |
| 📄 **[ai/task7.md](file:///Users/pptv/web/territory-capture/ai/task7.md)** | Phase 7: Game Lifecycle, HUD & Win/Loss | HUD แสดง %, Game Over modal, Win modal (>= 80%), Pause (P) |
| 📄 **[ai/task8.md](file:///Users/pptv/web/territory-capture/ai/task8.md)** | Phase 8: Debug System & Configuration | แยก `levelConfig`, Debug Overlay (เปิด/ปิดด้วยปุ่ม \` หรือ F2) |
| 📄 **[ai/task9.md](file:///Users/pptv/web/territory-capture/ai/task9.md)** | Phase 9: Documentation & Full Verification | จัดทำ `README.md`, ตรวจสอบ Acceptance Criteria AC-01 ถึง AC-21 ครบถ้วน |
