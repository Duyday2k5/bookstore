# Website Ban Sach - React Vite

Du an xay dung website ban sach theo huong fullstack, tap trung vao trai nghiem mua sam, quan ly gio hang, dat hang, va quan ly tai khoan.

## 1) Tong quan cong nghe
- React 18
- React Router 6
- Redux Toolkit
- Vite 4
- Ant Design

## 2) Project Charter va Muc tieu SMART

### 2.1 Project Charter
- **Ten du an:** Website Ban Sach Online
- **Muc tieu tong quat:** Xay dung he thong ban sach truc tuyen ho tro tim kiem sach, quan ly gio hang, dat hang, xem lich su mua hang, va phan quyen quan tri.
- **Doi tuong su dung:** Nguoi mua sach online va quan tri vien quan ly san pham.
- **Pham vi du an (Scope):**
  - Co: dang ky/dang nhap, xem danh sach sach, xem chi tiet, gio hang, dat hang, lich su don, trang quan tri co ban.
  - Khong: chua tich hop logistics ben thu ba (theo doi shipper real-time), chua tich hop cong thanh toan quoc te.
- **Rang buoc:** Nhom 4 thanh vien, thoi gian 10 tuan, theo tien do sprint.

### 2.2 Muc tieu SMART
- **Specific:** Xay dung website ban sach ho tro tim kiem, mua hang, va xu ly don hang online.
- **Measurable:** Hoan thanh 100% tinh nang cot loi: CRUD sach, gio hang, dat hang, quan ly tai khoan/phan quyen.
- **Achievable:** Hoan thanh boi nhom 4 nguoi trong 10 tuan.
- **Relevant:** Dap ung yeu cau mon hoc va co kha nang mo rong thanh san pham thuc te.
- **Time-bound:** Hoan thanh truoc deadline nop bai ngay `XX/XX/2026`.

## 3) WBS (Work Breakdown Structure) - 3 tang

### Tang 1 - Quan ly du an
- Lap ke hoach tong the, xac dinh scope va milestone.
- To chuc sprint planning, daily/weekly check-in.
- Theo doi tien do va cap nhat bao cao giang vien.

### Tang 2 - Phat trien ky thuat
- **Frontend**
  - Thiet ke UI/UX cho trang chu, chi tiet sach, gio hang, dat hang.
  - Phat trien component React cho Header, Book list, View Detail, Order page.
  - Quan ly state voi Redux Toolkit (gio hang, auth, account, don hang).
- **Backend/API**
  - Thiet ke CSDL va API phuc vu sach, user, order.
  - API Authentication: Login/Register/Logout.
  - API cho xu ly dat hang va lich su mua hang.
- **Database**
  - Mo hinh du lieu co ban: Books, Users, Orders, OrderDetails.

### Tang 3 - Kiem thu va trien khai
- Kiem thu chuc nang cot loi (tim kiem, gio hang, dat hang, auth).
- Kiem thu giao dien responsive (desktop/tablet/mobile).
- Build va deploy (Vercel/Heroku hoac nen tang tuong duong).

## 4) Quan ly du an bang Trello (nang cao)
- **Workflow cot:** Backlog -> To Do -> In Progress -> Code Review -> Testing -> Done.
- **Automation (Butler):** Khi card chuyen sang `Done`, tu dong gan nhan hoan thanh va gui thong bao vao group.
- **GitHub Power-Up:** Gan commit/PR vao card de truy vet tinh nang va lich su thay doi.
- **Custom Fields:**
  - `Estimate Time` (gio/ngay du kien)
  - `Actual Time` (gio/ngay thuc te)
  - `Priority` (High/Medium/Low)
  - `Owner` (nguoi phu trach)

## 5) Uoc luong va lich trinh (PERT)
Cong thuc PERT:

`E = (O + 4M + P) / 6`

Vi du task: **Tich hop API thanh toan/don hang**
- O (Lac quan): 3 ngay
- M (Kha thi): 5 ngay
- P (Bi quan): 10 ngay

`E = (3 + 4*5 + 10) / 6 = 5.5 ngay`

Y nghia: team dat moc ke hoach ~6 ngay cho task nay, co du buffer cho rui ro.

## 6) Quan ly rui ro va ke hoach du phong

| Rui ro | Tac dong | Phong ngua | Ke hoach du phong |
|---|---|---|---|
| Merge conflict khi lam song song | Cham tien do sprint 1-2 ngay | Moi thanh vien lam branch rieng, pull/rebase thuong xuyen, review som | PM ho tro resolve conflict cuoi ngay, uu tien merge phan core truoc |
| Mat du lieu mau hoac loi CSDL | Gian doan demo/kiem thu | Backup du lieu dinh ky, luu script seed | Phuc hoi nhanh bang script seed/backup gan nhat |
| API backend khong on dinh luc demo | Loi dat hang hoac load du lieu cham | Tao checklist test truoc demo, dung env on dinh | Chuan bi video demo va du lieu mock de trinh bay |
| Tre tien do do task kho hon du kien | Anh huong deadline | Uoc luong PERT, chia task nho, theo doi burndown | Cat giam tinh nang phu, uu tien tinh nang cot loi |

## 7) Chi so do luong (Metrics)
- **Sprint Burndown Chart:** Theo doi khoi luong cong viec con lai moi ngay.
- **Velocity:** So story point/task hoan thanh moi sprint.
- **Defect Rate:** So loi phat hien sau khi qua testing/code review.
- **Plan vs Actual Time:** So sanh thoi gian du kien va thuc te tren tung card.

Neu duong burndown thuc te nam tren duong ly tuong -> team dang cham tien do.
Hanh dong: tai phan bo nguon luc, tang pair programming, cat bot tinh nang phu.

## 8) Demo va ket luan bao cao
- Chuan bi **screen recording** cac luong chinh:
  - Dang nhap/dang ky
  - Tim kiem sach
  - Them vao gio hang
  - Dat hang va xem lich su mua
  - Quan tri (neu co vai tro admin)
- Tranh rui ro demo song bi anh huong boi mang/server.
- Bai hoc rut ra:
  - Quan ly duoc 50+ dau viec tren Trello khong bi sot.
  - Cai thien ky nang phoi hop frontend-backend.
  - Nang cao ky nang xu ly blocker ky thuat trong sprint.

## 9) Cai dat va chay du an

### Moi truong de xuat
- Node.js `v16.13.1`
- Link tai: https://nodejs.org/download/release/v16.13.1/

### Chay development
1. Clone source code
2. Cai dat thu vien:
   - `npm i --legacy-peer-deps`
3. Cap nhat `.env.development` (neu can)
4. Chay:
   - `npm run dev`

### Chay production mode (local preview)
1. Clone source code
2. Cai dat thu vien:
   - `npm i --legacy-peer-deps`
3. Cap nhat `.env.production` (neu can)
4. Build:
   - `npm run build`
5. Preview:
   - `npm run preview`
