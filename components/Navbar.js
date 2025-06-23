"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { AiOutlineShoppingCart, AiOutlineClear } from "react-icons/ai";
import { IoMdCloseCircle } from "react-icons/io";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { RiShoppingBag4Fill } from "react-icons/ri";
import { MdAccountCircle } from "react-icons/md";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

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
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    setIsCartOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (ref.current) {
      if (isCartOpen) {
        ref.current.classList.remove("translate-x-full");
        ref.current.classList.add("translate-x-0");
        document.body.style.overflow = "hidden";
      } else {
        ref.current.classList.remove("translate-x-0");
        ref.current.classList.add("translate-x-full");
        document.body.style.overflow = "";
      }
    }
  }, [isCartOpen]);

  useEffect(() => {
    const checkLogin = () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
    };

    checkLogin();
    window.addEventListener("storage", checkLogin);
    window.addEventListener("visibilitychange", checkLogin);

    return () => {
      window.removeEventListener("storage", checkLogin);
      window.removeEventListener("visibilitychange", checkLogin);
    };
  }, []);

  const toggleCart = () => {
    setIsCartOpen((prev) => !prev);
  };

  const handleAddToCart = (k, item) => {
    const slug = item.slug || k.split("-")[0]; // Prefer slug from item if available
    addToCart(slug, 1, item.price, item.name, item.size, item.variant);
    toast.success("Item added to cart!", {
      position: "top-right",
      autoClose: 1500,
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast.info("Cart cleared!", {
      position: "top-right",
      autoClose: 1500,
    });
  };

  const handleLogout = async () => {
    await fetch("/api/logout");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <>
      <div className="flex flex-col md:flex-row md:justify-start justify-center items-center my-2 shadow-md sticky bg-white z-20 top-0">
        <div className="logo mx-5">
          <Link href="/">
            <Image src="/CLOTHSY.png" width={110} height={120} alt="Clothsy Logo" />
          </Link>
        </div>

        <div className="nav">
          <ul className="flex items-center space-x-6 font-bold md:text-md">
            <li><Link href="/tshirts">Tshirts</Link></li>
            <li><Link href="/hoodies">Hoodies</Link></li>
            <li><Link href="/mugs">Mugs</Link></li>
          </ul>
        </div>

        <div className="cart absolute right-0 mx-5 top-4 flex items-center gap-2">
          {/* Account Icon with Dropdown */}
          <div className="relative">
            <MdAccountCircle
              className="text-3xl text-blue-500 cursor-pointer"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            />
            {dropdownOpen && (
              <div className="absolute right-0 top-10 w-44 bg-white shadow-lg rounded z-50 overflow-hidden border">
                {isLoggedIn ? (
                  <>
                    <Link href="/myaccount">
                      <div className="px-4 py-2 hover:bg-gray-100">My Account</div>
                    </Link>
                    <Link href="/orders">
                      <div className="px-4 py-2 hover:bg-gray-100">Orders</div>
                    </Link>
                    <Link href="/support">
                      <div className="px-4 py-2 hover:bg-gray-100">App Support</div>
                    </Link>
                    <div
                      onClick={handleLogout}
                      className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer"
                    >
                      Logout
                    </div>
                  </>
                ) : (
                  <Link href="/login">
                    <div className="px-4 py-2 hover:bg-gray-100">Login</div>
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <AiOutlineShoppingCart
            onClick={toggleCart}
            className="text-3xl text-blue-500 cursor-pointer"
          />
        </div>

        {/* Slide-out Cart Drawer */}
        <div
          ref={ref}
          className="fixed top-0 right-0 h-full w-80 max-w-full transform transition-transform duration-300 translate-x-full bg-blue-100 z-50 shadow-lg flex flex-col"
        >
          <div className="flex justify-between items-center px-6 py-4 border-b border-gray-300">
            <h2 className="font-bold text-xl">Items in Cart</h2>
            <IoMdCloseCircle
              onClick={toggleCart}
              className="text-blue-500 text-3xl cursor-pointer"
            />
          </div>

          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ol className="list-decimal font-semibold">
              {cart && Object.keys(cart).length === 0 && (
                <li className="list-none text-base font-semibold">Your Cart is Empty!</li>
              )}

              {cart &&
                Object.keys(cart).map((k) => {
                  const item = cart[k];
                  if (!item || item.qty === 0) return null;

                  return (
                    <li key={k} className="mb-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="font-semibold">{item.name}</div>
                          <div className="text-sm text-gray-600">
                            ({item.size} / {item.variant})
                          </div>
                        </div>
                        <div className="text-sm font-semibold text-gray-700">
                          ₹{item.price * item.qty}
                        </div>
                      </div>

                      <div className="flex items-center gap-3 mt-2">
                        <FaCircleMinus
                          onClick={() => removeFromCart(k, 1)}
                          className="cursor-pointer text-blue-500 text-lg"
                        />
                        <span>{item.qty}</span>
                        <FaCirclePlus
                          onClick={() => handleAddToCart(k, item)}
                          className="cursor-pointer text-blue-500 text-lg"
                        />
                      </div>
                    </li>
                  );
                })}
            </ol>
          </div>

          <div className="px-6 py-4 border-t border-gray-300 bg-blue-100">
            <div className="font-bold text-lg text-right mb-2">Subtotal: ₹{subTotal}</div>

            <Link href="/checkout">
              <button className="w-full cursor-pointer flex justify-center items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mb-2">
                <RiShoppingBag4Fill className="mr-2" />
                Checkout
              </button>
            </Link>

            <button
              onClick={handleClearCart}
              className="w-full flex cursor-pointer justify-center items-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
            >
              <AiOutlineClear className="mr-2" />
              Clear Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Navbar;
