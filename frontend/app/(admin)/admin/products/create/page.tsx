import ProductButtons from "@/components/admin/ProductButtons";
import ProductCreateForm from "@/components/admin/ProductCreateForm";

export default function CreateProduct() {
  return (
    <div className="flex flex-col p-[34px] mt-[130px] ml-[144px] gap-[30px] bg-bgt">
      <ProductButtons />
      <ProductCreateForm />
    </div>
  );
}
