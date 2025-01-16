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
              : URL.createObjectURL(productDetail.images[0]);

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
    <div className="flex justify-between w-full py-[26px] px-[46px] my-[80px] bg-bg gap-[6px]">
      <div className="flex flex-1 flex-col mr-[280px]">
        <div className="flex justify-between w-full my-[15px] h-[44px]">
          <div className="flex w-[4%] justify-center p-[6px]"></div>
          <div className="flex w-[74px] justify-start p-[6px]">Item</div>
          <div className="flex-1 min-w-[26%] justify-start p-[6px]"></div>
          <div className="flex w-[14%] justify-start p-[6px]">Quantity</div>
          <div className="flex w-[14%] justify-start p-[6px]">Unit Price</div>
          <div className="flex w-[14%] justify-start p-[6px]">Shipping</div>
          <div className="flex w-[14%] justify-start p-[6px]">Total Price</div>
        </div>

        {products.map((product, index) => {
          const totalPrice =
            (product.price + product.shippingPrice) * product.quantity;
          return (
            <div
              key={product._id}
              className="flex justify-between w-full my-[5px] h-[74px] gap-[4px]"
            >
              <div className="flex w-[4%] justify-center p-[6px]">
                <input
                  type="checkbox"
                  checked={product.checked}
                  onChange={() => handleCheckboxChange(index)}
                />
              </div>
              <div className="flex items-center justify-center w-[74px] bg-bgt rounded-[6px]">
                {product.image ? (
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={120}
                    height={120}
                    className="p-[6px]"
                  />
                ) : (
                  <div>No image</div>
                )}
              </div>
              <div className="flex-1 min-w-[26%] justify-start p-[6px] bg-bgt rounded-[6px]">
                {product.name}
              </div>
              <div className="flex w-[14%] justify-start p-[6px] bg-bgt rounded-[6px]">
                <button
                  onClick={() =>
                    handleQuantityChange(index, product.quantity - 1)
                  }
                  disabled={product.quantity <= 1}
                  className={`flex w-[40px] justify-center ${
                    product.quantity <= 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  -
                </button>
                <span>{product.quantity}</span>
                <button
                  onClick={() =>
                    handleQuantityChange(index, product.quantity + 1)
                  }
                  disabled={product.quantity >= product.stock}
                  className={`flex w-[40px] justify-center ${
                    product.quantity >= product.stock
                      ? "opacity-50 cursor-not-allowed"
                      : ""
                  }`}
                >
                  +
                </button>
              </div>
              <div className="flex w-[14%] justify-start p-[6px] bg-bgt rounded-[6px]">
                ${product.price}
              </div>
              <div className="flex w-[14%] justify-start p-[6px] bg-bgt rounded-[6px]">
                ${product.shippingPrice}
              </div>
              <div className="flex w-[14%] justify-start p-[6px] bg-bgt rounded-[6px]">
                ${totalPrice}
              </div>
            </div>
          );
        })}
      </div>
      {/* Calculator Box */}
      <div className="flex flex-col items-center fixed right-[46px] top- w-[260px] justify-end">
        <div className="flex justify-between w-[240px] my-[10px]">
          <div className="flex justify-start">Subtotal:</div>
          <div className="flex justify-end font-semibold">${subtotal}</div>
        </div>
        <div className="flex justify-between w-[240px]">
          <div className="flex justify-start">Total Shipping:</div>
          <div className="flex justify-end font-semibold">${totalShipping}</div>
        </div>
        <div className="flex justify-between w-[240px] my-[10px]">
          <div className="flex justify-start">Total Price:</div>
          <div className="flex justify-end font-semibold">${totalPrice}</div>
        </div>
        <button
          onClick={handleCheckout}
          className="flex my-[20px] w-[240px] py-[10px] justify-center rounded-[8px] bg-mo text-bg"
        >
          Checkout
        </button>
      </div>
    </div>
  );
};

export default Cart;
