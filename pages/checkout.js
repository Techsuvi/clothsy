import React from 'react'
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import Link from 'next/link';
import { RiShoppingBag4Fill } from "react-icons/ri";
import { AiOutlineClear } from "react-icons/ai";


const Checkout = ({ cart, subTotal, addToCart, removeFromCart }) => {
  return (
    <div className='container px-2 sm:m-auto'>
      <h1 className='font-bold text-3xl my-8 text-center'>Checkout</h1>
      <h2 className='font-semibold text-xl'>1. Delivery Details</h2>


      <div className='mx-auto flex my-2'>
        <div className='px-2 w-1/2'>
          <div className=" mb-4">
            <label htmlFor="name" className="leading-7 text-sm text-gray-600">Name</label>
            <input type="text" id="name" name="name" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
        <div className='px-2 w-1/2'>
          <div className=" mb-4">
            <label htmlFor="email" className="leading-7 text-sm text-gray-600">Email</label>
            <input type="email" id="email" name="email" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>
      </div>



      <div className='px-2 w-full'>

        <div className=" mb-4">
          <label htmlFor="address" className="leading-7 text-sm text-gray-600">Address</label>
          <textarea id="address" name="address" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"></textarea>
        </div>

      </div>




      <div className='mx-auto flex my-2'>

        <div className='px-2 w-1/2'>
          <div className=" mb-4">
            <label htmlFor="phone" className="leading-7 text-sm text-gray-600">Phone Number</label>
            <input type="phone" id="phone" name="phone" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>



        <div className='px-2 w-1/2'>
          <div className=" mb-4">
            <label htmlFor="City" className="leading-7 text-sm text-gray-600">City</label>
            <input type="text" id="City" name="City" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>




      </div>

      <div className='mx-auto flex my-2'>

        <div className='px-2 w-1/2'>
          <div className=" mb-4">
            <label htmlFor="state" className="leading-7 text-sm text-gray-600">State</label>
            <input type="text" id="state" name="state" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>



        <div className='px-2 w-1/2'>
          <div className=" mb-4">
            <label htmlFor="pincode" className="leading-7 text-sm text-gray-600">Pincode</label>
            <input type="text" id="pincode" name="pincode" className="w-full bg-white rounded border border-gray-300 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out" />
          </div>
        </div>




      </div>










      <h2 className='font-semibold text-xl'>2. Review Cart Items & Payment</h2>












      <div className="sideCart bg-blue-100 p-6 m-2">
        {/* <h2 className='font-bold py-10 text-center text-xl'>Shopping Cart</h2> */}


        <ol className='list-decimal font-semibold'>
          {cart && Object.keys(cart).length === 0 && (
            <li className='my-5 text-base font-semibold list-none'>Your Cart is Empty!</li>
          )}

          {cart && Object.keys(cart).map((k) => {
            const item = cart[k];
            if (!item) return null;

            return (
              <li key={k}>
                <div className='item flex my-3'>
                  <div className=' mx-2 font-semibold'>{item.name}</div>
                  <div className=' mx-24 font-semibold flex items-center justify-end space-x-2'>
                    <FaCircleMinus
                      onClick={() =>
                        removeFromCart(k, 1, item.price, item.name, item.size, item.variant)
                      }
                      className="cursor-pointer text-blue-500 text-xl"
                    />
                    <span>{item.qty}</span>
                    <FaCirclePlus
                      onClick={() =>
                        addToCart(k, 1, item.price, item.name, item.size, item.variant)
                      }
                      className="cursor-pointer text-blue-500 text-xl"
                    />
                  </div>
                </div>
              </li>

            );
          })}

        </ol>
        <span className='font-bold text-xl md:flex md:justify-end'>SubTotal: ₹{subTotal}</span>
        <div className='mx-4'>
          <Link href='/checkout'>
            <button className="flex mx-auto mt-16 text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg">
              <RiShoppingBag4Fill className='m-1' />
              Pay ₹{subTotal}
            </button>
          </Link>
        </div>



      </div>









    </div>
  )
}

export default Checkout