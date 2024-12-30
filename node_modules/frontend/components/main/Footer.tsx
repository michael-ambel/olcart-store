"use client"; // Ensure this component is client-side

import { FC, useState } from "react";

type FeedbackFormData = {
  name: string;
  contact: string;
  message: string;
};

const Footer: FC = () => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: "",
    contact: "",
    message: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ): void => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    try {
      console.log("Form submitted", formData);
      alert("Thank you for your feedback!");
      setFormData({ name: "", contact: "", message: "" }); // Reset form
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <footer className="w-full px-[84px] my-[80px]">
      <div className="flex flex-col w-full bg-bgs px-[35px] py-[20px]">
        <h2 className="text-[24px] font-bold my-[20px]">Lets connect...</h2>
        <div className="flex justify-between w-full">
          <div className="flex flex-col gap-[6px] text-[14px]">
            <h3 className="text-[16px] font-bold mb-[4px]">
              About olcart.store
            </h3>
            <p>company info</p>
            <p>news</p>
            <p>policies</p>
            <p>programs</p>
          </div>

          <div className="flex flex-col gap-[6px] text-[14px]">
            <h3 className="text-[16px] font-bold mb-[4px]">Sell</h3>
            <p>start selling</p>
            <p>how to start</p>
            <p>policies</p>
          </div>

          <div className="flex flex-col gap-[6px] text-[14px]">
            <h3 className="text-[16px] font-bold mb-[4px]">Buy</h3>
            <p>register</p>
            <p>how to buy</p>
            <p>stores</p>
          </div>

          <div className="flex flex-col gap-[6px] text-[14px]">
            <h3 className="text-[16px] font-bold mb-[4px]">Social links</h3>
            <p>facebook</p>
            <p>twitter</p>
            <p>blogs</p>
          </div>

          <div className="flex flex-col gap-[6px] text-[14px]">
            <h3 className="text-[16px] font-bold mb-[4px]">Contacts</h3>
            <p>info@olcart.store</p>
            <p>phone</p>
            <p>address</p>
          </div>

          <div className="w-[300px]">
            <h2 className="text-[16px] font-bold mb-[4px]">
              We value your feedback
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col items-end gap-[10px] text-[14px]"
            >
              <input
                type="name"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Name - optional"
                className=" w-[300px] h-[30px] px-[10px] rounded-[10px] border border-bl focus:no-underline"
              />

              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Email or Phone - optional"
                className=" w-[300px] h-[30px] px-[10px] rounded-[10px] border border-bl focus:no-underline"
              />

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className=" w-[300px] h-[100px] px-[10px] rounded-[10px] border border-bl focus:no-underline"
                placeholder="Message..."
              />
              <button
                type="submit"
                className="w-[110px] h-[30px] bg-mo text-white rounded-[10px]"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
