import { createSlice } from "@reduxjs/toolkit";
import i18next from "i18next";

const initialState = {
    preRegID: typeof localStorage != 'undefined' && (localStorage.getItem('preRegId') ? JSON.parse(localStorage.getItem('preRegId')) : null),
    isOTPSent: typeof localStorage != 'undefined' && (localStorage.getItem('isOTPSent') ? JSON.parse(localStorage.getItem('isOTPSent')) : false),
    isOTPVerified: typeof localStorage != 'undefined' && (localStorage.getItem('isOTPVerified') ? JSON.parse(localStorage.getItem('isOTPVerified')) : false),
    verifiedUserInfo: typeof localStorage != 'undefined' && (localStorage.getItem('verifiedUserInfo') ? JSON.parse(localStorage.getItem('verifiedUserInfo')) : null),
    info: typeof localStorage != 'undefined' && (localStorage.getItem('info') ? JSON.parse(localStorage.getItem('info')) : null),
    subscriptionInfo: typeof localStorage != 'undefined' && (localStorage.getItem('subscriptionInfo') ? JSON.parse(localStorage.getItem('subscriptionInfo')) : null),
    email: typeof localStorage != 'undefined' && (localStorage.getItem('email') ? JSON.parse(localStorage.getItem('email')) : null),
    countryId: typeof localStorage != 'undefined' && (localStorage.getItem('countryId') ? JSON.parse(localStorage.getItem('countryId')) : null),
    loggedInUserInfo: typeof sessionStorage != 'undefined' && (sessionStorage.getItem('loggedInUserInfo') ? JSON.parse(sessionStorage.getItem('loggedInUserInfo')) : null),
    step: typeof localStorage != 'undefined' && (localStorage.getItem('step') ? JSON.parse(localStorage.getItem('step')) : 1),
    renewSubscriptionInfo: typeof localStorage != 'undefined' && (localStorage.getItem('subscriptionInfo') ? JSON.parse(localStorage.getItem('subscriptionInfo')) : null),
    lang:typeof localStorage != 'undefined' && localStorage.getItem('lang') ? JSON.parse(localStorage.getItem('lang')) : typeof document !== 'undefined' && (document.cookie.split('=')[1])?.toUpperCase() , 
    isOTPSentToReset: typeof sessionStorage != 'undefined' && (sessionStorage.getItem('isOTPSentToReset') ? JSON.parse(sessionStorage.getItem('isOTPSentToReset')) : false),
    passResetToken: typeof sessionStorage != 'undefined' && (sessionStorage.getItem('passResetToken') ? JSON.parse(sessionStorage.getItem('passResetToken')) : null),
}

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setPreRegID: (state, action) => {
            state.preRegID = action.payload;
            typeof localStorage != 'undefined' && localStorage.setItem('preRegId', JSON.stringify(action.payload));
        },
        setIsOTPVerified: (state, action) => {
            state.isOTPVerified = action.payload;
            typeof localStorage != 'undefined' && localStorage.setItem('isOTPVerified', JSON.stringify(action.payload));
        },
        setIsOTPSent: (state, action) => {
            state.isOTPSent = action.payload;
            typeof localStorage != 'undefined' && localStorage.setItem('isOTPSent', JSON.stringify(action.payload));
        },

        setInfo: (state, action) => {
            state.info = action.payload;
            typeof localStorage != 'undefined' && localStorage.setItem('info', JSON.stringify(action.payload));
        },

        setSubscriptionInfo: (state, action) => {
            state.subscriptionInfo = action.payload;
            typeof localStorage != 'undefined' && localStorage.setItem('subscriptionInfo', JSON.stringify(action.payload));
        },

        setRenewSubscriptionInfo: (state, action) => {
            state.renewSubscriptionInfo = action.payload;
            typeof localStorage != 'undefined' && localStorage.setItem('renewSubscriptionInfo', JSON.stringify(action.payload));
        },

        setEmailState: (state, action) => {
            state.email = action.payload;
            typeof localStorage != 'undefined' && localStorage.setItem('email', JSON.stringify(action.payload));
        },
        setCountryId: (state, action) => {
            state.countryId = action.payload;
            typeof localStorage != 'undefined' && localStorage.setItem('countryId', JSON.stringify(action.payload));
        },
        setUserInfo: (state, action) => {
            state.loggedInUserInfo = action.payload;
            typeof sessionStorage != 'undefined' && sessionStorage.setItem('loggedInUserInfo', JSON.stringify(action.payload));
        },
        setStep: (state, action) => {
            state.step = action.payload;
            typeof localStorage != 'undefined' && localStorage.setItem('step', JSON.stringify(action.payload));
        },

        setVerifiedUserInfo: (state, action) => {
            state.verifiedUserInfo = action.payload;
            typeof localStorage != 'undefined' && localStorage.setItem('verifiedUserInfo', JSON.stringify(action.payload));
        },

        setLoggedInUserInfo: (state, action) => {
            state.loggedInUserInfo = action.payload;
            typeof sessionStorage != 'undefined' && sessionStorage.setItem('loggedInUserInfo', JSON.stringify(action.payload));
        },

        setLang: (state, action) => {
            // state.lang = action.payload;
            typeof localStorage != 'undefined' && localStorage.setItem('lang', JSON.stringify(action.payload));
            i18next.changeLanguage(typeof localStorage != 'undefined' && localStorage.getItem('lang') ? JSON.parse(localStorage.getItem('lang')) :action.payload)
        },

        setIsOTPSentToReset: (state, action) => {
            state.isOTPSentToReset = action.payload;
            typeof sessionStorage != 'undefined' && sessionStorage.setItem('isOTPSentToReset', JSON.stringify(action.payload));
        },

        setPassResetToken: (state, action) => {
            state.passResetToken = action.payload;
            typeof sessionStorage != 'undefined' && sessionStorage.setItem('passResetToken', JSON.stringify(action.payload));
        },


        setClearState: (state, action) => {
            if (typeof localStorage != 'undefined') {
                localStorage.removeItem('preRegId');
                localStorage.removeItem('isOTPVerified');
                localStorage.removeItem('isOTPSent');
                localStorage.removeItem('info');
                localStorage.removeItem('subscriptionInfo');
                localStorage.removeItem('countryId');
                localStorage.removeItem('step');
            }
        },

        setClearUserInfo: (state, action) => {
            state.loggedInUserInfo = null
            state.verifiedUserInfo = null
            typeof sessionStorage != 'undefined' && sessionStorage.clear();
            typeof localStorage != 'undefined' && localStorage.clear();
        },

        setTempLogout : (state, action) => {
            state.loggedInUserInfo = null
            typeof sessionStorage != 'undefined' && sessionStorage.clear();
        },

    }
});

export const {
    setPreRegID,
    setIsOTPVerified,
    setIsOTPSent,
    setInfo,
    setSubscriptionInfo,
    setEmailState,
    setClearState,
    setUserInfo,
    setClearUserInfo,
    setCountryId,
    setStep,
    setVerifiedUserInfo,
    setLoggedInUserInfo,
    setRenewSubscriptionInfo,
    setLang,
    setIsOTPSentToReset,
    setPassResetToken,
    setTempLogout

} = authSlice.actions;

export default authSlice.reducer;