import Navbar from "@/components/navbar";
import Footer from "@/components/footer";
import "./globals.css";

export const metadata = {
  title: "Kick Off Squad",
  description: "Kick off your football team with Kick Off Squad",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className="antialiased"
      >
        <Navbar />
        {children}
        <Footer />
      </body>
    </html>
  );
}
