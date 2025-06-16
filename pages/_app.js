// pages/_app.js
"use client"
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "@/app/globals.css";
import { useEffect, useState } from "react";
import Head from "next/head";


export default function MyApp({ Component, pageProps }) {
  const [cart, setCart] = useState({});
  const [subTotal, setSubTotal] = useState(0);
  const [isCartOpen, setIsCartOpen] = useState(false);


  const saveCart = (myCart) => {
    localStorage.setItem("cart", JSON.stringify(myCart));
    let subt = 0;
    let keys = Object.keys(myCart);
    for (let i = 0; i < keys.length; i++) {
      subt += myCart[keys[i]].price * myCart[keys[i]].qty;
    }
    setSubTotal(subt);
  };

  const addToCart = (itemCode, qty, price, name, size, variant) => {
    let newCart = { ...cart };
    if (itemCode in newCart) {
      newCart[itemCode].qty += qty;
    } else {
      newCart[itemCode] = { qty: qty, price, name, size, variant };
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
        // key={subTotal}
        cart={cart}
        addToCart={addToCart}
        removeFromCart={removeFromCart}
        clearCart={clearCart}
        subTotal={subTotal}
        isCartOpen={isCartOpen}
        setIsCartOpen={setIsCartOpen}
      />

      <Component
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
