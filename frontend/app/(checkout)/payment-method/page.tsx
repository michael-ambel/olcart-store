import CheckOutProgress from "@/components/checkout/CheckOutProgress";
import PaymentPage from "@/components/checkout/PaymentPage";

export default function Home() {
  return (
    <div>
      <main className="flex flex-col z-10 mt-[20px] mx-[0px] items-center ">
        <CheckOutProgress
          cart={true}
          shippingInfo={true}
          paymentMethod={false}
          processing={false}
          processed={false}
        />
        <PaymentPage />
      </main>
    </div>
  );
}
