"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userInitalizer, cartInitalizer } from "@/store/slices/userSlice";

const Initalizer = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(userInitalizer());
    dispatch(cartInitalizer());
  }, [dispatch]);
  return <div></div>;
};

export default Initalizer;
