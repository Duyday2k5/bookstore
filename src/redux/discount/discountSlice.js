import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    code: '',
    discount: 0,
    discountType: 'PERCENT', // PERCENT hoặc AMOUNT
    isApplied: false,
    message: ''
};

export const discountSlice = createSlice({
    name: 'discount',
    initialState,
    reducers: {
        doApplyDiscount: (state, action) => {
            state.code = action.payload.code;
            state.discount = action.payload.discount;
            state.discountType = action.payload.discountType || 'PERCENT';
            state.isApplied = true;
            state.message = action.payload.message || 'Áp dụng mã giảm giá thành công!';
        },
        doRemoveDiscount: (state) => {
            state.code = '';
            state.discount = 0;
            state.discountType = 'PERCENT';
            state.isApplied = false;
            state.message = '';
        },
        doSetDiscountMessage: (state, action) => {
            state.message = action.payload;
        }
    }
});

export const {
    doApplyDiscount,
    doRemoveDiscount,
    doSetDiscountMessage
} = discountSlice.actions;

export default discountSlice.reducer;
