import CheckOutProgress from "@/components/checkout/CheckOutProgress";
import ShippingAddress from "@/components/checkout/ShippingAddress";

export default function Home() {
  return (
    <div>
      <main className="flex flex-col z-10 mt-[20px] mx-[84px] items-center ">
        <CheckOutProgress
          cart={true}
          shippingInfo={true}
          paymentMethod={false}
          processing={false}
          processed={false}
        />
        <ShippingAddress />
      </main>
    </div>
  );
}
