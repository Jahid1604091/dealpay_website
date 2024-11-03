import { BellRing, BookA, BookmarkMinus, BookUser, CreditCard, Gauge, Gift, Globe2, Handshake, LockKeyhole, LogOut, MessageSquareWarning, NotebookTabs, Settings, StickyNote } from "lucide-react";


const dashboardMenu = [
    {
        id: 1,
        text: 'dashboard',
        icon: <Gauge/>,
        url: '/dashboard'
    },
    {
        id: 2,
        text: 'notifications',
        icon: <BellRing/>,
        url: '/dashboard/notifications'
    },

    {
        id: 3,
        text: 'transactions',
        icon: <BookmarkMinus/>,
        url: '/dashboard/transactions'
    },

    {
        id: 4,
        text: 'offers',
        icon: <Gift/>,
        url: '/dashboard/offers'
    },

    {
        id: 5,
        text: 'partners',
        icon: <Handshake/>,
        url: '/dashboard/partners'
    },

    {
        id: 6,
        text: 'featured',
        icon: <StickyNote/>,
        url: '/dashboard/featured'
    },

    {
        id: 7,
        text: 'settings',
        icon: <Settings/>,
        url: '/dashboard/settings'
    },


]

const settingsMenu = [
    {
        id: 1,
        text: 'Account Details',
        icon: <NotebookTabs />,
        url: '/dashboard/settings/account-details'
    },
    {
        id: 2,
        text: 'Add Bank/MFS',
        icon: <CreditCard />,
        url: '/dashboard/settings/add-bank-mfs'
    },
    {
        id: 3,
        text: 'Language',
        icon: <BookA/>,
        url: '/dashboard/settings/languages'
    },
    {
        id: 4,
        text: 'Transaction Sheet',
        icon: <StickyNote/>,
        url: '/dashboard/settings/transaction-sheet'
    },
    {
        id: 5,
        text: 'Country List',
        icon: <Globe2/>,
        url: '/dashboard/settings/countries'
    },
    {
        id: 6,
        text: 'Security',
        icon: <LockKeyhole/>,
        url: '/dashboard/settings/security'
    },
    {
        id: 7,
        text: 'E-KYC',
        icon: <BookUser/>,
        url: '/dashboard/settings/ekyc'
    },
    {
        id: 8,
        text: 'Alerts',
        icon: <MessageSquareWarning/>,
        url: '/dashboard/settings/alerts'
    },
    {
        id: 9,
        text: 'Logout',
        icon: <LogOut/>,
        url: '/dashboard/settings'
    },

]


export  { dashboardMenu, settingsMenu };
