// pages/_app.js
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/app/globals.css"; // or your correct global path

export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <Navbar />
      <Component {...pageProps} />
      <Footer />
    </>
  );
}
