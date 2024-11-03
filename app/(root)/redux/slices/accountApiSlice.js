import { apiSlice } from "./apiSlice";

export const accountApiSlice = apiSlice.injectEndpoints({
    endpoints: (builder) => ({

        addAccount: builder.mutation({
            query: ({ data, type, token }) => ({
                url: `/account/${type}`,
                method: "POST",
                body: data,
                headers: {
                    "token": token
                }
            }),
            invalidatesTags: ['Accounts']
        }),

        getAccountToPay: builder.query({
            query: ({ email, token }) => ({
                url: `/pay/${email}`,
                headers: {
                    "token": token
                },
            }),
            keepUnusedDataFor: 5
        }),

        getAccountToPayByQR: builder.query({
            query: ({ id, token }) => ({
                url: `/pay/qr/${id}`,
                headers: {
                    "token": token
                },
            }),
            keepUnusedDataFor: 5
        }),

        getAccountsByUser: builder.query({
            query: ({userId,token}) => ({
                url: `/accounts/${userId}`,
                headers: {
                    "token": token
                },
            }),
            providesTags: ["Accounts"],
            keepUnusedDataFor: 5
        }),

        pinChecker: builder.mutation({
            query: ({data,token}) => ({
                url: `/pay/pinchecker`,
                method: "PUT",
                body: data,
                headers: {
                    "token": token
                }
            }),
        }),

        pay: builder.mutation({
            query: ({ data, userId, receiverId, payToken,token }) => ({
                url: `/pay/initiate`,
                method: "POST",
                body: data,
                headers: {
                    "user-id": userId,
                    "receiver-id": receiverId,
                    "pay-token": payToken,
                    "token": token
                }
            }),
        }),


        addFavouriteContact: builder.mutation({
            query: ({ data, token, }) => ({
                url: `/users/favourite/add`,
                method: "POST",
                body: data,
                headers: {
                    "token": token,
                }
            }),
            invalidatesTags: ['FavContacts']
        }),

        removeFavouriteContact: builder.mutation({
            query: ({ data, token, }) => ({
                url: `/users/favourite/remove`,
                method: "POST",
                body: data,
                headers: {
                    "token": token,
                }
            }),
            invalidatesTags: ['FavContacts']
        }),

        getFavouriteContact: builder.query({
            query: (token) => ({
                url: `/users/favourite`,
                headers: {
                    "token": token
                },
            }),
            keepUnusedDataFor: 5,
            providesTags: ["FavContacts"],
        }),

        getAllUsers: builder.query({
            query: (status) => ({
                url: `/users?approvedOnly=${status}`,
            }),
            providesTags: ["Users"],
            keepUnusedDataFor: 5
        }),

        editAccount: builder.mutation({
            query: ({ data, token, }) => ({
                url: `/account/edit`,
                method: "POST",
                body: data,
                headers: {
                    "token": token,
                }
            }),
            invalidatesTags: ['Accounts']
        }),


    })
})

export const {
    useAddAccountMutation,
    useGetAccountToPayQuery,
    useLazyGetAccountToPayQuery,
    useLazyGetAccountToPayByQRQuery,
    usePinCheckerMutation,
    usePayMutation,
    useGetAccountsByUserQuery,
    useAddFavouriteContactMutation,
    useRemoveFavouriteContactMutation,
    useGetFavouriteContactQuery,
    useGetAllUsersQuery,
    useEditAccountMutation,

} = accountApiSlice;