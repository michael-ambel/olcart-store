import Cart from "@/components/checkout/Cart";
import CheckOutProgress from "@/components/checkout/CheckOutProgress";

export default function Home() {
  return (
    <div>
      <main className="flex flex-col z-10 mt-[20px]  items-center ">
        <CheckOutProgress
          cart={true}
          shippingInfo={false}
          paymentMethod={false}
          processing={false}
          processed={false}
        />
        <Cart />
      </main>
    </div>
  );
}
