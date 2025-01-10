import { usePlaceOrderMutation } from "@/store/apiSlices/orderApiSlice";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";

const PlaceOrderButton = () => {
  const [placeOrder, { isLoading: placeOrderLoading }] =
    usePlaceOrderMutation();
  const currentOrder = useSelector((state: RootState) => state.order);

  const router = useRouter();

  const handlePlaceOrder = async () => {
    const { currentItems, currentAddress } = currentOrder;
    if (!currentItems || currentItems.length === 0) {
      alert("Cart is empty!");
      return;
    }
    if (!currentAddress) {
      alert("Please provide a shipping address.");
      return;
    }

    try {
      const orderData = {
        items: currentItems,
        shippingAddress: currentAddress,
      };

      await placeOrder(orderData).unwrap();
      alert("Order placed successfully!");
      setTimeout(() => router.push("/payment-method"), 2000);
    } catch (error: any) {
      console.error("Failed to place order:", error);
    }
  };
  return (
    <div>
      <button
        onClick={handlePlaceOrder}
        className="mb-4 px-[26px] py-2 bg-mo text-white rounded-full"
      >
        Create order
      </button>
    </div>
  );
};

export default PlaceOrderButton;
