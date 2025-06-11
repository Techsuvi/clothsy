"use client"


import Image from 'next/image'
import Link from 'next/link'
import React, { useRef } from 'react'
import { AiOutlineShoppingCart } from "react-icons/ai";
import { IoMdCloseCircle } from "react-icons/io";
import { FaCircleMinus, FaCirclePlus } from "react-icons/fa6";
import { RiShoppingBag4Fill } from "react-icons/ri";
import { AiOutlineClear } from "react-icons/ai";

const Navbar = () => {


  const toggleCart = () => {
    if (ref.current.classList.contains('translate-x-full')) {
      ref.current.classList.remove('translate-x-full')
      ref.current.classList.add('translate-x-0')

    }
    else if (!ref.current.classList.contains('translate-x-full')) {
      ref.current.classList.remove('translate-x-0')
      ref.current.classList.add('translate-x-full')

    }

  }

  const ref = useRef()



  return (
    <>
      <div className='flex flex-col overflow-x-hidden md:flex-row md:justify-start justify-center items-center my-2 shadow-md'>

        <div className='logo mx-5'>
          <Link href={'/'}>
            <Image src="/CLOTHSY.png" width={110} height={120} />
          </Link>
        </div>
        <div className='nav'>
          <ul className='flex items-center space-x-6 font-bold md:text-md'>
            <li><Link href={'/tshirts'}>Tshirts</Link></li>
            <li><Link href={'/hoodies'}>Hoodies</Link></li>
            <li><Link href={'/stickers'}>Stickers</Link></li>
            <li><Link href={'/mugs'}>Mugs</Link></li>
          </ul>
        </div>
        <div onClick={toggleCart} className='cart absolute right-0 mx-5 top-4'>
          <AiOutlineShoppingCart className='text-3xl font-bold text-blue-500 md:text-2xl cursor-pointer' />

        </div>


        <div
          ref={ref}
          className="sideCart fixed top-0 right-0 bg-blue-100 px-8 w-82 h-full py-10 transform transition-transform translate-x-full z-50 shadow-lg"
        >

          <h2 className='font-bold text-center text-xl'>Shopping Cart</h2>
          <span onClick={toggleCart} className='absolute top-5 right-4'>

            <IoMdCloseCircle className='text-blue-500 text-3xl cursor-pointer' />

          </span>

          <ol className='list-decimal font-semibold'>

            <li>
              <div className='item flex my-3'>

                <div className='w-2/5 mx-2 font-semibold'>  Tshirt - Wear the code  </div>
                <div className='w-2/5 mx-2 font-semibold flex items-center space-x-2'>
                  <FaCircleMinus className="cursor-pointer text-blue-500 text-xl" />
                  <span>1</span>
                  <FaCirclePlus className="cursor-pointer text-blue-500 text-xl" />
                </div>

              </div>

            </li>


            <li>
              <div className='item flex my-3'>

                <div className='w-2/5 mx-2 font-semibold'>  Tshirt - Wear the code  </div>
                <div className='w-2/5 mx-2 font-semibold flex items-center space-x-2'>
                  <FaCircleMinus className="cursor-pointer text-blue-500 text-xl" />
                  <span>1</span>
                  <FaCirclePlus className="cursor-pointer text-blue-500 text-xl" />
                </div>

              </div>

            </li>


            <li>
              <div className='item flex my-3'>

                <div className='w-2/5 mx-2 font-semibold'>  Tshirt - Wear the code  </div>
                <div className='w-2/5 mx-2 font-semibold flex items-center space-x-2'>
                  <FaCircleMinus className="cursor-pointer text-blue-500 text-xl" />
                  <span>1</span>
                  <FaCirclePlus className="cursor-pointer text-blue-500 text-xl" />
                </div>

              </div>

            </li>


            <li>
              <div className='item flex my-3'>

                <div className='w-2/5 mx-2 font-semibold'>  Tshirt - Wear the code  </div>
                <div className='w-2/5 mx-2 font-semibold flex items-center space-x-2'>
                  <FaCircleMinus className="cursor-pointer text-blue-500 text-xl" />
                  <span>1</span>
                  <FaCirclePlus className="cursor-pointer text-blue-500 text-xl" />
                </div>

              </div>

            </li>


            <li>
              <div className='item flex my-3'>

                <div className='w-2/5 mx-2 font-semibold'>  Tshirt - Wear the code  </div>
                <div className='w-2/5 mx-2 font-semibold flex items-center space-x-2'>
                  <FaCircleMinus className="cursor-pointer text-blue-500 text-xl" />
                  <span>1</span>
                  <FaCirclePlus className="cursor-pointer text-blue-500 text-xl" />
                </div>

              </div>

            </li>
          </ol>


          
      <Link href={'/checkout'}>
        <button className="flex mx-auto mt-16 text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg">
        <RiShoppingBag4Fill className='m-1' />
          Checkout
        </button>
      </Link>

       <button className="flex mx-auto mt-4 text-white bg-blue-500 border-0 py-2 px-8 focus:outline-none hover:bg-blue-600 rounded text-lg">
        <AiOutlineClear className='m-1' />
          Clear Cart
        </button>
      

    </div>



      </div>
    </>
  )
}

export default Navbar