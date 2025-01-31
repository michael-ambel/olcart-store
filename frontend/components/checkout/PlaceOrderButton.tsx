import { usePlaceOrderMutation } from "@/store/apiSlices/orderApiSlice";
import { RootState } from "@/store/store";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { showToast } from "../ToastNotifications";

const PlaceOrderButton = () => {
  const [placeOrder] = usePlaceOrderMutation();
  const currentOrder = useSelector((state: RootState) => state.order);

  const router = useRouter();

  const handlePlaceOrder = async () => {
    const { currentItems, currentAddress } = currentOrder;
    if (!currentItems || currentItems.length === 0) {
      showToast("error", "No Selected Cart/Cart is empty!");
      return;
    }
    if (!currentAddress) {
      showToast("success", "Please provide a shipping address.");
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
    } catch (error: unknown) {
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
