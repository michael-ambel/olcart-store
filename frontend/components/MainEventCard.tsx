"use client";

import Image from "next/image";
import { FC, useEffect, useState } from "react";
import { events } from "./data";
import { motion } from "framer-motion";

const MainCard: FC = () => {
  const [currentEvent, setCurrentEvent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEvent((prev) => (prev + 1) % events.length);
    }, 6000);

    return () => clearInterval(interval);
  }, []);

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 2 } },
    exit: { opacity: 0, transition: { duration: 1 } },
  };

  const slideInTop = {
    initial: { y: -200, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { delay: 0.6, duration: 1, ease: "easeInOut" },
    },
    exit: { opacity: 0, transition: { duration: 1, ease: "easeInOut" } },
  };

  const slideInRight = {
    initial: { x: 200, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: { delay: 0.6, duration: 1, ease: "easeInOut" },
    },
    exit: {
      x: -100,
      opacity: 0,
      transition: { duration: 1, ease: "easeInOut" },
    },
  };
  return (
    <div
      className={`relative flex w-full justify-center items-center h-[348px] ${events[currentEvent].background} my-[80px] px-[84px]`}
    >
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial="initial"
          animate={currentEvent === index ? "animate" : "exit"}
          exit="exit"
          className="flex w-full "
        >
          {currentEvent === index && (
            <motion.div variants={fadeIn} className={`${event.textStyle}`}>
              <h2 className="text-[24px] font-bold ">{event.title}</h2>
              <p className="text-[18px] ">{event.description}</p>
              <button
                className={`w-[120px] h-[52px]  rounded-full ${event.buttonStyle}`}
              >
                Shop
              </button>
            </motion.div>
          )}

          {currentEvent === index && (
            <motion.div
              variants={slideInTop}
              className={`${event.image1Style}`}
            >
              <Image
                src={event.image1}
                alt=""
                width={500}
                height={500}
                className="object-cover"
              />
            </motion.div>
          )}

          {currentEvent === index && (
            <motion.div
              variants={slideInRight}
              className={`${event.image2Style}`}
            >
              <Image
                src={event.image2}
                alt=""
                width={500}
                height={500}
                className="object-cover"
              />
            </motion.div>
          )}
        </motion.div>
      ))}
    </div>
  );
};

export default MainCard;
