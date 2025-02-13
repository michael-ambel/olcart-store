"use client";

import { usePathname } from "next/navigation";
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

  const pathname = usePathname();

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
      setFormData({ name: "", contact: "", message: "" });
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <footer
      className={`flex flex-col bg-bgs px-[20px] md:px-[35px] pt-[40px] md:pt-[60px] pb-[80px] md:pb-[80px]${
        pathname.includes("/search")
          ? "hidden"
          : "w-full mt-[60px] md:mt-[120px]"
      }`}
    >
      <div className="flex flex-col md:flex-row w-full">
        <div className="flex flex-col w-full md:w-[70%] ">
          <h2 className="text-[20px] md:text-[24px] font-bold mb-[20px] md:mb-[30px]">
            Lets connect...
          </h2>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full">
            {/* Footer Sections */}
            <div className="flex flex-col gap-2 text-[14px]">
              <h3 className="text-[14px] md:text-[16px] font-bold">About</h3>
              <p>company info</p>
              <p>news</p>
              <p>policies</p>
              <p>programs</p>
            </div>

            <div className="flex flex-col gap-2 text-[14px]">
              <h3 className="text-[14px] md:text-[16px] font-bold">Sell</h3>
              <p>start selling</p>
              <p>how to start</p>
              <p>policies</p>
            </div>

            <div className="flex flex-col gap-2 text-[14px]">
              <h3 className="text-[14px] md:text-[16px] font-bold">Buy</h3>
              <p>register</p>
              <p>how to buy</p>
              <p>stores</p>
            </div>

            <div className="flex flex-col gap-2 text-[14px]">
              <h3 className="text-[14px] md:text-[16px] font-bold">
                Social links
              </h3>
              <p>facebook</p>
              <p>twitter</p>
              <p>blogs</p>
            </div>

            <div className="flex flex-col gap-2 text-[14px]">
              <h3 className="text-[14px] md:text-[16px] font-bold">Contacts</h3>
              <p>info@olcart.store</p>
              <p>phone</p>
              <p>address</p>
            </div>
          </div>
        </div>
        {/* Feedback Form - spans 2 columns on large screens */}
        <div className="mt-4 md:mt-0 w-full md:w-[30%]">
          <h2 className=":text-[16px] font-bold mb-2">
            We value your feedback
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-1 text-[14px] "
          >
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Name - optional"
              className="w-full h-[26px] px-3 rounded-lg border border-bl"
            />

            <input
              type="text"
              id="contact"
              name="contact"
              value={formData.contact}
              onChange={handleChange}
              placeholder="Email or Phone - optional"
              className="w-full h-[26px] px-3 rounded-lg border border-bl"
            />

            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="w-full h-[100px] px-3 rounded-lg border border-bl"
              placeholder="Message..."
            />

            <button
              type="submit"
              className=" w-[110px] h-[30px] bg-mo text-white rounded-lg"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      <p className="text-sm mt-[60px]">
        &copy;{new Date().getFullYear()} All rights reserved. | Designed &
        Developed by <span className="font-semibold">Michael Ambel</span>
      </p>
    </footer>
  );
};

export default Footer;
