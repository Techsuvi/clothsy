import Link from 'next/link'
import React from 'react'
import Product from "@/models/Product"
import mongoose from 'mongoose'
import Image from 'next/image'

const Tshirts = ({ products }) => {
  return (
    <>
      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto">
          <div className="flex flex-wrap justify-center -m-4">

            {/* Fallback UI */}
            {products.length === 0 && (
              <p className="text-center text-lg">No products found.</p>
            )}

            {/* Product List */}
            {products.map((item) => (
              <Link key={item._id} href={`/product/${item.slug}`}  legacyBehavior>
                <div className="lg:w-1/5 md:w-1/2 p-4 w-full cursor-pointer shadow-lg m-2">
                  <div className="block relative rounded overflow-hidden">
                    <Image
                      alt="ecommerce"
                      src={item.img}
                      width={300}
                      height={400}
                      className="m-auto h-[36vh] block object-contain"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                      {item.category}
                    </h3>
                    <h2 className="text-gray-900 title-font text-lg font-medium">
                      {item.title}
                    </h2>
                    <p className="mt-1">₹{item.price}</p>
                    <p className="mt-1">{item.size || "Free Size"}</p>
                  </div>
                </div>
              </Link>

            ))}
          </div>
        </div>
      </section>
    </>
  )
}

export async function getServerSideProps() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI)
  }

  let products = await Product.find()

  return {
    props: { products: JSON.parse(JSON.stringify(products)) },
  }
}

export default Tshirts
