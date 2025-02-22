import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Inter } from "next/font/google";
import { GoogleOAuthProvider } from '@react-oauth/google';
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import toast, { Toaster } from 'react-hot-toast';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'


const inter = Inter({ subsets: ["latin"] });

const queryClient = new QueryClient()


export default function App({ Component, pageProps }: AppProps) {
  return (
  <div className="className={inter.className}">
    <QueryClientProvider client = {queryClient}> 
    <GoogleOAuthProvider clientId="890824179946-nq4i6kkjbi58q124tnm71avk8o78b7aj.apps.googleusercontent.com">
      <Component {...pageProps} />
      <Toaster />
      <ReactQueryDevtools />
    </GoogleOAuthProvider>
    </QueryClientProvider>
  </div>
  );
}
