import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "./globals.css";
import { SessionWrapper } from "@/components/auth/SessionWrapper";
import { Toaster } from 'sonner';

export const metadata = {
  title: "Kick-Off Squad",
  description: "Kick off your football team with Kick Off Squad",
};

export default function RootLayout({ children }) {
  return (
    <SessionWrapper>
      <html lang="en">
        <body
          className="antialiased"
        >
          <Navbar />
          {children}
          <Footer />
          <Toaster position="bottom-center" richColors />
        </body>
      </html>
    </SessionWrapper>
  );
}
