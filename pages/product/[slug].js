import { useRouter } from 'next/router';
import React, { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Post = ({ initialProduct, variants, addToCart, setIsCartOpen, buyNow }) => {
  const router = useRouter();
  const { slug } = router.query;

  const [product, setProduct] = useState(initialProduct);
  const [selectedSize, setSelectedSize] = useState(initialProduct.size);
  const [selectedColor, setSelectedColor] = useState(initialProduct.color);
  const [pin, setPin] = useState('');
  const [service, setService] = useState(null);

  const [city, setCity] = useState('');
  const [district, setDistrict] = useState('');
  const [stateName, setStateName] = useState('');

  const hasSize = !!initialProduct.size;

  const sizeColorSlugMap = useMemo(() => {
    const map = {};
    for (const color in variants) {
      for (const size in variants[color]) {
        if (!map[size]) map[size] = {};
        map[size][color] = variants[color][size];
      }
    }
    return map;
  }, [variants]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!slug) return;
      const res = await fetch(`/api/getproduct?slug=${slug}`);
      const data = await res.json();
      setProduct(data);
      setSelectedSize(data.size);
      setSelectedColor(data.color);
    };

    fetchProduct();
  }, [slug]);

  useEffect(() => {
    if (!hasSize || !sizeColorSlugMap[selectedSize]) return;

    if (!sizeColorSlugMap[selectedSize][selectedColor]) {
      const fallbackColor = Object.keys(sizeColorSlugMap[selectedSize])[0];
      const fallbackSlug = sizeColorSlugMap[selectedSize][fallbackColor];
      if (fallbackSlug) {
        window.location.href = `/product/${fallbackSlug}`;
      }
    }
  }, [selectedSize]);

  const refreshVariant = (color, size) => {
    const slug = hasSize ? sizeColorSlugMap[size][color] : variants[color];
    if (slug) {
      window.location.href = `/product/${slug}`;
    }
  };

  const checkServicability = async () => {
    if (!/^\d{6}$/.test(pin)) {
      toast.warn("Please enter a valid 6-digit pincode.", { autoClose: 2500 });
      return;
    }

    const res = await fetch('/api/pincode');
    const data = await res.json();
    const pinData = data[pin];

    if (pinData) {
      setService(true);
      setCity(pinData.city);
      setDistrict(pinData.district);
      setStateName(pinData.state);
      toast.success("Yay! We deliver to this pincode. 🚚", { autoClose: 3000 });
    } else {
      setService(false);
      setCity('');
      setDistrict('');
      setStateName('');
      toast.error("Sorry, we do not deliver to this pincode yet. ❌", { autoClose: 3000 });
    }
  };

  const availableSizes = hasSize ? Object.keys(sizeColorSlugMap) : [];
  const availableColorsForSize = hasSize
    ? Object.keys(sizeColorSlugMap[selectedSize] || {})
    : Object.keys(variants);

  return (
    <section className="text-gray-600 body-font overflow-hidden">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Bounce}
      />

      <div className="container px-5 py-14 mx-auto">
        <div className="lg:w-4/5 mx-auto flex flex-wrap">
          <Image
            alt="ecommerce"
            className="lg:w-1/2 w-full lg:h-auto px-24 object-cover object-top rounded"
            width={400}
            height={400}
            src={product.img.startsWith('http') ? product.img : '/' + product.img}
          />
          <div className="lg:w-1/2 w-full lg:pl-10 lg:py-6 mt-6 lg:mt-0">
            <h2 className="text-sm title-font text-gray-500 tracking-widest">Clothsy</h2>
            <h1 className="text-gray-900 text-3xl title-font font-medium mb-1">
              {product.title} {hasSize ? `(${selectedSize} / ${selectedColor})` : `(${selectedColor})`}
            </h1>

            <p className="leading-relaxed">{product.desc}</p>

            <div className="flex mt-6 items-center pb-5 border-b-2 border-gray-100 mb-5">
              {hasSize && (
                <div className="flex items-center">
                  <span className="mr-3">Size</span>
                  <select
                    className="border cursor-pointer rounded px-3 py-1"
                    value={selectedSize}
                    onChange={(e) => setSelectedSize(e.target.value)}
                  >
                    {availableSizes.map((size) => (
                      <option key={size} value={size}>{size}</option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex items-center ml-6">
                <span className="mr-3">Color</span>
                <div className="flex space-x-2">
                  {availableColorsForSize.map((color) => {
                    const isAvailable = hasSize
                      ? !!sizeColorSlugMap[selectedSize]?.[color]
                      : !!variants[color];

                    return (
                      <button
                        key={color}
                        onClick={() => refreshVariant(color, selectedSize)}
                        disabled={!isAvailable}
                        className={`w-6 cursor-pointer h-6 rounded-full border-2 ${color === selectedColor ? 'border-black' : 'border-gray-300'} ${!isAvailable ? 'opacity-30 cursor-not-allowed' : ''}`}
                        style={{ backgroundColor: color }}
                        title={isAvailable ? color : 'Out of stock'}
                      ></button>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="flex">
              <span className="title-font font-medium text-2xl text-gray-900">
                ₹{product.price}
              </span>
              <button
                onClick={() => {
                  buyNow(
                    product.slug,
                    1,
                    product.price,
                    product.title,
                    selectedSize,
                    selectedColor
                  );
                }}
                className="flex ml-8 cursor-pointer text-white bg-blue-500 border-0 py-2 px-6 hover:bg-blue-600 rounded"
              >
                Buy Now
              </button>
              <button
                onClick={() => {
                  addToCart(
                    product.slug,
                    1,
                    product.price,
                    product.title,
                    selectedSize,
                    selectedColor
                  );
                  setIsCartOpen(true);
                  toast.success("Item added to cart! 🛒", { autoClose: 2000 });
                }}
                className="flex ml-4 cursor-pointer text-white bg-blue-600 border-0 py-2 px-6 hover:bg-blue-700 rounded"
              >
                Add to Cart
              </button>
            </div>

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
                className="text-white cursor-pointer bg-blue-500 border-0 py-2 px-6 hover:bg-blue-600 rounded"
              >
                Check
              </button>
            </div>

            {service && (
              <div className="mt-2 text-sm text-green-700">
                ✅ Delivery available to <b>{city}</b>, <b>{district}</b>, <b>{stateName}</b>
              </div>
            )}
            {service === false && (
              <div className="mt-2 text-sm text-red-600">
                ❌ We do not currently deliver to this pincode.
              </div>
            )}

            {/* Hidden fields if you want to use in a form */}
            <input type="hidden" name="city" value={city} />
            <input type="hidden" name="district" value={district} />
            <input type="hidden" name="state" value={stateName} />
          </div>
        </div>
      </div>
    </section>
  );
};

export async function getServerSideProps(context) {
  const { slug } = context.query;
  const connectDb = (await import('@/middleware/mongoose')).default;
  await connectDb();

  const Product = (await import('@/models/Product')).default;

  const product = await Product.findOne({ slug }).lean();
  const allVariants = await Product.find({ title: product.title }).lean();

  const variants = {};
  allVariants.forEach((item) => {
    if (item.size) {
      if (!variants[item.color]) variants[item.color] = {};
      variants[item.color][item.size] = item.slug;
    } else {
      variants[item.color] = item.slug;
    }
  });

  return {
    props: {
      initialProduct: JSON.parse(JSON.stringify(product)),
      variants: JSON.parse(JSON.stringify(variants)),
    },
  };
}

export default Post;
