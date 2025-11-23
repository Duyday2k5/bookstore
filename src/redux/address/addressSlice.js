import { createSlice } from '@reduxjs/toolkit';
import addressesData from '../../data/addresses.json';

const initialState = {
    provinces: addressesData.provinces || [],
    districts: addressesData.districts || {},
    wards: addressesData.wards || {},
    selectedProvince: null,
    selectedDistrict: null,
    selectedWard: null,
    street: ''
};

export const addressSlice = createSlice({
    name: 'address',
    initialState,
    reducers: {
        doSetProvince: (state, action) => {
            state.selectedProvince = action.payload;
            state.selectedDistrict = null;
            state.selectedWard = null;
        },
        doSetDistrict: (state, action) => {
            state.selectedDistrict = action.payload;
            state.selectedWard = null;
        },
        doSetWard: (state, action) => {
            state.selectedWard = action.payload;
        },
        doSetStreet: (state, action) => {
            state.street = action.payload;
        },
        doResetAddress: (state) => {
            state.selectedProvince = null;
            state.selectedDistrict = null;
            state.selectedWard = null;
            state.street = '';
        }
    }
});

export const {
    doSetProvince,
    doSetDistrict,
    doSetWard,
    doSetStreet,
    doResetAddress
} = addressSlice.actions;

export default addressSlice.reducer;
