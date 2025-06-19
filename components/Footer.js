import React from 'react'
import Image from 'next/image'
import Link from 'next/link'

const Footer = () => {
    return (
        <>


           <footer className="text-gray-300 body-font bg-[#112b58] text-sm">
  <div className="container px-5 py-10 mx-auto">
    <div className="flex flex-wrap md:text-left text-center order-first">
      {/* About */}
      <div className="lg:w-1/5 md:w-1/2 w-full px-4 mb-8">
        <h2 className="title-font font-medium text-white tracking-widest text-xs mb-3">ABOUT</h2>
        <nav className="list-none space-y-2">
          <li><a className="hover:underline cursor-pointer">Contact Us</a></li>
          <li><a className="hover:underline cursor-pointer">About Us</a></li>
          <li><a className="hover:underline cursor-pointer">Careers</a></li>
          <li><a className="hover:underline cursor-pointer">Clothsy Stories</a></li>
          <li><a className="hover:underline cursor-pointer">Press</a></li>
          <li><a className="hover:underline cursor-pointer">Corporate Information</a></li>
        </nav>
      </div>

      {/* Help */}
      <div className="lg:w-1/5 md:w-1/2 w-full px-4 mb-8">
        <h2 className="title-font font-medium text-white tracking-widest text-xs mb-3">HELP</h2>
        <nav className="list-none space-y-2">
          <li><a className="hover:underline cursor-pointer">Payments</a></li>
          <li><a className="hover:underline cursor-pointer">Shipping</a></li>
          <li><a className="hover:underline cursor-pointer">Cancellation & Returns</a></li>
          <li><a className="hover:underline cursor-pointer">FAQ</a></li>
          <li><a className="hover:underline cursor-pointer">Report Infringement</a></li>
        </nav>
      </div>

      {/* Consumer Policy */}
      <div className="lg:w-1/5 md:w-1/2 w-full px-4 mb-8">
        <h2 className="title-font font-medium text-white tracking-widest text-xs mb-3">CONSUMER POLICY</h2>
        <nav className="list-none space-y-2">
          <li><a className="hover:underline cursor-pointer">Return Policy</a></li>
          <li><a className="hover:underline cursor-pointer">Terms Of Use</a></li>
          <li><a className="hover:underline cursor-pointer">Security</a></li>
          <li><a className="hover:underline cursor-pointer">Privacy</a></li>
          <li><a className="hover:underline cursor-pointer">Sitemap</a></li>
          <li><a className="hover:underline cursor-pointer">Grievance Redressal</a></li>
        </nav>
      </div>

      {/* Social */}
      <div className="lg:w-1/5 md:w-1/2 w-full px-4 mb-8">
        <h2 className="title-font font-medium text-white tracking-widest text-xs mb-3">SOCIAL</h2>
        <nav className="list-none space-y-2">
          <li><a className="hover:underline cursor-pointer">Facebook</a></li>
          <li><a className="hover:underline cursor-pointer">Twitter</a></li>
          <li><a className="hover:underline cursor-pointer">YouTube</a></li>
        </nav>
      </div>

      {/* Address */}
      <div className="lg:w-1/5 md:w-full w-full px-4 mb-8">
        <h2 className="title-font font-medium text-white tracking-widest text-xs mb-3">Mail Us:</h2>
        <p className="text-sm">
          Clothsy Internet Private Limited,<br />
          Buildings Alyssa, Begonia &<br />
          Clove Embassy Tech Village,<br />
          Outer Ring Road, Devarabeesanahalli Village,<br />
          Patna, 560103,<br />
          Bihar, India
        </p>
      </div>
    </div>
  </div>

  {/* Bottom Bar */}
  <div className="bg-[#131a22] py-4">
    <div className="container mx-auto px-5 flex flex-wrap items-center justify-between text-xs text-gray-400">
      <p>© 2025 Clothsy — All rights reserved</p>
      <div className="flex space-x-4">
        <a className="hover:text-white cursor-pointer">Terms of Use</a>
        <a className="hover:text-white cursor-pointer">Privacy Policy</a>
        <a className="hover:text-white cursor-pointer">Sitemap</a>
      </div>
    </div>
  </div>
</footer>





        </>
    )
}

export default Footer

