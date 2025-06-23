// pages/_app.js
"use client";

import "@/app/globals.css"; // nprogress CSS
import NProgress from "nprogress";
import Router from "next/router";

import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/app/globals.css";

export default function MyApp({ Component, pageProps }) {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const router = useRouter();

  // Setup nprogress loading bar
  useEffect(() => {
    const handleStart = () => NProgress.start();
    const handleStop = () => NProgress.done();

    Router.events.on("routeChangeStart", handleStart);
    Router.events.on("routeChangeComplete", handleStop);
    Router.events.on("routeChangeError", handleStop);

    return () => {
      Router.events.off("routeChangeStart", handleStart);
      Router.events.off("routeChangeComplete", handleStop);
      Router.events.off("routeChangeError", handleStop);
    };
  }, []);

  const saveCart = (myCart) => {
    localStorage.setItem("cart", JSON.stringify(myCart));
    let subt = 0;
    let keys = Object.keys(myCart);
    for (let i = 0; i < keys.length; i++) {
      subt += myCart[keys[i]].price * myCart[keys[i]].qty;
    }
    setSubTotal(subt);
  };

 const addToCart = (slug, qty, price, name, size, variant) => {
  const itemCode = `${slug}-${size}-${variant}`;
  let newCart = { ...cart };
  if (itemCode in newCart) {
    newCart[itemCode].qty += qty;
  } else {
    newCart[itemCode] = { qty, price, name, size, variant, slug }; // ✅ Added slug
  }
  setCart(newCart);
  saveCart(newCart);
  setIsCartOpen(true);
};


  const removeFromCart = (itemCode, qty) => {
    let newCart = JSON.parse(JSON.stringify(cart));
    if (itemCode in newCart) {
      newCart[itemCode].qty -= qty;
      if (newCart[itemCode].qty <= 0) {
        delete newCart[itemCode];
      }
    }
    setCart(newCart);
    saveCart(newCart);
  };

  const buyNow = (slug, qty, price, name, size, variant) => {
    const itemCode = `${slug}-${size}-${variant}`;
    let newCart = {
      [itemCode]: { qty, price, name, size, variant }
    };
    setCart(newCart);
    saveCart(newCart);
    router.push("/checkout");
  };

  const clearCart = () => {
    setCart({});
    saveCart({});
  };

  useEffect(() => {
    try {
      const storedCart = localStorage.getItem("cart");
      if (storedCart) {
        const parsedCart = JSON.parse(storedCart);
        setCart(parsedCart);
        saveCart(parsedCart);
      }
    } catch (error) {
      console.error("Failed to load cart from localStorage:", error);
      localStorage.clear();
    }
  }, []);

  return (
    <>
      <Head>
        <title>Clothsy – Premium Streetwear</title>
        <meta name="description" content="Shop Tshirts, Hoodies, Mugs & more at Clothsy" />
      </Head>

      <Navbar
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
      />

      <Component
        buyNow={buyNow}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
        {...pageProps}
      />

      <Footer />
    </>
  );
}
