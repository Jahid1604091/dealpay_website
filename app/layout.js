"use client";
import "./globals.css"; // globla css
//font
import { Montserrat } from 'next/font/google'

const monts = Montserrat({ subsets: ['latin'] })

// fontawesome
import "@fortawesome/fontawesome-svg-core/styles.css";
import { config } from "@fortawesome/fontawesome-svg-core";
config.autoAddCss = false;

// toastify
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import HttpApi from "i18next-http-backend";

import { Provider } from "react-redux";
import store from "@/app/(root)/redux/store";
import { BASE_URL } from "./utils/constants";

const initLanguage = typeof localStorage !== 'undefined' && localStorage.getItem('lang')
    ? JSON.parse(localStorage.getItem('lang'))
    : 'english';

i18n
    .use(initReactI18next)
    .use(LanguageDetector)
    .use(HttpApi) // Use the HttpApi backend
    .init({
        supportedLngs: ["bangla", "english"], // Define supported languages
        fallbackLng: initLanguage, // Set the fallback language
        lng: initLanguage, // Default language
        detection: {
            order: [
                "localStorage",
                "cookie",
                "htmlTag",
                "sessionStorage",
                "path",
                "subdomain",
            ],
            caches: ["localStorage","cookie"], // Caches the detected language in cookies
        },
        backend: {
            loadPath: `${BASE_URL}/language/{{lng}}`, // Dynamic URL for fetching translations
            parse: (data) => {
              const parsedData = JSON.parse(data); // Parse the JSON response
              if (parsedData.success && parsedData.data) {
                return parsedData.data; // Return only the 'data' object containing translations
              }
            //   console.error('Invalid translation response:', data); // Log if unexpected structure
              return {}; // Return empty object if structure is invalid
            },
          },
        debug: true, // Optional: Enables debug mode to log messages in the console
    });

export default function BaseLayout({ children }) {

    return (
        <html lang="en">
            <body className={monts.className}>
                <ToastContainer />
                <Provider store={store}>
                    {children}
                </Provider>
            </body>
        </html>
    );
}
