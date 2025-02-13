"use client";

import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { easeIn, easeOut, motion } from "framer-motion";
import { showToast } from "../ToastNotifications";

const events = [
  {
    id: 1,
    title: "Black Friday:",
    description:
      "Offer significant discounts and flash sales on a variety of products.",
    image1: "/maincard/watch.png",
    image2: "/maincard/headset.png",
  },
  {
    id: 2,
    title: "Holiday Goods",
    description: "Celebrate the season with amazing offers!",
    image1: "/maincard/vr.png",
    image2: "/maincard/phone.png",
  },
  {
    id: 3,
    title: "Summer Sale",
    description: "Enjoy summer vibes with great discounts!",
    image1: "/maincard/shirts.png",
    image2: "/maincard/jacket.png",
  },
];

const MainCard: FC = () => {
  const [currentEvent, setCurrentEvent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEvent((prev) => (prev + 1) % events.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const handleComingSoon = () => {
    showToast("success", "Get Ready, It’s Almost Here! 🎉");
  };

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 3, easeIn } },
    exit: { opacity: 0, transition: { duration: 1, easeOut } },
  };

  // Unified animations for both screens
  const slideInTop = {
    initial: { y: -100, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    exit: {
      y: -100,
      opacity: 0,
      transition: { duration: 0.5, ease: "easeIn" },
    },
  };

  const slideInRight = {
    initial: { x: 100, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: { duration: 0.8, ease: "easeOut" },
    },
    exit: {
      x: 100,
      opacity: 0,
      transition: { duration: 0.5, ease: "easeIn" },
    },
  };

  return (
    <div className="relative w-full h-[300px] overflow-y-visible overflow-x-clip mt-[120px] mb-[60px] bg-mo">
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial="initial"
          animate={currentEvent === index ? "animate" : "exit"}
          exit="exit"
          className="absolute inset-0 flex flex-col-reverse md:flex-row gap-8 px-4 md:px-[60px] pb-[30px] md:py-0"
        >
          <motion.div
            variants={fadeIn}
            className="md:w-[35%] h-[40%] md:h-full flex flex-col justify-center items-center md:items-start z-10"
          >
            <div className="max-w-[440px] mb-[50px] md:mb-0 text-center md:text-left">
              <h2 className="text-2xl md:text-3xl font-black mb-3 md:mb-6 text-white">
                {event.title}
              </h2>
              <div className="flex items-center mb-3 md:mb-6 h-[60px] justify-center md:justify-start">
                <p className="text-lg md:text-xl  text-white">
                  {event.description}
                </p>
              </div>
              <button
                onClick={handleComingSoon}
                className="w-32 h-12 rounded-full bg-bl text-white font-semibold hover:bg-opacity-90 transition-all duration-300"
              >
                Shop
              </button>
            </div>
          </motion.div>

          <div className="relative w-full md:w-[65%] h-1/2 md:h-full flex  justify-center items-center gap-4">
            <motion.div
              variants={slideInTop}
              className="absolute left-[6%] top-[-80px] w-[200px] h-[200px] md:w-[300px] md:h-[300px]"
            >
              <Image
                src={event.image1}
                alt=""
                fill
                className="object-contain"
              />
            </motion.div>

            <motion.div
              variants={slideInRight}
              className="absolute right-[6%]  md:bottom-[40px] w-[200px] h-[200px] md:w-[300px] md:h-[300px]"
            >
              <Image
                src={event.image2}
                alt=""
                fill
                className="object-contain"
              />
            </motion.div>
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default MainCard;
