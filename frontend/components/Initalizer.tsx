"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userInitalizer, updateCart } from "@/store/slices/userSlice";
import { useGetUserCartQuery } from "@/store/apiSlices/userApiSlice";

const Initalizer = () => {
  const dispatch = useDispatch();

  const { data } = useGetUserCartQuery();

  useEffect(() => {
    dispatch(userInitalizer());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      dispatch(updateCart(data));
    }
  }, [data, dispatch]);
  return <div></div>;
};

export default Initalizer;
