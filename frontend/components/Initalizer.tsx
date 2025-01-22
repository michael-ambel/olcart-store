"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userInitalizer, updateCart } from "@/store/slices/userSlice";
import { useGetUserCartQuery } from "@/store/apiSlices/userApiSlice";

const Initalizer = () => {
  const dispatch = useDispatch();

  const { data, isLoading, error } = useGetUserCartQuery();

  useEffect(() => {
    dispatch(userInitalizer());
  }, [dispatch]);

  useEffect(() => {
    if (data) {
      dispatch(updateCart(data));
    }
  }, [data]);
  return <div></div>;
};

export default Initalizer;
