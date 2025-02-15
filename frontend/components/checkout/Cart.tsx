"use client";
import React, { useState, useEffect } from "react";
import { ICartItem } from "@/store/types/userTypes";
import { ICartDetail } from "@/store/types/productTypes";
import { useGetUserCartQuery } from "@/store/apiSlices/userApiSlice";
import { useGetProductsByIdsQuery } from "@/store/apiSlices/productApiSlice";
import Image from "next/image";
import { setCurrentOrder } from "@/store/slices/orderSlice";
import { useRouter } from "next/navigation";
import { IOrderItem } from "@/store/types/orderTypes";
import { useDispatch } from "react-redux";
import { showToast } from "../ToastNotifications";
import Link from "next/link";

const Cart = () => {
  const [cartList, setCartList] = useState<ICartItem[]>([]);
  const [products, setProducts] = useState<ICartDetail[]>([]);
  const [orderItems, setOrderItems] = useState<IOrderItem[]>([]);

  const dispatch = useDispatch();
  const router = useRouter();

  const {
    data: cart,
    isLoading: isCartLoading,
    isError: isCartError,
  } = useGetUserCartQuery();

  const productIds = cart?.map((item) => item._id) || [];

  const {
    data: fetchedProducts,
    isLoading: isProductsLoading,
    isError: isProductsError,
  } = useGetProductsByIdsQuery(productIds, {
    skip: productIds.length === 0,
  });

  useEffect(() => {
    if (cart) {
      setCartList(cart);
    }
  }, [cart]);

  useEffect(() => {
    if (fetchedProducts) {
      const updatedProducts = cartList.map((cartItem) => {
        const productDetail = fetchedProducts.find(
          (product) => product._id === cartItem._id
        );

        if (productDetail) {
          const image =
            typeof productDetail.images[0] === "string"
              ? productDetail.images[0]
              : productDetail.images[0]
                ? URL.createObjectURL(productDetail.images[0])
                : "unknown-product.jpg";

          return {
            ...productDetail,
            quantity: cartItem.quantity,
            stock: productDetail.stock,
            price: cartItem.price,
            shippingPrice: cartItem.shippingPrice,
            checked: cartItem.checked,
            image: image,
          };
        }

        return {
          _id: cartItem._id,
          name: "Unknown Product",
          price: cartItem.price,
          quantity: cartItem.quantity,
          stock: 0,
          shippingPrice: cartItem.shippingPrice,
          checked: cartItem.checked,
          image: "unknown-product.jpg",
        };
      });
      setProducts(updatedProducts);

      const initialOrderItems = updatedProducts
        .filter((product) => product.checked)
        .map((product) => ({
          _id: product._id,
          quantity: product.quantity,
        }));

      setOrderItems(initialOrderItems);
      dispatch(setCurrentOrder(initialOrderItems));
    }
  }, [fetchedProducts, cartList, dispatch]);

  const handleCheckboxChange = (index: number) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product, i) =>
        i === index ? { ...product, checked: !product.checked } : product
      );
      updateOrderItems(updatedProducts);
      return updatedProducts;
    });
  };

  const handleQuantityChange = (index: number, value: number) => {
    setProducts((prevProducts) => {
      const updatedProducts = prevProducts.map((product, i) =>
        i === index ? { ...product, quantity: value } : product
      );
      updateOrderItems(updatedProducts);
      return updatedProducts;
    });
  };

  const updateOrderItems = (updatedProducts: ICartDetail[]) => {
    const newOrderItems = updatedProducts
      .filter((product) => product.checked)
      .map((product) => ({
        _id: product._id,
        quantity: product.quantity,
      }));

    setOrderItems(newOrderItems);
    dispatch(setCurrentOrder(newOrderItems));
  };

  const handleCheckout = () => {
    if (orderItems.length === 0) {
      showToast("error", "No items selected for checkout.");
      return;
    }

    router.push("/shipping-address");
  };

  const subtotal = products.reduce((acc, product) => {
    if (product.checked) {
      acc += product.price * product.quantity;
    }
    return acc;
  }, 0);

  const totalShipping = products.reduce((acc, product) => {
    if (product.checked) {
      acc += product.shippingPrice * product.quantity;
    }
    return acc;
  }, 0);

  const totalPrice = subtotal + totalShipping;

  if (isCartLoading || isProductsLoading) {
    return <div>Loading...</div>;
  }

  if (isCartError || isProductsError) {
    return <div>Error loading cart or products. Please try again later.</div>;
  }

  if (!cart || cart.length === 0) {
    return (
      <div className="flex justify-center items-center h-screen text-lg text-gray-500 flex-col">
        <p>Your cart is currently empty. Feel free to explore our products!</p>
        <button
          onClick={() => router.push("/")}
          className="mt-4 px-6 py-2 bg-mo text-white rounded-lg"
        >
          Go to Home
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col lg:flex-row w-full pt-[80px] px-[10px] md:px-8 my-8 bg-bg gap-4">
      <div className="flex-1 flex flex-col">
        {/* Header Row */}
        <div className="hidden sm:flex justify-between w-full my-4 h-auto">
          <div className="w-[4%] p-2"></div>
          <div className="w-20 p-2">Item</div>
          <div className="flex-1 min-w-[26%] p-2"></div>
          <div className="w-[14%] p-2">Quantity</div>
          <div className="w-[14%] p-2">Price</div>
          <div className="w-[14%] p-2">Shipping</div>
          <div className="w-[14%] p-2">Total</div>
        </div>

        {/* Cart Items */}
        {products.map((product, index) => (
          <div
            key={product._id}
            className="flex flex-col sm:flex-row items-stretch w-full my-2 gap-2"
          >
            {/* Checkbox */}
            <div className="sm:w-[4%] flex items-center justify-center p-2">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={product.checked}
                  onChange={() => handleCheckboxChange(index)}
                  className="hidden"
                />
                <span
                  className={`w-5 h-5 flex items-center justify-center border-2 rounded ${
                    product.checked ? "border-mo bg-mo" : "border-mo bg-white"
                  } transition-all duration-200`}
                ></span>
              </label>
            </div>

            {/* Product Image */}
            <div className="sm:w-20 h-20 bg-bgt rounded-lg overflow-hidden">
              {product.image ? (
                <Link href={`/product/${product._id}`}>
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={120}
                    height={120}
                    className="object-contain w-full h-full p-1"
                  />
                </Link>
              ) : (
                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                  No image
                </div>
              )}
            </div>

            {/* Product Details */}
            <div className="flex-1 sm:min-w-[26%] p-2 bg-bgt rounded-lg">
              <p className="font-medium line-clamp-2">{product.name}</p>
            </div>

            {/* Quantity Controls */}
            <div className="sm:w-[14%] p-2 bg-bgt rounded-lg flex items-center justify-between gap-2">
              <button
                onClick={() =>
                  handleQuantityChange(index, product.quantity - 1)
                }
                disabled={product.quantity <= 1}
                className="w-8 h-8 flex items-center justify-center bg-bl/10 rounded"
              >
                -
              </button>
              <span>{product.quantity}</span>
              <button
                onClick={() =>
                  handleQuantityChange(index, product.quantity + 1)
                }
                disabled={product.quantity >= product.stock}
                className="w-8 h-8 flex items-center justify-center bg-bl/10 rounded"
              >
                +
              </button>
            </div>

            {/* Prices */}
            <div className="flex items-center justify-between sm:w-[14%] p-2 bg-bgt rounded-lg">
              <span className="sm:hidden">Price</span>${product.price}
            </div>
            <div className="flex items-center justify-between sm:w-[14%] p-2 bg-bgt rounded-lg">
              <span className="sm:hidden">Shipping</span>$
              {product.shippingPrice}
            </div>
            <div className="flex items-center justify-between sm:w-[14%] p-2 bg-bgt rounded-lg font-semibold">
              <span className="sm:hidden">Total</span>$
              {(product.price + product.shippingPrice) * product.quantity}
            </div>
          </div>
        ))}
      </div>

      {/* Calculator Box */}
      <div className="lg:sticky lg:top-[200px] lg:self-start w-full lg:w-80 bg-white p-4 rounded-lg shadow-md">
        <div className="space-y-3">
          <div className="flex justify-between">
            <span>Subtotal:</span>
            <span className="font-semibold">${subtotal}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping:</span>
            <span className="font-semibold">${totalShipping}</span>
          </div>
          <div className="flex justify-between border-t pt-3">
            <span>Total:</span>
            <span className="font-semibold text-lg">${totalPrice}</span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full py-3 bg-mo text-white rounded-lg hover:bg-mo/90 transition-colors"
          >
            Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
