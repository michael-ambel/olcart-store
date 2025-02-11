"use client";

import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { userInitalizer, updateCart } from "@/store/slices/userSlice";
import { useGetUserCartQuery } from "@/store/apiSlices/userApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

const Initalizer = () => {
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch();
  const { data: userCart } = useGetUserCartQuery(undefined, {
    skip: !user,
  });

  useEffect(() => {
    dispatch(userInitalizer());
  }, [dispatch]);

  useEffect(() => {
    if (userCart) {
      dispatch(updateCart(userCart));
    }
  }, [userCart, dispatch]);
  return <div></div>;
};

export default Initalizer;
