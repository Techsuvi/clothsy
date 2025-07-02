"use client";

import Image from "next/image";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import {
  AiOutlineShoppingCart,
  AiOutlineMenu,
  AiOutlineClose,
  AiOutlineSearch,
  AiOutlineHome,
} from "react-icons/ai";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { MdAccountCircle } from "react-icons/md";
import { IoMdCloseCircle } from "react-icons/io";
import { BsMoon } from "react-icons/bs";
import { usePathname, useRouter } from "next/navigation";
import { toast } from "react-toastify";

const Navbar = ({ cart, addToCart, removeFromCart, clearCart, subTotal, isCartOpen, setIsCartOpen }) => {
  const ref = useRef();
  const pathname = usePathname();
  const router = useRouter();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsCartOpen(false);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
  }, [pathname]);

  // Hide Navbar on admin pages
  const isAdminPage = pathname.startsWith("/admin");

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
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    window.addEventListener("storage", () => setIsLoggedIn(!!localStorage.getItem("token")));
  }, []);

  if (isAdminPage) return null;

  const toggleCart = () => setIsCartOpen((prev) => !prev);
  const notifyDarkMode = () => toast.info("Dark mode coming soon", { position: "top-center" });

  const handleAddToCart = (k, item) => {
    const slug = item.slug || k.split("-")[0];
    addToCart(slug, 1, item.price, item.name, item.size, item.variant);
    toast.success("Added to cart!", { position: "top-right", autoClose: 1200 });
  };

  const handleClearCart = () => {
    clearCart();
    toast.info("Cart cleared", { position: "top-right", autoClose: 1200 });
  };

  const handleLogout = async () => {
    await fetch("/api/logout");
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logged out");
    router.push("/login");
  };

  const cartItemCount = Object.values(cart).reduce((acc, item) => acc + item.qty, 0);
  const hideCartOnPaths = ["/checkout", "/User/account", "/User/orders", "/success"];
  const shouldHideCart = hideCartOnPaths.includes(pathname);

  return (
    <>
      <header className="bg-white shadow-md sticky top-0 z-20">
        <div className="container mx-auto p-4 relative flex items-center justify-center md:justify-between">
          {/* Mobile hamburger */}
          <button className="absolute left-4 md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <AiOutlineMenu className="text-2xl text-blue-500" />
          </button>

          {/* Logo */}
          <Link href="/">
            <Image src="/CLOTHSY.png" width={110} height={120} alt="Clothsy Logo" />
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex space-x-6 font-bold text-md">
              {['Home', 'Tshirts', 'Hoodies', 'Mugs', 'Mousepads', 'Caps'].map((item) => (
                <Link key={item} href={`/${item.toLowerCase()}`} className="hover:text-blue-400">
                  {item}
                </Link>
              ))}
            </nav>
            <AiOutlineSearch className="text-xl text-gray-600" />
            <BsMoon onClick={notifyDarkMode} className="text-xl text-gray-600 cursor-pointer" />
          </div>

          {/* Desktop right icons */}
          <div className="hidden md:flex items-center space-x-4">
            <div className="relative">
              <MdAccountCircle
                className="text-3xl text-blue-500 cursor-pointer"
                onClick={() => setDropdownOpen((o) => !o)}
              />
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded border overflow-hidden z-50">
                  {isLoggedIn ? (
                    <>
                      <Link href="/User/account"><div className="px-4 py-2 hover:bg-gray-100">My Account</div></Link>
                      <Link href="/User/orders"><div className="px-4 py-2 hover:bg-gray-100">Orders</div></Link>
                      <Link href="/User/contact"><div className="px-4 py-2 hover:bg-gray-100">Support</div></Link>
                      <div onClick={handleLogout} className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">Logout</div>
                    </>
                  ) : (
                    <>
                      <Link href="/login"><div className="px-4 py-2 hover:bg-gray-100">Login</div></Link>
                      <Link href="/signup"><div className="px-4 py-2 hover:bg-gray-100">Signup</div></Link>
                    </>
                  )}
                </div>
              )}
            </div>
            {!shouldHideCart && (
              <div className="relative cursor-pointer" onClick={toggleCart}>
                <AiOutlineShoppingCart className="text-3xl text-blue-500" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <>
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-30" onClick={() => setMobileMenuOpen(false)} />
            <div className="fixed top-0 left-1/2 transform -translate-x-1/2 bg-white w-[90%] max-w-sm z-40 rounded-b-xl shadow-xl animate-slide-in">
              <div className="flex justify-between items-center px-4 py-3 border-b">
                <Image src="/CLOTHSY.png" width={100} height={40} alt="Logo" />
                <AiOutlineClose className="text-2xl text-blue-500" onClick={() => setMobileMenuOpen(false)} />
              </div>
              <nav className="flex flex-col items-center px-6 py-4 gap-4 font-semibold text-lg text-gray-700">
                {['Home', 'Tshirts', 'Hoodies', 'Mugs', 'Mousepads', 'Caps'].map((item) => (
                  <Link
                    key={item}
                    href={`/${item.toLowerCase()}`}
                    onClick={() => setMobileMenuOpen(false)}
                    className="hover:text-blue-500"
                  >
                    {item}
                  </Link>
                ))}
              </nav>
            </div>
          </>
        )}
      </header>

      {/* Mobile bottom nav */}
      {!shouldHideCart && (
        <div className="fixed bottom-0 left-0 right-0 bg-white shadow-lg md:hidden flex justify-around items-center py-2 z-50">
          <Link href="/"><AiOutlineHome className="text-2xl text-blue-500" /></Link>
          <AiOutlineSearch className="text-2xl text-gray-600" />
          <BsMoon onClick={notifyDarkMode} className="text-2xl text-gray-600 cursor-pointer" />
          <div className="relative">
            <MdAccountCircle
              className="text-2xl text-blue-500 cursor-pointer"
              onClick={() => setDropdownOpen((o) => !o)}
            />
            {dropdownOpen && (
              <div className="absolute bottom-12 right-4 bg-white shadow-lg rounded border overflow-hidden z-50">
                {isLoggedIn ? (
                  <>
                    <Link href="/User/account"><div className="px-4 py-2 hover:bg-gray-100">My Account</div></Link>
                    <Link href="/User/orders"><div className="px-4 py-2 hover:bg-gray-100">Orders</div></Link>
                    <Link href="/User/contact"><div className="px-4 py-2 hover:bg-gray-100">Support</div></Link>
                    <div onClick={handleLogout} className="px-4 py-2 text-red-500 hover:bg-gray-100 cursor-pointer">Logout</div>
                  </>
                ) : (
                  <>
                    <Link href="/login"><div className="px-4 py-2 hover:bg-gray-100">Login</div></Link>
                    <Link href="/signup"><div className="px-4 py-2 hover:bg-gray-100">Signup</div></Link>
                  </>
                )}
              </div>
            )}
          </div>
          <div className="relative cursor-pointer" onClick={toggleCart}>
            <AiOutlineShoppingCart className="text-2xl text-blue-500" />
            {cartItemCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
                {cartItemCount}
              </span>
            )}
          </div>
        </div>
      )}

      {/* Slide-out cart */}
      {!shouldHideCart && (
        <div ref={ref} className="fixed top-0 right-0 h-full w-80 transform transition-transform duration-300 translate-x-full bg-blue-100 z-50 shadow-lg flex flex-col">
          <div className="flex justify-between items-center px-6 py-4 border-b">
            <h2 className="font-bold text-xl">Cart</h2>
            <IoMdCloseCircle onClick={toggleCart} className="text-blue-500 text-3xl cursor-pointer" />
          </div>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <ol className="list-decimal font-semibold">
              {Object.keys(cart).length === 0 && <li className="list-none">Your cart is empty!</li>}
              {Object.keys(cart).map((k) => {
                const item = cart[k];
                if (!item || item.qty === 0) return null;
                return (
                  <li key={k} className="mb-4">
                    <div className="flex justify-between">
                      <div>
                        <div className="font-semibold">{item.name}</div>
                        <div className="text-sm text-gray-600">({item.size} / {item.variant})</div>
                      </div>
                      <div className="font-semibold">₹{item.price * item.qty}</div>
                    </div>
                    <div className="flex items-center gap-3 mt-2">
                      <FaCircleMinus onClick={() => removeFromCart(k, 1)} className="cursor-pointer text-blue-500" />
                      <span>{item.qty}</span>
                      <FaCirclePlus onClick={() => handleAddToCart(k, item)} className="cursor-pointer text-blue-500" />
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>
          <div className="px-6 py-4 border-t bg-blue-100">
            <div className="text-right font-bold mb-2">Subtotal: ₹{subTotal}</div>
            <Link href="/checkout"><button className="w-full py-2 mb-2 rounded bg-blue-500 text-white">Checkout</button></Link>
            <button onClick={handleClearCart} className="w-full py-2 rounded bg-blue-500 text-white">Clear Cart</button>
          </div>
        </div>
      )}
    </>
  );
};

export default Navbar;
