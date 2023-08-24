import { ClerkProvider } from "@clerk/nextjs";
import type { AppProps } from "next/app";
import { api } from "~/utils/api";
import "~/styles/globals.css";
import Navbar from "~/components/NavBar";

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <ClerkProvider {...pageProps}>
      <Navbar />
      <Component {...pageProps} className="h-screen bg-stitched-black" />
    </ClerkProvider>
  );
}

export default api.withTRPC(MyApp);
