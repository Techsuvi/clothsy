import { useRouter } from 'next/router';
import React, { useState } from 'react';
import Image from 'next/image';

const Post = ({ addToCart, setIsCartOpen  }) => {
  const router = useRouter();
  const { slug } = router.query;


  // TEMP PRODUCT MOCK
  const product = {
    slug: slug || "default-slug",
    title: "Wear the Style",
    price: 589
  };

  const [pin, setPin] = useState('');
  const [service, setService] = useState(null);
  const [selectedSize, setSelectedSize] = useState('XL');
  const [selectedColor, setSelectedColor] = useState('Blue');

  const checkServicability = async () => {
    let res = await fetch('http://localhost:3000/api/pincode');
    let data = await res.json();
    if (data.includes(parseInt(pin))) {
      setService(true);
    } else {
      setService(false);
    }
  };

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <div className="container px-5 py-14 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <Image
            alt="ecommerce"
            className="lg:w-1/2 w-full lg:h-auto px-24 object-cover object-top rounded"
            width={400}
            height={400}
            src="https://m.media-amazon.com/images/I/61Fh0EZ3oYL._SY879_.jpg"
          />

          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">Clothsy</h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
              {product.title}
            </h1>

            <p className="leading-relaxed">
              Awesome T-shirt with modern fit and fine quality material.
            </p>

            <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
              {/* Color Picker */}
              <div className="flex">
                <span className="mr-3">Color</span>
                {['Red', 'Blue', 'Black'].map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`border-2 mx-1 rounded-full w-6 h-6 focus:outline-none ${selectedColor === color ? 'border-black' : 'border-gray-300'} ${color === 'Red' ? 'bg-red-500' : color === 'Blue' ? 'bg-blue-500' : 'bg-black'}`}
                  ></button>
                ))}
              </div>

              {/* Size Selector */}
              <div className="flex ml-6 items-center">
                <span className="mr-3">Size</span>
                <select
                  onChange={(e) => setSelectedSize(e.target.value)}
                  className="rounded border border-gray-300 py-2 pl-3 pr-10"
                >
                  {['S', 'M', 'L', 'XL'].map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex">
              <span className="title-font font-medium text-2xl text-gray-900">₹{product.price}</span>

              <button
                onClick={() => {
                  addToCart(
                    product.slug,
                    1,
                    product.price,
                    `${product.title} (${selectedSize}, ${selectedColor})`,
                    selectedSize,
                    selectedColor
                  );
                  setIsCartOpen(true);
                }}
                className="flex ml-10 text-white bg-blue-500 border-0 py-2 px-6 hover:bg-blue-600 rounded"
              >
                Add to Cart
              </button>
            </div>

            {/* Pincode Check */}
            <div className="pin mt-6 flex space-x-2">
              <input
                type="text"
                placeholder="Enter your Pincode"
                className="px-2 border-2 border-gray-500"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
              <button
                onClick={checkServicability}
                className="text-white bg-blue-500 border-0 py-2 px-6 hover:bg-blue-600 rounded"
              >
                Check
              </button>
            </div>

            {service === false && (
              <div className="text-red-700 mt-2">Sorry! we do not deliver to this pincode yet.</div>
            )}
            {service === true && (
              <div className="text-green-700 mt-2">Yay! this pincode is serviceable.</div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Post;
