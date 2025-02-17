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
      className={`relative flex flex-col bg-bgs px-[20px] md:px-[35px] pt-[40px] md:pt-[60px] pb-[80px] md:pb-[80px] ${
        pathname.includes("/search")
          ? "hidden"
          : "w-full mt-[60px] md:mt-[120px]"
      }`}
    >
      <div className="relative flex flex-col md:flex-row w-full z-10">
        <div className="flex flex-col w-full md:w-[70%] ">
          <h2 className="text-[24px] md:text-[28px] font-bold mb-6 md:mb-8">
            Let&apos;s Connect
          </h2>

          <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6 w-full">
            {/* Footer Sections */}
            {[
              {
                title: "About",
                items: ["Company Info", "Newsroom", "Policies", "Programs"],
              },
              {
                title: "Sell",
                items: ["Start Selling", "How to Start", "Seller Policies"],
              },
              {
                title: "Buy",
                items: ["Register", "How to Buy", "Store Locator"],
              },
              {
                title: "Social",
                items: ["Instagram", "Twitter", "LinkedIn", "Blog"],
              },
              {
                title: "Contact",
                items: [
                  "info@olcart.store",
                  "+0 (000) 000-000",
                  "New York, NY",
                ],
              },
            ].map((section, index) => (
              <div key={index} className="flex flex-col gap-3">
                <h3 className="text-[14px] md:text-[16px] font-semibold text-bl mb-1">
                  {section.title}
                </h3>
                {section.items.map((item, itemIndex) => (
                  <a
                    key={itemIndex}
                    href="#"
                    className="text-[13px] text-bl/70 hover:text-mo transition-all duration-300 hover:pl-2"
                  >
                    {item}
                  </a>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* Feedback Form */}
        <div className="mt-8 md:mt-0 md:ml-8 w-full md:w-[30%]">
          <div className="md:border-l-2 md:border-mg md:pl-8 h-full">
            <h2 className="text-[18px] font-semibold mb-4 ">
              Share Your Thoughts
            </h2>
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-3 text-[14px]"
            >
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Your name (optional)"
                className="w-full h-10 px-4 rounded-lg border border-bl/20 focus:border-mo focus:ring-2 ring-mo/20 transition-all duration-300"
              />

              <input
                type="text"
                id="contact"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                placeholder="Email or phone (optional)"
                className="w-full h-10 px-4 rounded-lg border border-bl/20 focus:border-mo focus:ring-2 ring-mo/20 transition-all duration-300"
              />

              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                className="w-full h-32 px-4 py-2 rounded-lg border border-bl/20 focus:border-mo focus:ring-2 ring-mo/20 transition-all duration-300"
                placeholder="Your message..."
              />

              <button
                type="submit"
                className="w-fit px-6 h-10 bg-mo  text-white rounded-lg hover:shadow-lg transition-all duration-300 hover:scale-[1.02] font-medium"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      <div className="relative z-10 mt-12 pt-8 border-t border-bl/10">
        <p className="text-sm text-bl/70 text-center">
          &copy;{new Date().getFullYear()} All rights reserved. | Designed and
          Developed by{" "}
          <span className="font-semibold bg-gradient-to-r from-mo to-mg bg-clip-text text-transparent">
            Michael Ambel
          </span>
        </p>
      </div>
    </footer>
  );
};

export default Footer;
