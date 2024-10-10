import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "./globals.css";
import { SessionWrapper } from "@/components/auth/SessionWrapper";
import { ThemeProvider } from "@/components/theme-provider";
import { SWRProvider } from "@/components/SWRProvider";
import { Toaster } from 'sonner';

export const metadata = {
  title: "Kick-Off Squad",
  description: "Kick off your football team with Kick Off Squad",
};

export default function RootLayout({ children }) {
  return (
    <SessionWrapper>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased">
          <SWRProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="light"
              disableTransitionOnChange
            >
              <Navbar />
              {children}
              <Footer />
              <Toaster position="top-center" richColors closeButton />
            </ThemeProvider>
          </SWRProvider>
        </body>
      </html>
    </SessionWrapper>
  );
}
