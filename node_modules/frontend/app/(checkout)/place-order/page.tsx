import CheckOutProgress from "@/components/checkout/CheckOutProgress";

export default function Home() {
  return (
    <div>
      <main className="flex flex-col z-10 mt-[20px] mx-[84px] items-center ">
        <CheckOutProgress
          cart={true}
          shippingInfo={true}
          paymentMethod={true}
          placeOrder={true}
          success={false}
        />
      </main>
    </div>
  );
}
