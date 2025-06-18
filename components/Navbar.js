"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import Image from "next/image";
import {
  AiOutlineShoppingCart,
  AiOutlineClear,
  AiOutlineClose,
} from "react-icons/ai";
import { FaMinusCircle, FaPlusCircle } from "react-icons/fa";
// import { toast } from "react-toastify"; // Optional: Uncomment if using

const Navbar = ({
  cart,
  addToCart,
  removeFromCart,
  clearCart,
  subTotal,
  isCartOpen,
  setIsCartOpen,
}) => {
  const router = useRouter();

  const toggleCart = () => {
    setIsCartOpen(!isCartOpen);
  };

  // Prevent body scroll when cart is open
  useEffect(() => {
    document.body.style.overflow = isCartOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCartOpen]);

  return (
    <header className="text-gray-600 body-font shadow-md sticky top-0 bg-white z-50">
      <div className="container mx-auto flex flex-wrap p-5 flex-row items-center justify-between">
        <Link href="/" className="flex title-font font-medium items-center text-gray-900">
          <Image src="/logo.png" alt="logo" width={40} height={40} className="mr-2" />
          <span className="text-xl">Clothsy</span>
        </Link>

        <nav className="md:ml-auto flex flex-wrap items-center text-base justify-center gap-4">
          <Link href="/tshirts" className="hover:text-gray-900">Tshirts</Link>
          <Link href="/hoodies" className="hover:text-gray-900">Hoodies</Link>
          <Link href="/mugs" className="hover:text-gray-900">Mugs</Link>
          <Link href="/stickers" className="hover:text-gray-900">Stickers</Link>
        </nav>

        <div className="relative">
          <button
            onClick={toggleCart}
            aria-label="Toggle Cart"
            className="text-2xl text-gray-700 hover:text-black"
          >
            <AiOutlineShoppingCart />
          </button>
        </div>
      </div>

      {/* Cart Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-80 bg-gray-100 p-6 shadow-2xl transform transition-transform duration-300 z-50 ${
          isCartOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Shopping Cart</h2>
          <button onClick={toggleCart} aria-label="Close Cart">
            <AiOutlineClose className="text-2xl hover:text-red-500" />
          </button>
        </div>

        <ol className="list-decimal font-semibold text-sm">
          {Object.keys(cart).length === 0 && (
            <p className="text-gray-600">Your cart is empty!</p>
          )}

          {Object.keys(cart).map((k) => {
            const item = cart[k];
            return (
              <li key={k} className="my-3">
                <div className="flex justify-between items-center">
                  <div className="w-2/3">
                    {item.title} ({item.size}/{item.variant})
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMinusCircle
                      onClick={() => removeFromCart(k, 1)}
                      className="cursor-pointer text-blue-500"
                      aria-label="Decrease quantity"
                    />
                    <span>{item.qty}</span>
                    <FaPlusCircle
                      onClick={() =>
                        addToCart(k, 1, item.price, item.title, item.size, item.variant)
                      }
                      className="cursor-pointer text-blue-500"
                      aria-label="Increase quantity"
                    />
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="mt-4 font-semibold">
          Subtotal: ₹{subTotal}
        </div>

        <div className="mt-4 flex gap-3">
          <Link href="/checkout" passHref legacyBehavior>
            <a onClick={toggleCart}>
              <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded w-full">
                Checkout
              </button>
            </a>
          </Link>
          <button
            onClick={() => {
              clearCart();
              // toast.success("Cart cleared!"); // Optional: Toast
            }}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded w-full flex items-center justify-center gap-2"
          >
            <AiOutlineClear />
            Clear
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
