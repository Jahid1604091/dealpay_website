import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    paymentInfo: typeof sessionStorage != 'undefined' && (sessionStorage.getItem('paymentInfo') ? JSON.parse(sessionStorage.getItem('paymentInfo')) : null),
}

const accountSlice = createSlice({
    name: 'account',
    initialState,
    reducers: {
        setPaymentInfo: (state, action) => {
            state.paymentInfo = action.payload;
            typeof sessionStorage != 'undefined' && sessionStorage.setItem('paymentInfo', JSON.stringify(action.payload));
        },
    }
});

export const {
   setPaymentInfo

} = accountSlice.actions;

export default accountSlice.reducer;