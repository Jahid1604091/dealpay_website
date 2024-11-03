import { apiSlice } from "./apiSlice";

export const authApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        preRegEmail: builder.mutation({
            query: (data) => ({
                url: '/preregistration',
                method: "POST",
                body: data
            })
        }),

        verifyOtp: builder.mutation({
            query: (data) => ({
                url: '/preregistration/otpchecker',
                method: "PUT",
                body: data
            })
        }),

        getAllAccounts: builder.query({
            query: () => ({
                url: '/accounts/deal-pay-asia',
            }),
            keepUnusedDataFor: 5
        }),

        getSingleAccount: builder.query({
            query: ({ userId, token }) => ({
                url: `/accounts/${userId}`,
                headers: {
                    "token": token
                }
            }),
            keepUnusedDataFor: 5
        }),

        subscriptionViaMfs: builder.mutation({
            query: ({ data, preRegID }) => ({
                url: '/subscription-payment',
                method: "POST",
                body: data,
                headers: {
                    "prereg-id": preRegID
                }
            }),
        }),

        subscriptionRenew: builder.mutation({
            query: ({ data, userId }) => ({
                url: '/subscription/renew',
                method: "POST",
                body: data,
                headers: {
                    "user-id": userId
                }
            }),
        }),

        getSubscriptionValidity: builder.query({
            query: (token) => ({
                url: `/subscription/s/validity`,
                headers: {
                    "token": token
                }
            }),
            keepUnusedDataFor: 5
        }),

        login: builder.mutation({
            query: (data) => ({
                url: '/login',
                method: "POST",
                body: data,
            }),
        }),

        loginWOOtp: builder.mutation({
            query: ({ data, token }) => ({
                url: '/login/withoutotp',
                method: "POST",
                body: data,
                headers: {
                    "token": token
                }
            }),
        }),

        regViaPassport: builder.mutation({
            query: ({ data, userId, accType }) => ({
                url: '/signup',
                method: "POST",
                body: data,
                headers: {
                    "user-id": userId,
                    "acc-type": accType
                }
            }),
        }),

        verifyLoginOtp: builder.mutation({
            query: (data) => ({
                url: '/login/otp',
                method: "POST",
                body: data
            })
        }),

        getAllCountries: builder.query({
            query: (token = '') => ({
                url: '/country',
                headers: {
                    "token": token
                }
            }),
            keepUnusedDataFor: 5
        }),


        getAllSubscriptions: builder.query({
            query: (countryId) => ({
                url: `/subscription?countryId=${countryId}`,
            }),
            keepUnusedDataFor: 5
        }),

        getSingleSubscriptions: builder.query({
            query: (id) => ({
                url: `/subscription/${id}`,
            }),
            keepUnusedDataFor: 5
        }),

        getAllCurrencies: builder.query({
            query: (token) => ({
                url: '/currency',
                headers: {
                    "token": token
                }
            }),
            keepUnusedDataFor: 5
        }),
        swapCurrency: builder.query({
            query: (token) => ({
                url: '/users/swap-currency',
                headers: {
                    "token": token
                }
            }),
            keepUnusedDataFor: 5
        }),

        getSingleCurrency: builder.query({
            query: (id, token) => ({
                url: `/currency/${id}`,
                headers: {
                    "token": token
                }
            }),
            keepUnusedDataFor: 5
        }),

        getSingleUser: builder.query({
            query: (id, token) => ({
                url: `/users/${id}`,
                headers: {
                    "token": token
                }
            }),
            keepUnusedDataFor: 5
        }),


        resetPin: builder.query({
            query: (email) => ({
                url: `/forgot-password/${email}`,
            }),
        }),

        verifyOtpAndReset: builder.mutation({
            query: ({ data, otp, passResetToken }) => ({
                url: `/forgot-password/${otp}`,
                method: "POST",
                body: data,
                headers: {
                    "passwordresettoken": passResetToken
                }
            })
        }),

        updateUser: builder.mutation({
            query: ({ data, token }) => ({
                url: '/users/update',
                method: "POST",
                body: data,
                headers: {
                    "token": token
                }
            })
        }),

        updateUserInfo: builder.mutation({
            query: ({ data, token }) => ({
                url: '/users/update/info',
                method: "POST",
                body: data,
                headers: {
                    "token": token
                }
            })
        }),

    })
})

export const {
    usePreRegEmailMutation,
    useVerifyOtpMutation,
    useGetAllAccountsQuery,
    useGetSingleAccountQuery,
    useSubscriptionViaMfsMutation,
    useLoginMutation,
    useLoginWOOtpMutation,
    useRegViaPassportMutation,
    useVerifyLoginOtpMutation,
    useGetAllCountriesQuery,
    useGetAllSubscriptionsQuery,
    useGetSingleSubscriptionsQuery,
    useGetAllCurrenciesQuery,
    useGetSingleUserQuery,
    useSubscriptionRenewMutation,
    useGetSubscriptionValidityQuery,
    useLazyResetPinQuery,
    useVerifyOtpAndResetMutation,
    useLazySwapCurrencyQuery,
    useGetSingleCurrencyQuery,
    useUpdateUserMutation,
    useUpdateUserInfoMutation,
} = authApiSlice;