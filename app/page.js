import Footer from "@/components/Footer";
import HomeSlider from "@/components/HomeSlider";
import Navbar from "@/components/Navbar";
import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <>
    

      {/* Hero Cover Image */}
      {/* <div>
        <Image
          src="/cover.jpg"
          alt="cover"
          width={1920}
          height={400}
          style={{
            width: "100%",
            height: "400px",
            objectFit: "cover",
          }}
        />
      </div> */}
      <HomeSlider />

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">

          {/* Tagline and Intro */}
          <div className="flex flex-wrap w-full mb-20 flex-col items-center text-center">
            <h1 className="sm:text-3xl text-2xl title-font mb-2 font-bold text-blue-500">
              Wear the <span className="text-blue-500">&lt;code&gt;</span>
            </h1>
            <p className="lg:w-1/2 w-full leading-relaxed text-gray-500">
              Introducing Clothsy, a revolutionary e-commerce platform that delivers amazing products at unbeatable prices. Built on Next.js and MongoDB, our site offers a seamless shopping experience powered by server-side rendering.
            </p>
          </div>

          {/* Trending Section Placeholder */}
          <div className="w-full mb-12 text-center">
            <h2 className="text-xl text-blue-500 font-medium title-font mb-2">
              Explore Trending Hoodies on Clothsy
            </h2>
            <p className="text-gray-500 leading-relaxed">
              Loading... Hold tight.
            </p>
          </div>

          {/* Features Cards (Why Clothsy) */}
          <div className="flex flex-wrap -m-4">
            {/* Premium Tshirts */}
            <div className="w-full md:w-1/3 p-4">
              <div className="border border-blue-200 p-6 rounded-lg">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-500 mb-4">
                  {/* Example icon (T-shirt icon could replace this) */}
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                    {/* Placeholder icon (e.g. T-shirt) */}
                    <path d="M20 12H4l8-8 8 8z"></path>
                    <path d="M4 12v8h16v-8"></path>
                  </svg>
                </div>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-2">Premium Tshirts</h2>
                <p className="leading-relaxed text-base">Our T-Shirts are 100% made of cotton.</p>
              </div>
            </div>

            {/* Free Shipping */}
            <div className="w-full md:w-1/3 p-4">
              <div className="border border-blue-200 p-6 rounded-lg">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-500 mb-4">
                  {/* Example icon (Truck) */}
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                    {/* Truck icon path */}
                    <path d="M3 13h14v-4H3v4z"></path>
                    <path d="M14 13l4-4"></path>
                    <path d="M14 13l4 4"></path>
                    <path d="M3 17h14v-4H3v4z"></path>
                  </svg>
                </div>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-2">Free Shipping</h2>
                <p className="leading-relaxed text-base">We ship all over India for FREE.</p>
              </div>
            </div>

            {/* Exciting Offers */}
            <div className="w-full md:w-1/3 p-4">
              <div className="border border-blue-200 p-6 rounded-lg">
                <div className="w-10 h-10 inline-flex items-center justify-center rounded-full bg-blue-100 text-blue-500 mb-4">
                  {/* Example icon (Sparkles) */}
                  <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" className="w-6 h-6" viewBox="0 0 24 24">
                    {/* Sparkles icon paths */}
                    <path d="M5 15l5 5"></path>
                    <path d="M5 15l-5-5"></path>
                    <path d="M15 5l5-5"></path>
                    <path d="M15 5l-5 5"></path>
                  </svg>
                </div>
                <h2 className="text-lg text-gray-900 font-medium title-font mb-2">Exciting Offers</h2>
                <p className="leading-relaxed text-base">We provide amazing offers &amp; discounts.</p>
              </div>
            </div>
          </div>

        </div>
      </section>

     
    </>
  );
}