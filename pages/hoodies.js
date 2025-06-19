import Link from 'next/link';
import React from 'react';
import Product from "@/models/Product";
import mongoose from 'mongoose';
import Image from 'next/image';

const Hoodies = ({ products }) => {
  return (
    <section className="text-gray-600 body-font">
      <div className="container px-5 py-24 mx-auto">
        <div className="flex flex-wrap justify-center -m-4">

          {Object.keys(products).length === 0 && (
            <p className="text-center text-lg">No products found.</p>
          )}

          {Object.keys(products).map((key) => {
            const product = products[key];
            return (
              <Link key={product._id} href={`/product/${product.slug}`} legacyBehavior>
                <div className="lg:w-1/5 md:w-1/2 p-4 w-full cursor-pointer shadow-lg m-2">
                  <div className="block relative rounded overflow-hidden">
                    <Image
                      alt="hoodies"
                      src={product.img}
                      width={300}
                      height={400}
                      className="m-auto h-[36vh] block object-contain"
                    />
                  </div>
                  <div className="mt-4 text-center">
                    <h3 className="text-gray-500 text-xs tracking-widest title-font mb-1">
                      {product.category}
                    </h3>
                    <h2 className="text-gray-900 title-font text-md font-medium">
                      {product.title}
                    </h2>
                    <p className="mt-1">₹{product.price}</p>

                    <div className="flex justify-center space-x-2 mt-2">
                      {product.size.map((s) => (
                        <span
                          key={s}
                          className="border px-2 py-0.5 text-xs rounded text-gray-700"
                        >
                          {s}
                        </span>
                      ))}
                    </div>

                    <div className="flex justify-center items-center space-x-2 mt-2">
                      {product.color.slice(0, 5).map((c) => (
                        <button
                          key={c}
                          className="w-5 h-5 rounded-full border border-gray-300"
                          style={{ backgroundColor: c }}
                          title={c}
                        ></button>
                      ))}

                      {product.color.length > 5 && (
                        <span className="text-xs text-gray-600 font-medium">+{product.color.length - 5} more</span>
                      )}
                    </div>

                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export async function getServerSideProps() {
  if (!mongoose.connections[0].readyState) {
    await mongoose.connect(process.env.MONGO_URI);
  }

  const products = await Product.find({ category: 'hoodie' });
  const Hoodies = {};

  for (let item of products) {
    if (item.availableQty <= 0) continue;

    if (!Hoodies[item.title]) {
      Hoodies[item.title] = JSON.parse(JSON.stringify(item));
      Hoodies[item.title].color = [];
      Hoodies[item.title].size = [];
    }

    // Add color if not already added and available in any size
    if (!Hoodies[item.title].color.includes(item.color)) {
      Hoodies[item.title].color.push(item.color);
    }

    // Add size if not already added and available
    if (!Hoodies[item.title].size.includes(item.size)) {
      Hoodies[item.title].size.push(item.size);
    }
  }

  return {
    props: { products: JSON.parse(JSON.stringify(Hoodies)) },
  };
}

export default Hoodies;
