"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { events } from "../data";

const EventCard = () => {
  const [currentEvent, setCurrentEvent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentEvent((prev) => (prev + 1) % events.length);
    }, 6000); // Each event lasts for 6 seconds
    return () => clearInterval(interval);
  }, []);

  const fadeIn = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 1 } },
    exit: { opacity: 0, transition: { duration: 1, ease: "easeInOut" } },
  };

  const slideInTop = {
    initial: { y: -100, opacity: 0 },
    animate: {
      y: 0,
      opacity: 1,
      transition: { delay: 1, duration: 1, ease: "easeInOut" },
    },
    exit: {
      opacity: 0,
      transition: { duration: 1, ease: "easeInOut" },
    },
  };

  const slideInRight = {
    initial: { x: 100, opacity: 0 },
    animate: {
      x: 0,
      opacity: 1,
      transition: { delay: 1, duration: 1, ease: "easeInOut" },
    },
    exit: {
      x: -100,
      opacity: 1,
      transition: { duration: 1, ease: "easeInOut" },
    },
  };

  return (
    <div
      className={`relative w-full h-[400px] overflow-hidden flex justify-center items-center ${
        events[currentEvent]?.background || ""
      }`}
    >
      {events.map((event, index) => (
        <motion.div
          key={event.id}
          initial="initial"
          animate={currentEvent === index ? "animate" : "exit"}
          exit="exit"
          transition={{ duration: 1 }}
          className={`absolute w-full h-full flex justify-between items-center p-6`}
        >
          {/* Text and Button */}
          {currentEvent === index && (
            <motion.div
              variants={fadeIn}
              className="flex-1 text-left space-y-4 max-w-sm text-white"
            >
              <h2 className="text-4xl font-bold">{event.title}</h2>
              <p className="text-lg">{event.description}</p>
              <button className="px-4 py-2 bg-white text-black rounded-lg">
                Shop Now
              </button>
            </motion.div>
          )}

          {/* Image 1 */}
          {currentEvent === index && (
            <motion.div
              variants={slideInTop}
              className={`absolute ${event.image1Style}`}
            >
              <Image
                src={event.image1}
                alt={event.title}
                width={500}
                height={500}
                className="object-cover"
              />
            </motion.div>
          )}

          {/* Image 2 */}
          {currentEvent === index && (
            <motion.div
              variants={slideInRight}
              className={`absolute ${event.image2Style}`}
            >
              <Image
                src={event.image2}
                alt={event.title}
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

export default EventCard;
