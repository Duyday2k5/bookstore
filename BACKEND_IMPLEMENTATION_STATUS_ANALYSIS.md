# Backend Implementation Status Analysis

**Analysis Date:** November 22, 2025  
**Status:** 4 Critical Endpoints NOT Implemented  
**Priority Level:** CRITICAL - Frontend is using mock APIs as fallback

---

## Executive Summary

| Component | Status | Implementation % |
|-----------|--------|------------------|
| Forgot Password Endpoint | ❌ MISSING | 0% |
| Reset Password Endpoint | ❌ MISSING | 0% |
| Discount Validation Endpoint | ❌ MISSING | 0% |
| Order Update Endpoint | ❌ MISSING | 0% |
| Order Model Updates | ❌ MISSING | N/A |
| Discount Model/Collection | ❌ MISSING | N/A |
| Email Service Setup | ❌ MISSING | N/A |
| JWT Reset Token Config | ❌ MISSING | N/A |

---

## 1. COMPLETED IMPLEMENTATIONS

### None Currently Implemented

**Status:** All 4 critical endpoints from the guide are missing from the backend.

---

## 2. MISSING IMPLEMENTATIONS

### 2.1 POST `/api/v1/auth/forgot-password` - HIGH PRIORITY

**Frontend Usage:**
- Location: `src/pages/forgot-password/index.jsx`
- API Method: `callForgotPassword(email)`
- Expected Request: `{ email: string }`
- Expected Response: `{ statusCode: 200, data: { email, resetTokenSent, expiresIn } }`
- Fallback: Mock API returns fake response after 500ms

**Current Frontend Flow:**
1. User enters email (sanitized via `sanitizeInput`)
2. Email validated via `validateEmail()`
3. API call: `callForgotPassword(sanitizedEmail)`
4. On success: Message "Check email for reset instructions" → Navigate to login
5. If API fails → Uses mock API as fallback

**Requirements from Guide:**
- ✅ Email validation (required + valid format)
- ✅ User existence check
- ✅ JWT token generation (15-minute expiry)
- ✅ Email sending with reset link
- ✅ Response with resetTokenSent flag
- ✅ Logging: "Password reset email sent for: {email}"
- ✅ Environment variables: `JWT_RESET_SECRET`, `JWT_RESET_EXPIRE_IN=900s`

**Environment Variables Needed:**
```env
JWT_RESET_SECRET=your_reset_secret_key
JWT_RESET_EXPIRE_IN=900s              # 15 minutes
EMAIL_SERVICE=gmail                   # or sendgrid/etc
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password
FRONTEND_URL=http://localhost:3000
```

**Gap Analysis:**
- No email service configured (nodemailer/sendgrid)
- No JWT reset token secret in .env
- No endpoint implementation
- No User model validation for email existence

---

### 2.2 POST `/api/v1/auth/reset-password` - HIGH PRIORITY

**Frontend Usage:**
- Location: `src/pages/reset-password/index.jsx`
- URL Parameters: `?email={email}&token={token}` (from email link)
- API Method: `callResetPassword(email, resetToken, newPassword)`
- Expected Request: `{ email, resetToken, newPassword, confirmPassword }`
- Expected Response: `{ statusCode: 200, data: { email, resetAt } }`
- Fallback: Mock API returns success after 500ms

**Current Frontend Flow:**
1. Extract `email` and `token` from URL search params
2. Redirect to login if either missing
3. User enters new password
4. Password validated: min 6 characters via `validatePassword()`
5. API call: `callResetPassword(email, resetToken, newPassword)`
6. On success: "Password reset successful! Please login again" → Navigate to login
7. If API fails → Uses mock API as fallback

**Requirements from Guide:**
- ✅ Validate all fields present
- ✅ Verify JWT token not expired
- ✅ Email in token matches request email
- ✅ Password validation (min 6 chars)
- ✅ Password confirmation match
- ✅ Find user by email
- ✅ Hash and update password
- ✅ Response with resetAt timestamp
- ✅ Error handling for expired token

**Gap Analysis:**
- No endpoint implementation
- No token verification logic
- No password hashing logic
- No database update logic
- No expired token error handling

---

### 2.3 POST `/api/v1/discount/validate` - HIGH PRIORITY

**Frontend Usage:**
- Location: `src/components/Order/Payment.jsx`
- API Method: `callValidateDiscountCode(code, orderTotal)`
- Expected Request: `{ code: string, orderTotal: number }`
- Expected Response: `{ statusCode: 200, data: { code, discountType, discountValue, originalTotal, discountAmount, finalTotal, ... } }`
- Fallback: Mock API returns data for 'SAVE20' (20% off) and 'SAVE50000' (fixed 50k off)

**Current Frontend Flow:**
1. User enters discount code (sanitized via `sanitizeInput`)
2. Click "Apply" button
3. API call: `callValidateDiscountCode(code, totalPrice)`
4. Response validation: checks `res?.data`
5. If valid:
   - Dispatch Redux action: `doApplyDiscount()`
   - Store discount in Redux state
   - Convert `discountType: 'percentage'` → `'PERCENT'` or `'fixed'` → `'AMOUNT'`
   - Calculate displayed savings: `discountAmount` from response
6. If invalid → Error notification with message
7. If API fails → Uses mock API as fallback

**Redux State Updated (discountSlice):**
```javascript
{
  code: string,
  discount: number,           // discount value (percent or amount)
  discountType: 'PERCENT' | 'AMOUNT',
  isApplied: boolean,
  message: string
}
```

**Requirements from Guide:**
- ✅ Find discount by code (case-insensitive, active status)
- ✅ Check expiry date
- ✅ Check max uses limit
- ✅ Check minimum order value (if set)
- ✅ Validate discount exists and active
- ✅ Calculate discount amount based on type
- ✅ Return usesRemaining count
- ✅ Return finalTotal (after discount)
- ✅ Error responses with specific error codes

**Frontend Response Mapping:**
- `res.data.discountType === 'percentage'` → stored as `'PERCENT'`
- `res.data.discountType === 'fixed'` → stored as `'AMOUNT'`
- `res.data.discountValue` → stored as `discount`
- `res.data.discountAmount` → shown in success message
- `res.data.finalTotal` → used for order total

**Discount Data Passed to Order:**
```javascript
{
  discountCode: discount.code || null,
  discountAmount: discount.isApplied ? (totalPrice - discountedPrice) : 0,
  finalTotal: discountedPrice
}
```

**Gap Analysis:**
- No Discount collection in database
- No endpoint implementation
- No discount validation logic
- No usage tracking logic
- No discount model/schema created

---

### 2.4 PUT `/api/v1/order/:id` - HIGH PRIORITY

**Frontend Usage:**

**Location 1: Admin Order Management**
- File: `src/components/Admin/Order/MangeOrder.jsx`
- API Method: `callUpdateOrderStatus(orderId, status)`
- Expected Request: `{ status: string }`
- Called when: Admin changes order status in dropdown select
- Expected Response: `{ statusCode: 200, data: { updatedOrder } }`

**Location 2: Order Status Options**
```javascript
STATUS_OPTIONS = [
  { label: 'Chờ xác nhận', value: 'pending' },
  { label: 'Đang xử lý', value: 'processing' },
  { label: 'Đã hoàn thành', value: 'completed' },
  { label: 'Đã hủy', value: 'cancelled' },
]
```

**Current Admin Flow:**
1. Admin selects new status from dropdown
2. `handleUpdateStatus(orderId, newStatus)` called
3. API call: `callUpdateOrderStatus(orderId, newStatus)`
4. If success:
   - Show success message
   - Update local state with new status
5. If error:
   - Show error notification
   - Status remains unchanged

**Requirements from Guide:**
- ✅ MongoDB ObjectId validation
- ✅ Find order by ID
- ✅ Authorization check (admin OR order owner)
- ✅ Status validation (enum: pending, processing, completed, cancelled)
- ✅ Address/phone/name update (optional)
- ✅ Discount code update support (optional)
- ✅ Update timestamps
- ✅ Return updated order object

**Order Model Schema Requirements:**
```javascript
{
  _id: ObjectId,
  userId: ObjectId,
  name: String,
  address: String,
  phone: String,
  status: String,            // NEW FIELD: pending, processing, completed, cancelled
  type: String,              // COD, BANK_TRANSFER
  detail: Array,             // { bookId, bookName, price, quantity, totalPrice }
  totalPrice: Number,        // Original total
  discountCode: String,      // NEW FIELD
  discountAmount: Number,    // NEW FIELD
  finalTotal: Number,        // NEW FIELD
  createdAt: Date,
  updatedAt: Date,
  deletedAt: Date            // For soft delete
}
```

**Response Expected by Frontend:**
```javascript
{
  statusCode: 200,
  data: {
    _id: "507f...",
    name: "John Doe",
    address: "123 Main St, D1, HCMC",
    phone: "0912345678",
    status: "processing",
    type: "COD",
    detail: [ ... ],
    totalPrice: 500000,
    discountCode: "SAVE20",
    discountAmount: 100000,
    finalTotal: 400000,
    createdAt: "2025-11-20T10:00:00Z",
    updatedAt: "2025-11-22T10:30:00Z"
  }
}
```

**Gap Analysis:**
- No `status` field in Order model
- No `discountCode` field in Order model
- No `discountAmount` field in Order model
- No `finalTotal` field in Order model
- No PUT endpoint implementation
- No authorization check logic
- No status validation logic

---

## 3. PARTIAL IMPLEMENTATIONS

**Status:** None - All critical endpoints are completely missing.

---

## 4. RESPONSE FORMAT MISMATCHES

### Format: Discount Type String Conversion

**Backend Response (from guide):**
```json
{
  "discountType": "percentage" | "fixed"
}
```

**Frontend Redux Storage:**
```javascript
{
  discountType: "PERCENT" | "AMOUNT"
}
```

**Conversion in Frontend:**
```javascript
discountType: res.data.discountType === 'percentage' ? 'PERCENT' : 'AMOUNT'
```

**Issue:** Frontend expects `percentage`/`fixed` from backend, converts to `PERCENT`/`AMOUNT` for internal storage. This is correctly handled but backend must return lowercase: `'percentage'` or `'fixed'`.

---

## 5. AUTHORIZATION & SECURITY GAPS

### Gap 5.1: Password Reset Token Security

**Required:**
- ✅ JWT token with 15-minute expiry
- ✅ Token validation on reset endpoint
- ✅ Email validation in token
- ✅ Token expiration error handling

**Missing:**
- ❌ `JWT_RESET_SECRET` environment variable
- ❌ `JWT_RESET_EXPIRE_IN` configuration
- ❌ Token verification implementation

### Gap 5.2: Order Update Authorization

**Required:**
- ✅ JWT authentication required
- ✅ Admin OR order owner check
- ✅ 403 Forbidden if unauthorized

**Missing:**
- ❌ No authorization middleware implementation
- ❌ No user role validation
- ❌ No order ownership verification

### Gap 5.3: Discount Code Security

**Required:**
- ✅ Case-insensitive code lookup
- ✅ Active status verification
- ✅ Expiry date validation
- ✅ Usage limit enforcement

**Missing:**
- ❌ No database-level constraints
- ❌ No rate limiting for validation attempts
- ❌ No logging of failed validation attempts

### Gap 5.4: Input Validation

**Frontend Validation (Present):**
- ✅ Email format validation
- ✅ Password length validation (min 6 chars)
- ✅ XSS protection (sanitizeInput)
- ✅ Phone validation (Vietnam format)

**Backend Validation (Required but Missing):**
- ❌ Server-side email format validation
- ❌ Password strength requirements
- ❌ Server-side XSS protection
- ❌ SQL injection prevention
- ❌ Input length limits
- ❌ Type validation

---

## 6. DATABASE SCHEMA REQUIREMENTS

### 6.1 User Collection (May Need Updates)

**Current Status:** Assumed to exist  
**Fields Required:**
- `_id`: ObjectId
- `email`: String (unique, required)
- `password`: String (hashed, required)
- `fullName`: String
- `phone`: String
- `role`: String (USER, ADMIN)

**Additions Needed:** None identified - but verify all fields exist

### 6.2 Discount Collection (NEW - MISSING)

**Status:** ❌ NOT CREATED

**Required Schema:**
```javascript
{
  _id: ObjectId,
  code: String,              // Unique, e.g., "SAVE20"
  description: String,       // e.g., "Save 20% on all orders"
  discountType: String,      // "percentage" | "fixed"
  discountValue: Number,     // 20 for %, 50000 for VND
  minOrderValue: Number,     // Optional, e.g., 100000
  maxUses: Number,           // e.g., 100
  currentUses: Number,       // e.g., 5 (tracks usage)
  expiryDate: Date,          // e.g., 2025-12-31
  status: String,            // "active" | "disabled"
  createdAt: Date,
  updatedAt: Date
}
```

**Indexes Recommended:**
- `code` (unique)
- `status` (for filtering)
- `expiryDate` (for expiry checks)

### 6.3 Order Collection (NEEDS UPDATES)

**Current Status:** Exists but incomplete  
**Missing Fields:**
- `status`: String (pending, processing, completed, cancelled)
- `discountCode`: String (optional)
- `discountAmount`: Number (optional)
- `finalTotal`: Number (for price after discount)

**Update Required:**
```javascript
// Add these fields to existing Order schema
{
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed', 'cancelled'],
    default: 'pending'
  },
  discountCode: {
    type: String,
    default: null
  },
  discountAmount: {
    type: Number,
    default: 0
  },
  finalTotal: {
    type: Number,
    required: true  // After discount application
  }
}
```

---

## 7. ENVIRONMENT VARIABLE REQUIREMENTS

**Missing from .env:**

```env
# JWT Reset Token Configuration
JWT_RESET_SECRET=your_unique_reset_secret_key_change_this
JWT_RESET_EXPIRE_IN=900s

# Email Service Configuration (Choose one service)
# Option 1: Gmail
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-password

# Option 2: SendGrid (alternative)
SENDGRID_API_KEY=sg_xxxxxxxxxxxxx

# Frontend URL for Reset Link
FRONTEND_URL=http://localhost:3000

# Additional Security
NODE_ENV=development
DATABASE_URL=mongodb://...
```

---

## 8. IMPLEMENTATION DEPENDENCIES & ORDER

### Dependency Chain:
```
1. Create Discount Model/Collection
   ↓
2. Implement /api/v1/discount/validate endpoint
   ├─ Uses Discount collection
   ├─ Returns discount validation
   └─ Frontend uses in Payment component
   ↓
3. Update Order Model with new fields (status, discount fields)
   ├─ status field
   ├─ discountCode field
   ├─ discountAmount field
   └─ finalTotal field
   ↓
4. Implement /api/v1/order/:id PUT endpoint
   ├─ Uses updated Order model
   ├─ Supports status update (admin only)
   ├─ Supports discount application
   └─ Frontend uses in Admin panel
   ↓
5. Setup Email Service (nodemailer/sendgrid)
   ├─ Install package
   ├─ Configure credentials
   └─ Create email templates
   ↓
6. Implement /api/v1/auth/forgot-password endpoint
   ├─ Uses JWT Reset secret from env
   ├─ Uses Email Service
   └─ Frontend uses in Forgot Password page
   ↓
7. Implement /api/v1/auth/reset-password endpoint
   ├─ Uses JWT Reset secret from env
   ├─ Validates email in token
   ├─ Updates User password
   └─ Frontend uses in Reset Password page
```

---

## 9. PRIORITY ORDER FOR IMPLEMENTATION

### Phase 1: CRITICAL (Must have for core flow)
**Priority:** IMMEDIATE

1. **Create Discount Model & Collection**
   - Effort: ~1-2 hours
   - Impact: Blocks discount feature
   - Dependencies: None

2. **Implement `/api/v1/discount/validate` endpoint**
   - Effort: ~1-2 hours
   - Impact: Required for order payment page
   - Dependencies: Discount Model

3. **Update Order Model with new fields**
   - Effort: ~30 minutes
   - Impact: Required for order status management
   - Dependencies: None

4. **Implement `/api/v1/order/:id` PUT endpoint**
   - Effort: ~2-3 hours
   - Impact: Required for admin order management
   - Dependencies: Updated Order Model

### Phase 2: IMPORTANT (Password recovery)
**Priority:** HIGH (1-2 days after Phase 1)

5. **Setup Email Service (nodemailer/sendgrid)**
   - Effort: ~1-2 hours
   - Impact: Required for password reset
   - Dependencies: None

6. **Implement `/api/v1/auth/forgot-password` endpoint**
   - Effort: ~1-2 hours
   - Impact: Required for password recovery flow
   - Dependencies: Email Service

7. **Implement `/api/v1/auth/reset-password` endpoint**
   - Effort: ~1-2 hours
   - Impact: Completes password recovery flow
   - Dependencies: None (uses same JWT setup as forgot-password)

### Phase 3: OPTIONAL (Enhancements)
**Priority:** LOW (after Phase 1 & 2 verified working)

8. **Add password reset email templates**
9. **Add order status change email notifications**
10. **Add rate limiting for forgot-password**
11. **Add audit logging for admin actions**

---

## 10. SPECIFIC CODE CHANGES NEEDED

### Change 1: Database Migration - Add Discount Collection

**File:** `backend/db/migrations/create-discount-collection.js` (NEW)

```javascript
// Create collection with schema validation
db.createCollection("discounts", {
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["code", "description", "discountType", "discountValue", "maxUses", "expiryDate", "status"],
      properties: {
        _id: { bsonType: "objectId" },
        code: { bsonType: "string", pattern: "^[A-Z0-9]{3,20}$" },
        description: { bsonType: "string" },
        discountType: { enum: ["percentage", "fixed"] },
        discountValue: { bsonType: "number", minimum: 0 },
        minOrderValue: { bsonType: "number", minimum: 0 },
        maxUses: { bsonType: "int", minimum: 1 },
        currentUses: { bsonType: "int", minimum: 0 },
        expiryDate: { bsonType: "date" },
        status: { enum: ["active", "disabled"] },
        createdAt: { bsonType: "date" },
        updatedAt: { bsonType: "date" }
      }
    }
  }
});

// Create unique index
db.discounts.createIndex({ "code": 1 }, { unique: true });
db.discounts.createIndex({ "status": 1 });
db.discounts.createIndex({ "expiryDate": 1 });
```

### Change 2: Mongoose Model - Create Discount Schema

**File:** `backend/models/discount.js` (NEW)

```javascript
const mongoose = require('mongoose');

const discountSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true,
    match: /^[A-Z0-9]{3,20}$/
  },
  description: {
    type: String,
    required: true
  },
  discountType: {
    type: String,
    required: true,
    enum: ['percentage', 'fixed']
  },
  discountValue: {
    type: Number,
    required: true,
    min: 0
  },
  minOrderValue: {
    type: Number,
    default: 0,
    min: 0
  },
  maxUses: {
    type: Number,
    required: true,
    min: 1
  },
  currentUses: {
    type: Number,
    default: 0,
    min: 0
  },
  expiryDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'disabled'],
    default: 'active'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('Discount', discountSchema);
```

### Change 3: Update Order Schema

**File:** `backend/models/order.js` (UPDATE)

```javascript
// Add to existing order schema:

status: {
  type: String,
  enum: ['pending', 'processing', 'completed', 'cancelled'],
  default: 'pending'
},
discountCode: {
  type: String,
  default: null
},
discountAmount: {
  type: Number,
  default: 0,
  min: 0
},
finalTotal: {
  type: Number,
  required: true,
  min: 0
}

// Ensure these are set during order creation:
// - totalPrice: original total before discount
// - finalTotal: total after discount (if applied)
// - discountCode: code that was applied (if any)
// - discountAmount: amount discounted (if any)
```

### Change 4: Implement Discount Validate Endpoint

**File:** `backend/routes/discount.js` (NEW)

```javascript
const express = require('express');
const Discount = require('../models/discount');
const router = express.Router();

router.post('/validate', async (req, res) => {
  try {
    const { code, orderTotal } = req.body;

    // Validation
    if (!code || !orderTotal || orderTotal <= 0) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid input",
        error: "VALIDATION_ERROR"
      });
    }

    // Find discount
    const discount = await Discount.findOne({
      code: code.toUpperCase().trim(),
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
        message: `Order total must be at least ${discount.minOrderValue} VND`,
        error: "MIN_ORDER_VALUE_NOT_MET"
      });
    }

    // Calculate discount
    let discountAmount = 0;
    if (discount.discountType === 'percentage') {
      discountAmount = Math.floor(orderTotal * (discount.discountValue / 100));
    } else if (discount.discountType === 'fixed') {
      discountAmount = Math.min(discount.discountValue, orderTotal);
    }

    const finalTotal = Math.max(0, orderTotal - discountAmount);

    logger.info(`Discount validated: ${code}, savings: ${discountAmount}`);

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
    logger.error('Discount validation error:', error);
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: "INTERNAL_ERROR"
    });
  }
});

module.exports = router;
```

### Change 5: Implement Order Update Endpoint

**File:** `backend/routes/order.js` (UPDATE - Add PUT handler)

```javascript
router.put('/order/:id', authenticateToken, async (req, res) => {
  try {
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

    // Find order
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({
        statusCode: 404,
        message: "Order not found",
        error: "NOT_FOUND"
      });
    }

    // Authorization check
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

    // Update delivery info
    if (address) order.address = address;
    if (phone) order.phone = phone;
    if (name) order.name = name;

    // Update discount
    if (discountCode) {
      const discount = await Discount.findOne({
        code: discountCode.toUpperCase(),
        status: 'active'
      });

      if (!discount) {
        return res.status(400).json({
          statusCode: 400,
          message: "Invalid discount code",
          error: "INVALID_DISCOUNT"
        });
      }

      // Calculate discount
      let discountAmount = 0;
      if (discount.discountType === 'percentage') {
        discountAmount = Math.floor(order.totalPrice * (discount.discountValue / 100));
      } else {
        discountAmount = Math.min(discount.discountValue, order.totalPrice);
      }

      order.discountCode = discountCode;
      order.discountAmount = discountAmount;
      order.finalTotal = order.totalPrice - discountAmount;

      // Increment usage
      discount.currentUses += 1;
      await discount.save();
    }

    // Save
    await order.save();

    logger.info(`Order ${id} updated by ${userId}`);

    res.status(200).json({
      statusCode: 200,
      message: "Order updated successfully",
      data: order
    });
  } catch (error) {
    logger.error('Order update error:', error);
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: "INTERNAL_ERROR"
    });
  }
});
```

### Change 6: Setup Email Service Configuration

**File:** `backend/config/email.js` (NEW)

```javascript
const nodemailer = require('nodemailer');

const emailConfig = {
  gmail: {
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  },
  sendgrid: {
    host: 'smtp.sendgrid.net',
    port: 587,
    auth: {
      user: 'apikey',
      pass: process.env.SENDGRID_API_KEY
    }
  }
};

const emailService = process.env.EMAIL_SERVICE || 'gmail';
const transporter = nodemailer.createTransport(emailConfig[emailService]);

// Verify connection
transporter.verify((error, success) => {
  if (error) {
    console.error('Email service error:', error);
  } else {
    console.log('Email service ready:', success);
  }
});

module.exports = transporter;
```

### Change 7: Implement Forgot Password Endpoint

**File:** `backend/routes/auth.js` (UPDATE - Add forgot-password)

```javascript
const jwt = require('jsonwebtoken');
const emailTransporter = require('../config/email');
const User = require('../models/user');

router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    // Validation
    if (!email) {
      return res.status(400).json({
        statusCode: 400,
        message: "Email is required",
        error: "VALIDATION_ERROR"
      });
    }

    // Check email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        statusCode: 400,
        message: "Invalid email format",
        error: "INVALID_EMAIL"
      });
    }

    // Find user
    const user = await User.findOne({ email });
    if (!user) {
      // Don't reveal if email exists (security)
      return res.status(404).json({
        statusCode: 404,
        message: "User not found",
        error: "NOT_FOUND"
      });
    }

    // Generate reset token
    const resetToken = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_RESET_SECRET,
      { expiresIn: process.env.JWT_RESET_EXPIRE_IN || '900s' }
    );

    // Create reset URL
    const resetUrl = `${process.env.FRONTEND_URL}/reset-password?email=${encodeURIComponent(email)}&token=${resetToken}`;

    // Send email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <h2>Reset Your Password</h2>
        <p>Click the link below to reset your password (valid for 15 minutes):</p>
        <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #667eea; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>Or copy this link:</p>
        <p>${resetUrl}</p>
        <p>If you didn't request this, ignore this email.</p>
      `
    };

    await emailTransporter.sendMail(mailOptions);

    logger.info(`Password reset email sent for: ${email}`);

    res.status(200).json({
      statusCode: 200,
      message: "Password reset email sent successfully",
      data: {
        email,
        resetTokenSent: true,
        expiresIn: "15 minutes"
      }
    });
  } catch (error) {
    logger.error('Forgot password error:', error);
    res.status(500).json({
      statusCode: 500,
      message: "Failed to send reset email",
      error: "INTERNAL_SERVER_ERROR"
    });
  }
});
```

### Change 8: Implement Reset Password Endpoint

**File:** `backend/routes/auth.js` (UPDATE - Add reset-password)

```javascript
const bcrypt = require('bcryptjs');

router.post('/reset-password', async (req, res) => {
  try {
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

    // Verify token
    let decoded;
    try {
      decoded = jwt.verify(resetToken, process.env.JWT_RESET_SECRET);
    } catch (tokenError) {
      if (tokenError.name === 'TokenExpiredError') {
        return res.status(400).json({
          statusCode: 400,
          message: "Reset token has expired",
          error: "TOKEN_EXPIRED"
        });
      }
      return res.status(400).json({
        statusCode: 400,
        message: "Reset token is invalid",
        error: "INVALID_TOKEN"
      });
    }

    // Check email matches
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
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);
    await user.save();

    logger.info(`Password reset successful for: ${email}`);

    res.status(200).json({
      statusCode: 200,
      message: "Password reset successfully",
      data: {
        email: user.email,
        resetAt: new Date().toISOString()
      }
    });
  } catch (error) {
    logger.error('Reset password error:', error);
    res.status(500).json({
      statusCode: 500,
      message: "Internal server error",
      error: "INTERNAL_ERROR"
    });
  }
});
```

### Change 9: Update .env Configuration

**File:** `.env` (UPDATE - Add missing variables)

```env
# Existing variables...
DATABASE_URL=mongodb://...
JWT_SECRET=your_main_jwt_secret
PORT=8080

# NEW: Password Reset Configuration
JWT_RESET_SECRET=your_unique_reset_secret_key_minimum_32_chars
JWT_RESET_EXPIRE_IN=900s

# NEW: Email Service Configuration
# Choose one email service and update accordingly
EMAIL_SERVICE=gmail
EMAIL_USER=your-email@gmail.com
EMAIL_PASSWORD=your-app-specific-password

# Alternative: SendGrid
# EMAIL_SERVICE=sendgrid
# SENDGRID_API_KEY=sg_your_api_key

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
VITE_BACKEND_URL=http://localhost:8080

# Environment
NODE_ENV=development
```

---

## 11. TESTING CHECKLIST

### Unit Tests Needed:

- [ ] Discount validation logic (valid code, expired, max uses)
- [ ] Password reset token generation and verification
- [ ] Order status validation
- [ ] Authorization checks (admin vs owner)
- [ ] Discount amount calculation (percentage vs fixed)

### Integration Tests Needed:

- [ ] Forgot-password endpoint → Email sent → Token valid
- [ ] Reset-password endpoint → Token verified → Password updated
- [ ] Discount-validate → Code applied to order → finalTotal correct
- [ ] Order update → Status changed → Order saved correctly
- [ ] Order with discount → Discount applied → finalTotal matches

### Manual Tests (cURL):

```bash
# Test Forgot Password
curl -X POST http://localhost:8080/api/v1/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'

# Test Reset Password (use token from email)
curl -X POST http://localhost:8080/api/v1/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{
    "email":"user@example.com",
    "resetToken":"JWT_TOKEN_FROM_EMAIL",
    "newPassword":"NewPass123",
    "confirmPassword":"NewPass123"
  }'

# Test Discount Validation
curl -X POST http://localhost:8080/api/v1/discount/validate \
  -H "Content-Type: application/json" \
  -d '{"code":"SAVE20","orderTotal":500000}'

# Test Update Order Status (with auth token)
curl -X PUT http://localhost:8080/api/v1/order/ORDER_ID \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer JWT_TOKEN" \
  -d '{"status":"processing"}'
```

---

## 12. FRONTEND-BACKEND ALIGNMENT

### Frontend Expectations Met:

| Feature | Frontend Call | Backend Required | Status |
|---------|---------------|------------------|--------|
| Forgot Password | `callForgotPassword(email)` | POST `/api/v1/auth/forgot-password` | ❌ MISSING |
| Reset Password | `callResetPassword(email, token, pass)` | POST `/api/v1/auth/reset-password` | ❌ MISSING |
| Validate Discount | `callValidateDiscountCode(code, total)` | POST `/api/v1/discount/validate` | ❌ MISSING |
| Update Order Status | `callUpdateOrderStatus(id, status)` | PUT `/api/v1/order/:id` | ❌ MISSING |

### Response Format Alignment:

All response formats are correctly documented and frontend is prepared to handle them. Frontend also has fallback mock APIs for all 4 endpoints.

---

## 13. CRITICAL BLOCKERS

1. ❌ **All 4 endpoints completely missing** - Frontend currently uses mock APIs
2. ❌ **Discount model not created** - Cannot validate discount codes
3. ❌ **Order model incomplete** - Cannot track order status
4. ❌ **Email service not configured** - Cannot send password reset emails
5. ❌ **JWT reset secret not configured** - Cannot generate reset tokens

---

## 14. SUMMARY & RECOMMENDATIONS

### What's Correctly Implemented:
- **NOTHING** - All 4 critical endpoints are missing

### What's Partially Implemented:
- **NOTHING** - All endpoints must be implemented from scratch

### What Needs to Be Added/Fixed:
- **CRITICAL:** Implement all 4 missing endpoints
- **CRITICAL:** Create Discount collection/model
- **CRITICAL:** Update Order model with new fields
- **CRITICAL:** Setup email service
- **CRITICAL:** Configure JWT reset token secrets

### Implementation Timeline:
- **Phase 1 (Discount & Order):** 4-6 hours
- **Phase 2 (Email & Password Reset):** 4-6 hours
- **Phase 3 (Testing):** 2-3 hours
- **Total Estimated:** 10-15 hours

### Risk Level: **CRITICAL**
Without these implementations, the following features are non-functional:
- ✗ Discount code validation and application
- ✗ Order status tracking and management
- ✗ Password reset functionality
- ✗ Admin order management panel

---

## 15. NEXT STEPS

1. **Immediate:** Review this analysis with backend team
2. **Week 1:** Implement Phase 1 (Discount + Order endpoints)
3. **Week 1:** Setup email service and implement Phase 2 (Password reset)
4. **Week 1:** Remove mock API fallbacks once endpoints verified working
5. **Week 2:** Performance testing and optimization

---

**Analysis Completed:** November 22, 2025  
**Report Generated For:** BookStore Project Team  
**Confidence Level:** HIGH - Based on direct code inspection
