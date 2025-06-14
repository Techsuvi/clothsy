"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef } from "react";
import { AiOutlineShoppingCart, AiOutlineClear } from "react-icons/ai";
import { IoMdCloseCircle } from "react-icons/io";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { RiShoppingBag4Fill } from "react-icons/ri";
import { usePathname } from "next/navigation";

const Navbar = ({
  cart,
  addToCart,
  removeFromCart,
  clearCart,
  subTotal,
  isCartOpen,
  setIsCartOpen,
}) => {
  const ref = useRef();
  const pathname = usePathname();

  // Close cart on route change
  useEffect(() => {
    setIsCartOpen(false);
  }, [pathname]);

  // Show/hide cart drawer
  useEffect(() => {
    if (ref.current) {
      if (isCartOpen) {
        ref.current.classList.remove("translate-x-full");
        ref.current.classList.add("translate-x-0");
      } else {
        ref.current.classList.remove("translate-x-0");
        ref.current.classList.add("translate-x-full");
      }
    }
  }, [isCartOpen]);

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  return (
    <>
    <div className="flex flex-col overflow-x-hidden md:flex-row md:justify-start justify-center items-center my-2 shadow-md sticky bg-white z-10 top-0">
      <div className="logo mx-5">
        <Link href="/">
          <Image
            src="/CLOTHSY.png"
            width={110}
            height={120}
            alt="Clothsy Logo"
          />
        </Link>
      </div>

      <div className="nav">
        <ul className="flex items-center space-x-6 font-bold md:text-md">
          <li>
            <Link href="/tshirts">Tshirts</Link>
          </li>
          <li>
            <Link href="/hoodies">Hoodies</Link>
          </li>
          <li>
            <Link href="/stickers">Stickers</Link>
          </li>
          <li>
            <Link href="/mugs">Mugs</Link>
          </li>
        </ul>
      </div>

      <div
        onClick={toggleCart}
        className="cart absolute right-0 mx-5 top-4 cursor-pointer"
      >
        <AiOutlineShoppingCart className="text-3xl font-bold text-blue-500 md:text-2xl" />
      </div>

      <div
        ref={ref}
        className="sideCart fixed top-0 right-0 bg-blue-100 px-8 w-82 h-full py-10 transform transition-transform translate-x-full z-50 shadow-lg"
      >
        <h2 className="font-bold text-center text-xl">Shopping Cart</h2>
        <span onClick={toggleCart} className="absolute top-5 right-4 cursor-pointer">
          <IoMdCloseCircle className="text-blue-500 text-3xl" />
        </span>

        <ol className="list-decimal font-semibold">
          {cart && Object.keys(cart).length === 0 && (
            <li className="my-5 text-base font-semibold list-none">
              Your Cart is Empty!
            </li>
          )}

          {cart &&
            Object.keys(cart).map((k) => {
              const item = cart[k];
              if (!item) return null;

              return (
                <li key={k}>
                  <div className="item flex my-3">
                    <div className="w-2/5 mx-2 font-semibold">{item.name}</div>
                    <div className="w-2/5 mx-2 font-semibold flex items-center space-x-2">
                      <FaCircleMinus
                        onClick={() =>
                          removeFromCart(
                            k,
                            1,
                            item.price,
                            item.name,
                            item.size,
                            item.variant
                          )
                        }
                        className="cursor-pointer text-blue-500 text-xl"
                      />
                      <span>{item.qty}</span>
                      <FaCirclePlus
                        onClick={() =>
                          addToCart(
                            k,
                            1,
                            item.price,
                            item.name,
                            item.size,
                            item.variant
                          )
                        }
                        className="cursor-pointer text-blue-500 text-xl"
                      />
                    </div>
                  </div>
                </li>
              );
            })}
        </ol>

        <span className="font-bold text-lg md:flex md:justify-end">
          SubTotal: ₹{subTotal}
        </span>

        <Link href="/checkout">
          <button className="flex mx-auto mt-16 text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg">
            <RiShoppingBag4Fill className="m-1" />
            Checkout
          </button>
        </Link>

        <button
          onClick={clearCart}
          className="flex mx-auto mt-4 text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg"
        >
          <AiOutlineClear className="m-1" />
          Clear Cart
        </button>
      </div>
    </div>
    </>
  );
};

export default Navbar;
