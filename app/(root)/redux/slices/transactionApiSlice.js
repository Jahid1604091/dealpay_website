import { apiSlice } from "./apiSlice";


export const transactionApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({

    getAllTransaction: builder.query({
      query: () => ({
        url: `/transaction/all`,
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Transactions"],
    }),

    getUserWiseTransaction: builder.query({
      query: (token) => ({
        url: `/transaction/user-transactions`,
        headers:{
          "token":token
        }
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Transactions"],
    }),
    
    transactionApproval: builder.mutation({
      query: ({ status, id,token }) => ({
        url: `/transaction/${status}/${id}`,
        method: "POST",
        headers:{
          "token":token
        }
      }),
      invalidatesTags: ["Transactions"],
    }),
    
    getTransactionAmount: builder.query({
      query: ({token,type='t'}) => ({
        url: `/transaction/life-time-amount/user-transactions/${type}`,
        headers:{
          "token":token
        }
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Transactions"],
    }),
    
    getTransactionBySystmeId: builder.query({
      query: ({token,systemId}) => ({
        url: `/transaction/user-transaction/system/${systemId}`,
        headers:{
          "token":token
        }
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Transactions"],
    }),
    
    getTransactionByUser: builder.query({
      query: ({token,skip,limit,fromDate='08/29/2024',toDate='09/29/2024',trxType='',sheetType,currency}) => ({
        url: `/transaction/user-transactions?skip=${skip}&limit=${limit}&fromDate=${fromDate}&toDate=${toDate}&purpose=${sheetType}&currency=${currency}`,
        headers:{
          "token":token
        }
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Transactions"],
    }),
    
    
    downloadTransactionSheet: builder.query({
      query: ({token,skip,limit,fromDate='08/29/2024',toDate='09/29/2024',trxType='',sheetType,currency}) => ({
        url: `/transaction/download/user-transactions?skip=${skip}&limit=${limit}&fromDate=${fromDate}&toDate=${toDate}&purpose=${sheetType}&currency=${currency}`,
        headers:{
          "token":token
        }
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Transactions"],
    }),
    
    getRecentTransactions: builder.query({
      query: (token) => ({
        url: `/transaction/recent`,
        headers:{
          "token":token
        }
      }),
      keepUnusedDataFor: 5,
      providesTags: ["Transactions"],
    }),

  }),
});

export const {
  useGetAllTransactionQuery,
  useGetUserWiseTransactionQuery,
  useTransactionApprovalMutation,
  useLazyGetTransactionAmountQuery,
  useLazyGetTransactionBySystmeIdQuery,
  useGetTransactionByUserQuery,
  useGetRecentTransactionsQuery,
  useLazyDownloadTransactionSheetQuery,
} = transactionApiSlice;
