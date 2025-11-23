# Backend Implementation Guide - Bookstore Features

## 📋 Tóm tắt các endpoint cần implement

| # | Endpoint | Method | Auth | Priority | Status |
|---|----------|--------|------|----------|--------|
| 1 | `/api/v1/auth/forgot-password` | POST | ❌ | HIGH | ❌ Missing |
| 2 | `/api/v1/auth/reset-password` | POST | ❌ | HIGH | ❌ Missing |
| 3 | `/api/v1/discount/validate` | POST | ❌ | HIGH | ❌ Missing |
| 4 | `/api/v1/order/:id` | PUT | ✅ | HIGH | ❌ Missing |

---

## 1️⃣ POST /api/v1/auth/forgot-password

### Purpose
Gửi email reset password cho user

### Request Body
```json
{
  "email": "user@example.com"
}
```

### Validation
- ✅ Email bắt buộc
- ✅ Email phải hợp lệ
- ✅ Email phải tồn tại trong DB

### Response Success (200)
```json
{
  "statusCode": 200,
  "message": "Password reset email sent successfully",
  "data": {
    "email": "user@example.com",
    "resetTokenSent": true,
    "expiresIn": "15 minutes"
  }
}
```

### Error Responses

**404 - User not found**
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "NOT_FOUND"
}
```

**500 - Email send failed**
```json
{
  "statusCode": 500,
  "message": "Failed to send reset email",
  "error": "INTERNAL_SERVER_ERROR"
}
```

### Logic
1. Validate email format
2. Find user by email
3. Generate JWT token (15 phút expiry) - lưu vào env: `JWT_RESET_SECRET`, `JWT_RESET_EXPIRE_IN=900s`
4. Send email với reset link format:
   ```
   http://frontend-url/reset-password?email={email}&token={token}
   ```
5. Return success response
6. LOG: "Password reset email sent for: {email}"

### Email Template (HTML)
```html
<h2>Reset Your Password</h2>
<p>Click the link below to reset your password (valid for 15 minutes):</p>
<a href="http://localhost:3000/reset-password?email={email}&token={token}">
  Reset Password
</a>
<p>If you didn't request this, ignore this email.</p>
```

### Environment Variables Needed
```env
JWT_RESET_SECRET=your_reset_secret_key
JWT_RESET_EXPIRE_IN=900s          # 15 minutes
EMAIL_SERVICE=gmail               # or your email service
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000
```

---

## 2️⃣ POST /api/v1/auth/reset-password

### Purpose
Thực hiện reset password với reset token

### Request Body
```json
{
  "email": "user@example.com",
  "resetToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "newPassword": "NewPassword123!",
  "confirmPassword": "NewPassword123!"
}
```

### Validation
- ✅ Email bắt buộc
- ✅ resetToken bắt buộc
- ✅ newPassword bắt buộc, min 6 ký tự
- ✅ confirmPassword phải match newPassword
- ✅ Token không được expired
- ✅ Email trong token phải match request email

### Response Success (200)
```json
{
  "statusCode": 200,
  "message": "Password reset successfully",
  "data": {
    "email": "user@example.com",
    "resetAt": "2025-11-22T10:30:00Z"
  }
}
```

### Error Responses

**400 - Invalid/Expired Token**
```json
{
  "statusCode": 400,
  "message": "Reset token is invalid or expired",
  "error": "INVALID_TOKEN"
}
```

**400 - Password Mismatch**
```json
{
  "statusCode": 400,
  "message": "Passwords do not match",
  "error": "PASSWORD_MISMATCH"
}
```

**400 - Weak Password**
```json
{
  "statusCode": 400,
  "message": "Password must be at least 6 characters",
  "error": "WEAK_PASSWORD"
}
```

**404 - User not found**
```json
{
  "statusCode": 404,
  "message": "User not found",
  "error": "NOT_FOUND"
}
```

### Logic
1. Validate input fields
2. Verify reset token (JWT verify with JWT_RESET_SECRET)
3. Check token hasn't expired
4. Find user by email
5. Hash new password
6. Update user password in DB
7. LOG: "Password reset successful for: {email}"
8. Return success response

### Code Example (Node.js/Express)
```javascript
router.post('/auth/reset-password', async (req, res) => {
  const { email, resetToken, newPassword, confirmPassword } = req.body;
  
  // Validation
  if (!email || !resetToken || !newPassword) {
    return res.status(400).json({
      statusCode: 400,
      message: "Missing required fields",
      error: "VALIDATION_ERROR"
    });
  }
  
  if (newPassword !== confirmPassword) {
    return res.status(400).json({
      statusCode: 400,
      message: "Passwords do not match",
      error: "PASSWORD_MISMATCH"
    });
  }
  
  if (newPassword.length < 6) {
    return res.status(400).json({
      statusCode: 400,
      message: "Password must be at least 6 characters",
      error: "WEAK_PASSWORD"
    });
  }
  
  try {
    // Verify token
    const decoded = jwt.verify(resetToken, process.env.JWT_RESET_SECRET);
    
    if (decoded.email !== email) {
      return res.status(400).json({
        statusCode: 400,
        message: "Token email doesn't match request email",
        error: "INVALID_TOKEN"
      });
    }
    
    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
        error: "NOT_FOUND"
      });
    }
    
    // Hash and update password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();
    
    res.status(200).json({
      statusCode: 200,
      message: "Password reset successfully",
      data: {
        email: user.email,
        resetAt: new Date()
      }
    });
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({
        statusCode: 400,
        message: "Reset token has expired",
        error: "TOKEN_EXPIRED"
      });
    }
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: "INTERNAL_ERROR"
    });
  }
});
```

---

## 3️⃣ POST /api/v1/discount/validate

### Purpose
Validate discount code và trả về discount details

### Request Body
```json
{
  "code": "SAVE20",
  "orderTotal": 500000
}
```

### Validation
- ✅ Code bắt buộc
- ✅ orderTotal bắt buộc và > 0
- ✅ Code phải tồn tại
- ✅ Code phải active
- ✅ Code chưa hết hạn
- ✅ Code chưa vượt max uses
- ✅ orderTotal >= minOrderValue (nếu có)

### Response Success (200)
```json
{
  "statusCode": 200,
  "message": "Discount code is valid",
  "data": {
    "code": "SAVE20",
    "discountType": "percentage",
    "discountValue": 20,
    "originalTotal": 500000,
    "discountAmount": 100000,
    "finalTotal": 400000,
    "description": "Save 20% on all orders",
    "expiryDate": "2025-12-31T23:59:59Z",
    "usesRemaining": 95,
    "maxUses": 100
  }
}
```

### Error Responses

**404 - Code not found**
```json
{
  "statusCode": 404,
  "message": "Discount code not found",
  "error": "INVALID_CODE"
}
```

**400 - Code expired**
```json
{
  "statusCode": 400,
  "message": "Discount code has expired",
  "error": "CODE_EXPIRED"
}
```

**400 - Max uses exceeded**
```json
{
  "statusCode": 400,
  "message": "Discount code has reached maximum uses",
  "error": "MAX_USES_EXCEEDED"
}
```

**400 - Code disabled**
```json
{
  "statusCode": 400,
  "message": "Discount code is disabled",
  "error": "CODE_DISABLED"
}
```

**400 - Minimum order value not met**
```json
{
  "statusCode": 400,
  "message": "Order total must be at least 100000 VND for this discount",
  "error": "MIN_ORDER_VALUE_NOT_MET"
}
```

### Logic
1. Validate input
2. Find discount by code
3. Check if exists and active
4. Check expiry date
5. Check if max uses exceeded
6. Check minimum order value (nếu có)
7. Calculate discount:
   - Nếu `discountType === 'percentage'`: `discountAmount = orderTotal * (discountValue / 100)`
   - Nếu `discountType === 'fixed'`: `discountAmount = discountValue`
8. Calculate `finalTotal = orderTotal - discountAmount`
9. Return success response with all details
10. LOG: "Discount validated: {code}, savings: {discountAmount}"

### Discount Model Schema
```javascript
{
  _id: ObjectId,
  code: String,              // Unique, e.g., "SAVE20"
  description: String,       // "Save 20% on all orders"
  discountType: String,      // "percentage" | "fixed"
  discountValue: Number,     // 20 for %, 50000 for VND
  minOrderValue: Number,     // Optional, e.g., 100000
  maxUses: Number,           // e.g., 100
  currentUses: Number,       // e.g., 5
  expiryDate: Date,          // e.g., 2025-12-31
  status: String,            // "active" | "disabled"
  createdAt: Date,
  updatedAt: Date
}
```

### Code Example (Node.js/Express)
```javascript
router.post('/discount/validate', async (req, res) => {
  const { code, orderTotal } = req.body;
  
  // Validation
  if (!code || !orderTotal || orderTotal <= 0) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid input",
      error: "VALIDATION_ERROR"
    });
  }
  
  try {
    const discount = await Discount.findOne({ 
      code: code.toUpperCase(),
      status: 'active'
    });
    
    if (!discount) {
      return res.status(404).json({
        statusCode: 404,
        message: "Discount code not found",
        error: "INVALID_CODE"
      });
    }
    
    // Check expiry
    if (new Date() > discount.expiryDate) {
      return res.status(400).json({
        statusCode: 400,
        message: "Discount code has expired",
        error: "CODE_EXPIRED"
      });
    }
    
    // Check max uses
    if (discount.currentUses >= discount.maxUses) {
      return res.status(400).json({
        statusCode: 400,
        message: "Discount code has reached maximum uses",
        error: "MAX_USES_EXCEEDED"
      });
    }
    
    // Check minimum order value
    if (discount.minOrderValue && orderTotal < discount.minOrderValue) {
      return res.status(400).json({
        statusCode: 400,
        message: `Order total must be at least ${discount.minOrderValue} VND for this discount`,
        error: "MIN_ORDER_VALUE_NOT_MET"
      });
    }
    
    // Calculate discount
    let discountAmount = 0;
    if (discount.discountType === 'percentage') {
      discountAmount = Math.floor(orderTotal * (discount.discountValue / 100));
    } else if (discount.discountType === 'fixed') {
      discountAmount = discount.discountValue;
    }
    
    const finalTotal = Math.max(0, orderTotal - discountAmount);
    
    res.status(200).json({
      statusCode: 200,
      message: "Discount code is valid",
      data: {
        code: discount.code,
        discountType: discount.discountType,
        discountValue: discount.discountValue,
        originalTotal: orderTotal,
        discountAmount,
        finalTotal,
        description: discount.description,
        expiryDate: discount.expiryDate,
        usesRemaining: discount.maxUses - discount.currentUses,
        maxUses: discount.maxUses
      }
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: "INTERNAL_ERROR"
    });
  }
});
```

---

## 4️⃣ PUT /api/v1/order/:id

### Purpose
Update order status (admin only) hoặc update order details (user)

### Authentication
- ✅ JWT Bearer token required
- ✅ Admin hoặc order owner

### Request Body
```json
{
  "status": "processing",
  "address": "123 Main Street, District 1, Ho Chi Minh City",
  "phone": "0912345678",
  "name": "John Doe",
  "discountCode": "SAVE20",
  "notes": "Please deliver in the morning"
}
```

### URL Parameters
```
/api/v1/order/:id
```

### Validation
- ✅ Order ID valid (MongoDB ObjectId)
- ✅ Order exists
- ✅ User is admin OR order owner
- ✅ Status trong enum: `pending`, `processing`, `completed`, `cancelled`
- ✅ Address, name, phone nếu update phải valid

### Response Success (200)
```json
{
  "statusCode": 200,
  "message": "Order updated successfully",
  "data": {
    "_id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "address": "123 Main Street, District 1, Ho Chi Minh City",
    "phone": "0912345678",
    "status": "processing",
    "type": "COD",
    "detail": [
      {
        "bookId": "507f1f77bcf86cd799439012",
        "bookName": "Clean Code",
        "price": 250000,
        "quantity": 2,
        "totalPrice": 500000
      }
    ],
    "totalPrice": 500000,
    "discountCode": "SAVE20",
    "discountAmount": 100000,
    "finalTotal": 400000,
    "createdAt": "2025-11-20T10:00:00Z",
    "updatedAt": "2025-11-22T10:30:00Z"
  }
}
```

### Error Responses

**400 - Invalid ObjectId**
```json
{
  "statusCode": 400,
  "message": "Invalid order ID",
  "error": "INVALID_ID"
}
```

**404 - Order not found**
```json
{
  "statusCode": 404,
  "message": "Order not found",
  "error": "NOT_FOUND"
}
```

**400 - Invalid status**
```json
{
  "statusCode": 400,
  "message": "Invalid order status. Allowed: pending, processing, completed, cancelled",
  "error": "INVALID_STATUS"
}
```

**403 - Permission denied**
```json
{
  "statusCode": 403,
  "message": "You don't have permission to update this order",
  "error": "FORBIDDEN"
}
```

**400 - Invalid discount**
```json
{
  "statusCode": 400,
  "message": "Discount code is not valid or has expired",
  "error": "INVALID_DISCOUNT"
}
```

### Order Model Schema (Updated)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,              // Reference to User
  name: String,
  address: String,
  phone: String,
  status: String,                // NEW: pending, processing, completed, cancelled
  type: String,                  // COD, BANK_TRANSFER, etc.
  detail: [                       // Order items
    {
      bookId: ObjectId,
      bookName: String,
      author: String,
      price: Number,
      quantity: Number,
      totalPrice: Number
    }
  ],
  totalPrice: Number,            // Original total before discount
  discountCode: String,          // NEW: Applied discount code
  discountAmount: Number,        // NEW: Discount amount in VND
  finalTotal: Number,            // NEW: Final price after discount
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date                // Soft delete
}
```

### Logic
1. Validate MongoDB ObjectId
2. Find order by ID
3. Check authorization (admin OR order.userId === req.user._id)
4. If updating status:
   - Validate status enum
   - Update order status
5. If updating discount:
   - Validate discount code
   - Increment discount usage count
   - Recalculate finalTotal
6. If updating address/phone/name:
   - Validate fields
   - Update order
7. Update timestamps
8. Save and return updated order
9. LOG: "Order {id} updated: {fields}"

### Code Example (Node.js/Express)
```javascript
router.put('/order/:id', authenticateToken, async (req, res) => {
  const { id } = req.params;
  const { status, address, phone, name, discountCode } = req.body;
  const userId = req.user._id;
  
  // Validate ObjectId
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({
      statusCode: 400,
      message: "Invalid order ID",
      error: "INVALID_ID"
    });
  }
  
  try {
    // Find order
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        statusCode: 404,
        message: "Order not found",
        error: "NOT_FOUND"
      });
    }
    
    // Check authorization (admin OR order owner)
    const isAdmin = req.user.role === 'ADMIN';
    const isOwner = order.userId.toString() === userId.toString();
    
    if (!isAdmin && !isOwner) {
      return res.status(403).json({
        statusCode: 403,
        message: "You don't have permission to update this order",
        error: "FORBIDDEN"
      });
    }
    
    // Update status
    if (status) {
      const validStatuses = ['pending', 'processing', 'completed', 'cancelled'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          statusCode: 400,
          message: "Invalid order status",
          error: "INVALID_STATUS"
        });
      }
      order.status = status;
    }
    
    // Update address/phone/name
    if (address) order.address = address;
    if (phone) order.phone = phone;
    if (name) order.name = name;
    
    // Update discount
    if (discountCode) {
      const discount = await Discount.findOne({ code: discountCode });
      if (!discount) {
        return res.status(400).json({
          statusCode: 400,
          message: "Invalid discount code",
          error: "INVALID_DISCOUNT"
        });
      }
      
      order.discountCode = discountCode;
      order.discountAmount = ...; // Calculate based on type
      order.finalTotal = order.totalPrice - order.discountAmount;
      
      // Increment usage
      discount.currentUses += 1;
      await discount.save();
    }
    
    // Save
    await order.save();
    
    res.status(200).json({
      statusCode: 200,
      message: "Order updated successfully",
      data: order
    });
  } catch (error) {
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: "INTERNAL_ERROR"
    });
  }
});
```

---

## 🗂️ Database Collections cần cập nhật

### 1. Users Collection
```javascript
// Thêm field nếu chưa có
{
  _id: ObjectId,
  email: String,
  password: String,
  fullName: String,
  phone: String,
  avatar: String,
  role: String,              // USER, ADMIN
  // ... other fields
}
```

### 2. Orders Collection (UPDATE)
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  address: String,
  phone: String,
  status: String,            // NEW: pending, processing, completed, cancelled
  type: String,
  detail: Array,
  totalPrice: Number,
  discountCode: String,      // NEW
  discountAmount: Number,    // NEW
  finalTotal: Number,        // NEW
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date
}
```

### 3. Discounts Collection (NEW)
```javascript
{
  _id: ObjectId,
  code: String,              // Unique
  description: String,
  discountType: String,      // percentage, fixed
  discountValue: Number,
  minOrderValue: Number,
  maxUses: Number,
  currentUses: Number,
  expiryDate: Date,
  status: String,            // active, disabled
  createdAt: Date,
  updatedAt: Date
}
```

---

## 📝 Implementation Checklist

- [ ] Create `/api/v1/auth/forgot-password` endpoint
- [ ] Create `/api/v1/auth/reset-password` endpoint
- [ ] Create `/api/v1/discount/validate` endpoint
- [ ] Update `/api/v1/order/:id` PUT endpoint
- [ ] Add status field to Order model
- [ ] Add discount fields to Order model
- [ ] Create Discount model/collection
- [ ] Add email service setup (nodemailer/sendgrid)
- [ ] Add JWT reset token secret to .env
- [ ] Test all endpoints with cURL/Postman
- [ ] Add error logging
- [ ] Add input validation
- [ ] Add database migrations if needed

---

## 🧪 Testing with cURL

### Test Forgot Password
```bash
curl -X POST http://localhost:8080/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com"}'
```

### Test Reset Password
```bash
curl -X POST http://localhost:8080/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "resetToken": "TOKEN_FROM_EMAIL",
    "newPassword": "NewPass123",
    "confirmPassword": "NewPass123"
  }'
```

### Test Validate Discount
```bash
curl -X POST http://localhost:8080/api/v1/discount/validate \
  -H "Content-Type: application/json" \
  -d '{"code": "SAVE20", "orderTotal": 500000}'
```

### Test Update Order Status
```bash
curl -X PUT http://localhost:8080/api/v1/order/507f1f77bcf86cd799439011 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "status": "processing",
    "address": "123 Main St, D1, HCMC",
    "phone": "0912345678",
    "discountCode": "SAVE20"
  }'
```

