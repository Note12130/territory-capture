# Territory Capture — Web Demo
## Requirements Specification

Version: 0.1  
Platform: Web Browser  
Purpose: Gameplay Prototype / Demo  
Status: MVP Prototype

---

# 1. Objective

สร้างเกม Web Demo แนว Arcade Territory Capture ที่ได้รับแรงบันดาลใจจากเกมตู้แนว Qix/Xonix

ผู้เล่นควบคุมตัวละครขนาดเล็กที่อยู่บนขอบพื้นที่เกม สามารถลากตัวละครออกจากขอบเข้าสู่พื้นที่ที่ยังไม่ถูกยึด และลากกลับไปเชื่อมกับขอบอีกด้านหนึ่งเพื่อแบ่งพื้นที่

เมื่อสร้างเส้นสำเร็จ ระบบจะยึดพื้นที่ส่วนที่ไม่มี Boss อยู่ภายใน

ผู้เล่นต้องยึดพื้นที่ให้ได้อย่างน้อย **80%** จึงจะผ่าน Level

หาก Boss ชนเส้นทางของผู้เล่นในขณะที่กำลังลากอยู่ ผู้เล่นจะตาย

---

# 2. Scope

## 2.1 ต้องมี

- Game Board
- Playable Area
- Player
- Player Movement
- Player Trail
- Border Collision
- Boss
- Boss Movement
- Trail Collision
- Territory Capture
- Area Percentage Calculation
- Win Condition
- Death Condition
- Restart Game
- Basic HUD
- Level Reset

## 2.2 ยังไม่ต้องมี

- Ads
- AdMob
- Login
- Database
- Backend
- Multiplayer
- Sound
- Music
- Account
- Leaderboard
- IAP
- Skin
- Character customization
- AI-generated image
- AI-generated boss
- Complex animation
- Level editor
- Server

---

# 3. Technology

Demo ต้องสามารถ Run บน Web Browser ได้ง่ายที่สุด

Recommended:

- HTML5
- CSS3
- JavaScript
- Canvas 2D API

ไม่จำเป็นต้องใช้ Framework

Recommended project structure:

```text
territory-capture/
│
├── index.html
├── style.css
├── game.js
└── README.md
```

สามารถเปิด `index.html` โดยตรงด้วย Browser ได้

หาก Browser มีข้อจำกัด ให้สามารถ Run ด้วย local server เช่น:

```bash
python3 -m http.server 8000
```

แล้วเปิด:

```text
http://localhost:8000
```

---

# 4. Game Concept

หน้าจอเกมประกอบด้วยพื้นที่สี่เหลี่ยม

```text
┌──────────────────────────────┐
│                              │
│██████████████████████████████│
│██                          ██│
│██                          ██│
│██            BOSS          ██│
│██             ●            ██│
│██                          ██│
│██                          ██│
│██████████████████████████████│
└──────────────────────────────┘
```

พื้นที่ที่ถูกยึดแล้วแสดงด้วยสี/texture ที่แตกต่างจากพื้นที่ที่ยังไม่ถูกยึด

ผู้เล่นเริ่มต้นอยู่บน Border

---

# 5. Game Board

## 5.1 ขนาด

ใช้ Canvas แบบ Responsive

Desktop:

```text
800 × 600
```

Mobile:

Canvas ปรับตามขนาดหน้าจอ โดยรักษา aspect ratio ประมาณ:

```text
4:3
```

ตัวเกมต้องไม่ถูกยืดจน gameplay geometry ผิดเพี้ยน

---

# 6. Coordinate System

ใช้ Canvas coordinate:

```text
(0,0)
  ┌──────────────────────→ X
  │
  │
  │
  ↓
  Y
```

Gameplay logic ต้องแยกจาก screen scaling

---

# 7. Territory Representation

สำหรับ Demo ให้ใช้ **Grid-based system**

ไม่ต้องใช้ Polygon Boolean

แนะนำ:

```text
GRID_WIDTH  = 80
GRID_HEIGHT = 60
```

แต่ละ Cell มีสถานะ:

```javascript
EMPTY
CLAIMED
TRAIL
```

ตัวอย่าง:

```text
0 = EMPTY
1 = CLAIMED
2 = TRAIL
```

---

# 8. Initial Territory

เริ่มต้นให้ Border รอบสนามเป็นพื้นที่ที่ผู้เล่นสามารถเดินได้

พื้นที่ด้านในเป็น EMPTY

ตัวอย่าง:

```text
111111111111111111
100000000000000001
100000000000000001
100000000000000001
100000000000000001
111111111111111111
```

โดย:

```text
1 = CLAIMED / BORDER
0 = EMPTY
```

---

# 9. Player

## 9.1 Appearance

Demo ใช้รูปทรงง่าย ๆ เช่น:

```text
●
```

หรือสี่เหลี่ยมเล็ก ๆ

ไม่ต้องใช้ Sprite

---

# 10. Player State

Player มีสถานะ:

```text
ON_BORDER
DRAWING
DEAD
```

---

# 11. Player Movement

ผู้เล่นต้องสามารถเคลื่อนที่ตาม Border ได้

เมื่ออยู่บน Border:

```text
Arrow Keys
WASD
```

รองรับ:

```text
Up
Down
Left
Right
```

บน Mobile ให้รองรับ Touch / Swipe ในอนาคต

สำหรับ Demo Desktop สามารถใช้ Keyboard ก่อน

---

# 12. Start Drawing

เมื่อ Player อยู่บน Border และผู้เล่นกดทิศทางที่นำออกจากพื้นที่ Border:

Player เปลี่ยน state:

```text
ON_BORDER
     ↓
DRAWING
```

จากนั้น Player สามารถเคลื่อนที่เข้าไปในพื้นที่ EMPTY

---

# 13. Trail

ระหว่างที่ Player อยู่ในสถานะ DRAWING:

ทุก Grid Cell ที่ Player ผ่านต้องถูกบันทึกเป็น:

```text
TRAIL
```

แสดง Trail เป็นเส้นที่มองเห็นได้ชัดเจน

ตัวอย่าง:

```text
████████████████
██      │     ██
██      │     ██
██      │ ●   ██
██      │     ██
████████████████
```

---

# 14. Trail Rules

Trail ต้อง:

- เริ่มจาก Border
- อยู่ภายใน Game Board
- ไม่สามารถผ่านพื้นที่ CLAIMED
- ไม่สามารถย้อนกลับเข้าพื้นที่ CLAIMED ระหว่างการลาก
- บันทึก path ที่ Player เดินผ่าน

---

# 15. Return To Border

เมื่อ Player ที่อยู่ในสถานะ DRAWING กลับมาแตะ Border:

```text
DRAWING
   ↓
CAPTURE
```

Trail จะถูกเปลี่ยนเป็นพื้นที่ที่แบ่งพื้นที่ออกเป็นสองฝั่ง

---

# 16. Capture Algorithm

หลังจาก Player เชื่อมกลับเข้ากับ Border:

1. ปิด Trail
2. เปลี่ยน Trail เป็น temporary wall
3. ตรวจสอบพื้นที่ EMPTY ทั้งหมด
4. หา Region ที่ Boss อยู่
5. พื้นที่ EMPTY ที่ไม่สามารถเชื่อมต่อกับ Boss ให้ถือว่าเป็นพื้นที่ถูกยึด
6. เปลี่ยนพื้นที่ดังกล่าวเป็น CLAIMED
7. Trail กลายเป็น CLAIMED
8. คำนวณ Percentage ใหม่

---

# 17. Important Capture Rule

**Boss ต้องไม่ถูกอยู่ในพื้นที่ที่ถูกยึด**

ดังนั้นเมื่อแบ่งพื้นที่ออกเป็นหลาย Region:

```text
Region A → มี Boss
Region B → ไม่มี Boss
```

ต้องทำ:

```text
Region A = EMPTY
Region B = CLAIMED
```

ตัวอย่าง:

```text
┌──────────────────────────┐
│██████████████████████████│
│███████        │██████████│
│███████        │██████████│
│███████   👹   │██████████│
│███████        │██████████│
│███████        │██████████│
│██████████████████████████│
└──────────────────────────┘
```

ฝั่งที่ไม่มี Boss ถูกยึด

ฝั่งที่มี Boss ยังคงเป็นพื้นที่เล่น

---

# 18. Multiple Regions

ระบบต้องรองรับกรณีที่ Trail แบ่งพื้นที่ออกเป็นหลาย Region

ตัวอย่าง:

```text
┌─────────────────────────┐
│█████████████████████████│
│██       │       │      ██│
│██       │       │      ██│
│██       │  👹   │      ██│
│██       │       │      ██│
│██       │       │      ██│
│█████████████████████████│
└─────────────────────────┘
```

เฉพาะ Region ที่ไม่มี Boss เท่านั้นที่ถูกยึด

---

# 19. Boss

## 19.1 Appearance

Demo ใช้:

```text
●
```

หรือ:

```text
👹
```

แนะนำให้ใช้รูปทรง Canvas ก่อน เพื่อไม่ผูกกับ Asset

---

# 20. Boss Movement

Boss เคลื่อนที่อยู่ภายในพื้นที่ EMPTY

Movement แบบง่าย:

```text
Random Direction
```

หรือ:

```text
Constant Velocity + Wall Bounce
```

แนะนำ:

```text
Boss Speed = 80 px/sec
```

Boss ต้องไม่ออกนอกพื้นที่เล่น

---

# 21. Boss Collision

Boss สามารถชนกับ:

- Player
- Trail

แต่ใน MVP ให้ความสำคัญกับ:

## Boss vs Trail

ถ้า Boss ชน Trail:

```text
GAME OVER
```

Player ตายทันที

---

# 22. Death Condition

Player ตายเมื่อ:

### Case 1

Boss ชน Trail ระหว่างที่ Player กำลัง Drawing

### Case 2

Player ชน Boss

### Case 3

Player ออกจาก Board

กรณี 3 ไม่ควรเกิดขึ้นในระบบปกติ แต่ต้องมี Safety Check

---

# 23. Death State

เมื่อ Player ตาย:

หยุด gameplay

แสดง:

```text
GAME OVER

Captured: 63%

[RESTART]
```

ไม่มี Ads ใน Demo Version

---

# 24. Restart

กด:

```text
R
```

หรือปุ่ม:

```text
RESTART
```

เพื่อ Reset Level

ต้อง reset:

- Territory
- Player
- Boss
- Trail
- Percentage
- Game State

---

# 25. Win Condition

เมื่อพื้นที่ CLAIMED >=:

```text
80%
```

ให้ถือว่า Level Complete

แสดง:

```text
LEVEL CLEAR!

80% CAPTURED

[PLAY AGAIN]
```

หรือถ้าทำได้มากกว่า:

```text
87%
```

แสดง:

```text
87% CAPTURED
```

---

# 26. Percentage Calculation

คำนวณเฉพาะพื้นที่เล่นด้านใน

ไม่รวม Border

Formula:

```text
capturedPercentage =
claimedPlayableCells /
totalPlayableCells × 100
```

ต้องแสดงเป็นจำนวนเต็ม:

```text
63%
```

---

# 27. HUD

ด้านบนของเกมแสดง:

```text
CAPTURED: 42%

TARGET: 80%
```

ตัวอย่าง:

```text
┌──────────────────────────────────┐
│ CAPTURED: 42%        TARGET: 80% │
├──────────────────────────────────┤
│                                  │
│              GAME                │
│                                  │
└──────────────────────────────────┘
```

---

# 28. Visual Style

Demo ไม่ต้องมี Graphic สวย

ใช้ Flat UI

Suggested:

```text
Background:
Dark / neutral

CLAIMED:
สีสว่างกว่าพื้นที่ EMPTY

EMPTY:
สีเข้ม

TRAIL:
สีที่เห็นชัดมาก

PLAYER:
สีเด่น

BOSS:
สีแดงหรือสี contrast สูง
```

ห้ามใช้ asset ภายนอกใน MVP

---

# 29. Input

## Desktop

ต้องรองรับ:

```text
Arrow Keys
W
A
S
D
```

## Restart

```text
R
```

## Pause

```text
P
```

Pause ไม่จำเป็นต้องมี UI ซับซ้อน

---

# 30. Movement Rules

Player movement ต้องเป็น Grid-aligned หรือสามารถใช้ continuous movement ได้

สำหรับ MVP แนะนำ:

## Grid-based Movement

เช่น:

```text
Cell Size = 10 px
```

Player เคลื่อนที่ทีละ Cell

ข้อดี:

- Collision ง่าย
- Trail ง่าย
- Territory calculation ง่าย
- Debug ง่าย
- สามารถย้ายระบบไป Defold ได้ง่ายภายหลัง

---

# 31. Recommended Game Loop

```text
requestAnimationFrame()

        ↓

Read Input

        ↓

Update Player

        ↓

Update Boss

        ↓

Update Trail

        ↓

Check Collision

        ↓

Check Border

        ↓

Capture Territory

        ↓

Calculate Percentage

        ↓

Check Win / Death

        ↓

Render
```

---

# 32. Game State

ใช้ state machine:

```text
READY
PLAYING
DRAWING
CAPTURING
DEAD
WIN
PAUSED
```

ไม่ควรใช้ Boolean จำนวนมากเพื่อควบคุม state ที่ขัดแย้งกัน

---

# 33. Core Functions

Implementation ควรแยก function ให้ชัดเจน

อย่างน้อยควรมี:

```javascript
initGame()

resetGame()

updateGame(deltaTime)

updatePlayer(deltaTime)

updateBoss(deltaTime)

startDrawing()

updateTrail()

finishDrawing()

captureTerritory()

findBossRegion()

calculateCapturedPercentage()

checkCollisions()

killPlayer()

winLevel()

renderGame()
```

---

# 34. Flood Fill

Territory detection ต้องใช้ Flood Fill หรือ BFS/DFS

Recommended:

```text
BFS
```

Algorithm:

```text
1. Mark all CLAIMED cells as blocked
2. Treat TRAIL as blocked
3. Start flood fill from Boss cell
4. Mark all reachable EMPTY cells
5. EMPTY cells not reachable from Boss are captured
```

Pseudo-code:

```text
reachable = floodFillFromBoss()

for each EMPTY cell:
    if cell NOT IN reachable:
        cell = CLAIMED
```

---

# 35. Collision Detection

Collision ระหว่าง Boss กับ Trail ต้องตรวจสอบทุก frame

Simplified MVP:

```text
Boss Grid Position
        ↓
ตรวจ Trail Cell
```

หากอยู่ Cell เดียวกัน:

```text
DEAD
```

สามารถเพิ่ม radius-based collision ภายหลังได้

---

# 36. Player Trail Self-Collision

ใน MVP:

Player ไม่ควรสามารถย้อนกลับชน Trail ตัวเอง

หากเกิด:

```text
DEAD
```

หรือเลือก reset trail ก็ได้

**Recommended: DEAD**

เพื่อให้เกมมี risk/reward

---

# 37. Player Border Movement

Player สามารถเคลื่อนที่บน Border ที่ถูก CLAIMED ได้

เช่น:

```text
→ → → → →
```

และสามารถเปลี่ยนทิศทางได้

แต่:

- ไม่สามารถเดินผ่าน EMPTY ขณะ ON_BORDER
- ต้องเข้าสู่ DRAWING เมื่อเดินเข้า EMPTY

---

# 38. Direction Rules

ขณะ DRAWING:

Player ต้องเดินในทิศทางเดียวที่กำหนด

ไม่ควรอนุญาตให้กลับทิศ 180 องศาทันที

เช่น:

```text
RIGHT
RIGHT
DOWN
DOWN
```

ได้

แต่:

```text
RIGHT
RIGHT
LEFT
```

ไม่ควรได้

---

# 39. Level Parameters

สร้าง object สำหรับ config:

```javascript
const levelConfig = {
    width: 80,
    height: 60,

    targetPercent: 80,

    bossSpeed: 8,

    playerSpeed: 1
};
```

ต้องสามารถเปลี่ยนค่าเหล่านี้ได้โดยไม่ต้องแก้ core engine

---

# 40. Demo Level

MVP มีเพียง **1 Level**

Configuration:

```text
Board: 80 × 60
Target: 80%
Boss: 1
Boss Speed: Medium
Player Speed: Fast
```

---

# 41. Debug Mode

ต้องมี Debug Mode เปิด/ปิดได้

```javascript
DEBUG = true;
```

เมื่อเปิด:

แสดง:

- Grid
- Player Cell
- Boss Cell
- Trail Cells
- Current State
- Captured Percentage
- FPS

ตัวอย่าง:

```text
STATE: DRAWING
PLAYER: 31,42
BOSS: 55,20
CAPTURED: 67%
FPS: 60
```

---

# 42. Performance

Demo ต้องสามารถทำงานประมาณ:

```text
60 FPS
```

บน Desktop Browser ทั่วไป

หลีกเลี่ยง:

- DOM element จำนวนมาก
- Canvas redraw หลายครั้งโดยไม่จำเป็น
- Object allocation ใน game loop
- Flood Fill ทุก frame

Flood Fill ทำเฉพาะตอน:

```text
Player reconnects to Border
```

เท่านั้น

---

# 43. Responsive Design

Canvas ต้อง:

- อยู่ตรงกลาง
- ไม่ล้นหน้าจอ
- รองรับ Desktop
- รองรับ Mobile screen

แต่ gameplay coordinate ต้องคงสัดส่วนเดิม

---

# 44. Error Handling

หากเกิด unexpected state:

- reset level ได้
- ไม่ทำให้ Browser crash
- แสดง error ใน console เมื่อ DEBUG=true

---

# 45. Code Quality

โค้ดต้อง:

- อ่านง่าย
- แยก logic / rendering
- มี comments เฉพาะส่วน algorithm สำคัญ
- ไม่มี dependency ที่ไม่จำเป็น
- ไม่มี framework ถ้าไม่จำเป็น
- ไม่มี build process ถ้าไม่จำเป็น

---

# 46. README.md

ต้องมี README อธิบาย:

## Run

วิธีที่ 1:

เปิด:

```text
index.html
```

วิธีที่ 2:

```bash
python3 -m http.server 8000
```

เปิด:

```text
http://localhost:8000
```

---

# 47. Controls

README ต้องระบุ:

```text
Arrow Keys / WASD
Move

R
Restart

P
Pause
```

---

# 48. Acceptance Criteria

Demo ถือว่าสำเร็จเมื่อ:

### AC-01

เปิดเกมบน Browser ได้

### AC-02

เห็น Game Board

### AC-03

Player อยู่บน Border ตอนเริ่มเกม

### AC-04

Player เคลื่อนที่บน Border ได้

### AC-05

Player สามารถออกจาก Border และสร้าง Trail ได้

### AC-06

Trail แสดงบนหน้าจอแบบ real-time

### AC-07

Player สามารถกลับไปชน Border ได้

### AC-08

เมื่อกลับถึง Border ระบบ Capture Territory

### AC-09

พื้นที่ที่ไม่มี Boss ถูกยึด

### AC-10

พื้นที่ที่มี Boss ไม่ถูกยึด

### AC-11

Captured Percentage อัปเดตหลัง Capture

### AC-12

Boss เคลื่อนที่ได้

### AC-13

Boss ชน Trail แล้ว Player ตาย

### AC-14

Player ชน Boss แล้ว Player ตาย

### AC-15

Death Screen แสดง

### AC-16

สามารถ Restart ได้

### AC-17

เมื่อ Capture >= 80% แสดง Level Clear

### AC-18

เกมทำงานได้ประมาณ 60 FPS

### AC-19

ไม่มี Ads

### AC-20

ไม่มี Backend

### AC-21

ไม่มี External Asset

---

# 49. Explicit Non-Goals

AI Coding Agent **ห้ามเพิ่ม feature ต่อไปนี้เอง**

```text
Ads
AdMob
Firebase
Login
Database
Backend
Multiplayer
Sound
Music
IAP
Shop
Coins
Skins
Achievements
Leaderboard
Social Login
AI API
Image Generation API
External CDN
External Framework
```

เว้นแต่ผู้พัฒนาจะร้องขอภายหลัง

---

# 50. Future Version

Feature เหล่านี้เก็บไว้สำหรับหลัง MVP เท่านั้น

## Version 0.2

- Touch control
- Multiple levels
- Boss difficulty
- Better animation
- Sound effects

## Version 0.3

- AI-generated backgrounds
- AI-generated bosses
- Multiple themes
- Level progression

## Version 0.4

- Rewarded Ads
- Continue after death
- Double reward
- AdMob

## Version 1.0

- Daily levels
- World / Theme system
- Statistics
- More bosses
- Monetization
- Google Play release

---

# 51. Important Design Principle

**Core Gameplay มาก่อน Graphics**

MVP ต้องพิสูจน์สิ่งเดียว:

> "การลากเส้นเพื่อยึดพื้นที่ โดยพยายามหลบ Boss สนุกหรือไม่"

ดังนั้นหากระบบสามารถ:

```text
Move
→ Draw
→ Avoid Boss
→ Connect Border
→ Capture Area
→ Repeat
→ Reach 80%
→ Win
```

ได้อย่างสมบูรณ์ ถือว่า MVP สำเร็จ

ไม่ต้องรอ AI Art, Animation หรือ Ads

---

# 52. Expected Demo

เมื่อเปิดเกม ผู้เล่นควรเข้าใจได้ภายในไม่เกิน 10 วินาทีว่า:

```text
1. ตัวเองอยู่ที่ขอบ
2. เดินออกไปในพื้นที่ได้
3. ต้องกลับไปชนขอบ
4. การลากเส้นจะยึดพื้นที่
5. Boss อันตราย
6. ยึดให้ถึง 80%
```

Core gameplay ต้องรู้สึกเหมือน Arcade:

```text
Easy to understand
Hard to master
Fast restart
Short game session
High risk / reward
```

---

# 53. Definition of Done

Project ถือว่าเสร็จเมื่อผู้เล่นสามารถทำ Gameplay Loop ต่อไปนี้ได้โดยไม่มี Bug ร้ายแรง:

```text
START
  ↓
Move on Border
  ↓
Enter Empty Area
  ↓
Create Trail
  ↓
Avoid Boss
  ↓
Reconnect to Border
  ↓
Capture Area
  ↓
Percentage increases
  ↓
Repeat
  ↓
Reach 80%
  ↓
LEVEL CLEAR
```

และสามารถ:

```text
START
  ↓
Draw Trail
  ↓
Boss hits Trail
  ↓
DEATH
  ↓
RESTART
```

ได้อย่างถูกต้อง

**นี่คือ MVP ทั้งหมด**