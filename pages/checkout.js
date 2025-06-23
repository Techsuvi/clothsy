import React from 'react';
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import Link from 'next/link';
import { RiShoppingBag4Fill } from "react-icons/ri";
import { AiOutlineClear } from "react-icons/ai";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const Checkout = ({ cart, subTotal, addToCart, removeFromCart }) => {


 const handleAddToCart = (k, item) => {
    const slug = item.slug || k.split("-")[0]; // Prefer slug from item if available
    addToCart(slug, 1, item.price, item.name, item.size, item.variant);
    toast.success("Item added to cart!", {
      position: "top-right",
      autoClose: 1500,
    });
  };





  return (
    <div className='container px-2 sm:m-auto'>
      <h1 className='font-bold text-3xl my-8 text-center'>Checkout</h1>
      <h2 className='font-semibold text-xl'>1. Delivery Details</h2>

      <div className='mx-auto flex my-2'>
        <div className='px-2 w-1/2'>
          <div className="mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
            <input type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3" />
          </div>
        </div>
        <div className='px-2 w-1/2'>
          <div className="mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
            <input type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3" />
          </div>
        </div>
      </div>

      <div className='px-2 w-full'>
        <div className="mb-4">
          <label htmlFor="address" className="leading-7 text-sm text-gray-600">Address</label>
          <textarea id="address" name="address" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3"></textarea>
        </div>
      </div>

      <div className='mx-auto flex my-2'>
        <div className='px-2 w-1/2'>
          <div className="mb-4">
            <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone Number</label>
            <input type="tel" id="phone" name="phone" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3" />
          </div>
        </div>

        <div className='px-2 w-1/2'>
          <div className="mb-4">
            <label htmlFor="city" className="leading-7 text-sm text-gray-600">City</label>
            <input type="text" id="city" name="city" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3" />
          </div>
        </div>
      </div>

      <div className='mx-auto flex my-2'>
        <div className='px-2 w-1/2'>
          <div className="mb-4">
            <label htmlFor="state" className="leading-7 text-sm text-gray-600">State</label>
            <input type="text" id="state" name="state" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3" />
          </div>
        </div>

        <div className='px-2 w-1/2'>
          <div className="mb-4">
            <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">Pincode</label>
            <input type="text" id="pincode" name="pincode" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3" />
          </div>
        </div>
      </div>

      <h2 className='font-semibold text-xl'>2. Review Cart Items & Payment</h2>













      <div className="sideCart bg-blue-100 p-6 m-2">
        <ol className='list-decimal font-semibold'>
          {cart && Object.keys(cart).length === 0 && (
            <li className='my-5 text-base font-semibold list-none'>Your Cart is Empty!</li>
          )}

          {cart && Object.keys(cart).map((k) => {
            const item = cart[k];
            if (!item || item.qty === 0) return null;

            return (
              <li key={k}>
                <div className='item flex flex-col my-3  pb-2'>
                  <div className='flex justify-between items-center'>
                    <div className='font-semibold'>
                      {item.name}
                      <div className='text-sm font-normal text-gray-600'>
                        ({item.size} / {item.variant})
                      </div>
                    </div>
                    <div className='text-right text-sm font-semibold text-gray-700'>
                      ₹{item.price * item.qty}
                    </div>
                  </div>

                  <div className='flex items-center justify-between mt-2'>
                    <div className='flex space-x-2 items-center'>
                      <FaCircleMinus
                        onClick={() => removeFromCart(k, 1)}
                        
                        className="cursor-pointer text-blue-500 text-xl"
                      />
                      <span>{item.qty}</span>
                      <FaCirclePlus
                                                onClick={() => handleAddToCart(k, item)}

                        className="cursor-pointer text-blue-500 text-xl"
                      />
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <span className='font-bold text-xl flex justify-end mt-4'>Subtotal: ₹{subTotal}</span>

        <div className='mx-4'>
          <Link href='/payment'>
           <button className="flex items-center justify-center gap-2 mx-auto mt-6 text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg">
  <RiShoppingBag4Fill className="text-xl" />
  <span >Pay ₹{subTotal}</span>
</button>

          </Link>
        </div>
      </div>
    </div>
  );
};

export default Checkout;    