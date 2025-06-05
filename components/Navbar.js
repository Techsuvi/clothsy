import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { AiOutlineShoppingCart } from "react-icons/ai";

const Navbar = () => {
  return (
    <div className='flex flex-col md:flex-row md:justify-start justify-center items-center my-2 shadow-md'>

        <div className='logo mx-5'>
          <Link href={'/'}> 
           <Image src="/logo.png" width={200} height={90} />
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
        <div className='cart absolute right-0 mx-5 top-4'>
        <AiOutlineShoppingCart className='text-xl font-bold md:text-2xl' />
           
        </div>




    </div>
  )
}

export default Navbar