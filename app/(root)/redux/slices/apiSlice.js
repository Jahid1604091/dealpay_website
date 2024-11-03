import { BASE_URL } from '@/app/utils/constants'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

const baseQuery = fetchBaseQuery({
    baseUrl: BASE_URL,
     prepareHeaders: (headers, { getState }) => {
        const state = getState() 
        const { loggedInUserInfo } = state.auth;
        if (loggedInUserInfo) {
            headers.set('token', `${loggedInUserInfo.access_token}`);
        }
        // headers.set('Content-Type', 'application/json');
        return headers;
    },
})
export const apiSlice = createApi({
    baseQuery,
    tagTypes: ['Users', 'Transactions', 'FavContacts', 'Accounts'],
    endpoints: (builder) => ({})
})