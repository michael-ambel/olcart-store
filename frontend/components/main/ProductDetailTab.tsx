"use client";

import React, { useEffect, useState } from "react";
import { IBuyer, Product, TabKey } from "@/store/types/productTypes";
import {
  useCreateOrUpdateQuestionAndFeedbackMutation,
  useCreateOrUpdateReviewMutation,
} from "@/store/apiSlices/productApiSlice";
import { showToast } from "../ToastNotifications";
import Image from "next/image";
import { useSelector } from "react-redux";
import { RootState } from "@/store/store";

interface TabsSectionProps {
  product: Product;
}

const TabsSection: React.FC<TabsSectionProps> = ({ product }) => {
  const [activeTab, setActiveTab] = useState<TabKey>("description");
  const [reviewInput, setReviewInput] = useState({
    rating: 0,
    comment: "",
  });
  const [qandfInput, setQandfInput] = useState({
    message: "",
    type: "question",
  });

  const [reviewd, setReviewd] = useState(false);
  const [replayTo, setReplayTo] = useState<string>("");

  const user = useSelector((state: RootState) => state.user.user);
  const tstar: number[] = [1, 2, 3, 4, 5];

  const [createOrUpdateReview] = useCreateOrUpdateReviewMutation();
  const [createOrUpdateQandF] = useCreateOrUpdateQuestionAndFeedbackMutation();

  useEffect(() => {
    const buyer = product.buyers?.find((buyer) => buyer._id === user?._id);
    if (buyer && buyer.reviews?.isReviewed === true) {
      setReviewd(true);
    } else {
      setReviewd(false);
    }
  }, [product, user]);

  const handleReply = (parentId: string) => {
    // Toggle the reply box
    if (replayTo === parentId) {
      setReplayTo(""); // Close the reply box
    } else {
      setQandfInput({
        message: "",
        type: "replay",
      });
      setReplayTo(parentId);
    }
  };

  const handleAddReview = async () => {
    try {
      if (!reviewInput.rating || !reviewInput.comment) {
        showToast("error", "Please fill in both rating and comment fields.");
        return;
      }

      if (!user?.name) {
        showToast(
          "error",
          "You have to login and purchase the product to add a review"
        );
        return;
      }

      console.log(
        product._id,
        user?.name,
        reviewInput.rating,
        reviewInput.comment
      );
      await createOrUpdateReview({
        productId: product._id,
        username: user?.name,
        rating: reviewInput.rating,
        comment: reviewInput.comment,
      }).unwrap();

      showToast("success", "Review submitted successfully!");
      setReviewInput({ rating: 0, comment: "" }); // Reset form
    } catch (error) {
      showToast(
        "error",
        `${
          (error as { data?: { message: { message?: string } } })?.data?.message
            .message || "An error occurred while submitting the review."
        }`
      );
    }
  };

  const handleAddQandF = async () => {
    try {
      if (!qandfInput.message || !qandfInput.type) {
        showToast(
          "error",
          "Please fill in the message field and select a type."
        );
        return;
      }

      if (!user?.name) {
        showToast("error", "You have to login to add Question/Feedback");
        return;
      }

      await createOrUpdateQandF({
        productId: product._id,
        username: user?.name,
        message: qandfInput.message,
        type: qandfInput.type as "question" | "feedback" | "replay",
        replyTo: replayTo,
      }).unwrap();
      showToast("success", "Submitted successfully!");
      setQandfInput({ message: "", type: "question" });
    } catch (error) {
      if (error) {
        showToast(
          "error",
          "Failed to submit question/feedback. Please try again."
        );
      }
    }
  };

  const tabs: Record<TabKey, React.ReactNode> = {
    reviews: (
      <div>
        {product.buyers?.length ? (
          <ul>
            {product.buyers.map((buyer: IBuyer, index: number) => (
              <li key={index} className="mb-4">
                <p className="font-semibold">{buyer.username}</p>

                <div className="flex justify-between w-[120px] my-[8px]">
                  {tstar.map((ts, i) => {
                    const s = buyer.reviews?.rating || 0;
                    const src: string =
                      s >= ts
                        ? "/icons/fstar.svg"
                        : ts - 1 < s && s < ts
                        ? "/icons/hstar.svg"
                        : "/icons/zstar.svg";

                    return (
                      <div key={i} className="w-[18px] ">
                        <Image
                          src={src}
                          alt=""
                          width={500}
                          height={500}
                          className="w-[18px]"
                        />
                      </div>
                    );
                  })}
                </div>
                <p className="text-gray-600">{buyer.reviews?.comment}</p>
                <p className="text-sm text-gray-400">
                  {buyer.reviews
                    ? new Date(
                        buyer.reviews.updatedAt || buyer.reviews.createdAt
                      ).toLocaleDateString()
                    : "No review date"}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No reviews yet.</p>
        )}

        {/* Add Review Form */}
        <div className="p-[20px] mt-[40px] border-[2px] border-bl rounded-[10px]">
          <h3 className="text-lg font-semibold">
            {reviewd ? "Update My Review" : "Add Your Review"}
          </h3>
          <div className="flex flex-col gap-[8px] my-[10px]">
            <label className="block font-medium">Rating</label>
            <div className="flex gap-[10px]">
              {tstar.map((star) => {
                const src =
                  reviewInput.rating >= star
                    ? "/icons/fstar.svg"
                    : "/icons/zstar.svg";

                return (
                  <button
                    key={star}
                    onClick={() =>
                      setReviewInput({ ...reviewInput, rating: star })
                    }
                    className="w-[30px] h-[30px]"
                  >
                    <Image
                      src={src}
                      alt={`Star ${star}`}
                      width={500}
                      height={500}
                      className="w-[30px]"
                    />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex flex-col gap-[8px] mt-[20px]">
            <label className="block font-medium">Comment</label>
            <textarea
              value={reviewInput.comment}
              onChange={(e) =>
                setReviewInput({ ...reviewInput, comment: e.target.value })
              }
              className="border p-2 rounded w-full"
              rows={4}
            ></textarea>
          </div>
          <button
            onClick={handleAddReview}
            className="mt-4 bg-mo text-white px-4 py-2 rounded"
          >
            Submit Review
          </button>
        </div>
      </div>
    ),
    description: <p>{product.description}</p>,
    specifications: (
      <ul>
        {product.specifications?.map((spec: string, index: number) => (
          <li key={index}>{spec}</li>
        ))}
      </ul>
    ),
    qandf: (
      <div>
        {product.questionsAndFeedback?.length ? (
          <ul>
            {product.questionsAndFeedback
              .slice()
              .reverse()
              .map((qf, index) => (
                <li key={index} className="mb-4">
                  <p className="font-semibold">{qf.username}</p>

                  <div className="flex">
                    <p className=" text-mo font-bold w-[30px]">
                      {qf.type === "question" ? "Q" : "F"}
                    </p>
                    <div className="flex-1">
                      <p className="text-gray-600">{qf.message}</p>
                      <div className="flex justify-between">
                        {qf.type !== "replay" && (
                          <button
                            onClick={() => qf._id && handleReply(qf._id)}
                            className="my-[12px] p-[6px] text-[14px] border-[1px] rounded-full border-mg text-mg font-bold"
                          >
                            Add Reply
                          </button>
                        )}
                        <p className="text-sm text-gray-400">
                          {new Date(
                            qf.createdAt ? qf.createdAt : ""
                          ).toLocaleDateString()}
                        </p>
                      </div>

                      {replayTo === qf._id && (
                        <div className="flex items-end justify-between gap-[14px] my-[20px]">
                          <textarea
                            value={qandfInput.message}
                            onChange={(e) =>
                              setQandfInput({
                                ...qandfInput,
                                message: e.target.value,
                              })
                            }
                            className="border p-2 rounded flex-1"
                            rows={3}
                          />
                          <button
                            onClick={handleAddQandF}
                            className="mt-2 bg-mg text-white px-4 py-2 h-[40px] rounded-full"
                          >
                            Submit
                          </button>
                        </div>
                      )}
                      {qf.replies && (
                        <div className="grid grid-cols-3 gap-[16px]">
                          {qf.replies
                            .slice()
                            .reverse()
                            .map((replay, index) => (
                              <div key={index}>
                                <div className="flex flex-col justify-between">
                                  <p className="font-semibold">
                                    {replay.username}
                                  </p>

                                  <p className="text-sm text-gray-400 my-[6px]">
                                    {new Date(
                                      replay.createdAt && replay.createdAt
                                    ).toDateString()}
                                  </p>
                                </div>
                                <p className="text-[15px]">{replay.message}</p>
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        ) : (
          <p>No questions or feedback yet.</p>
        )}

        {/* Add Question/Feedback Form */}
        <div className="mt-6">
          <h3 className="text-lg font-semibold">
            Ask a Question or Leave Feedback
          </h3>
          <div className="flex gap-[20px]">
            <div className="mt-2">
              <label className="block font-medium">Type</label>
              <select
                value={qandfInput.type}
                onChange={(e) =>
                  setQandfInput({ ...qandfInput, type: e.target.value })
                }
                className="border p-2 rounded w-full"
              >
                <option value="question">Question</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>
            <div className="flex-1">
              <div className="mt-2 ">
                <label className="block  font-medium">Message</label>
                <textarea
                  value={qandfInput.message}
                  onChange={(e) =>
                    setQandfInput({ ...qandfInput, message: e.target.value })
                  }
                  className="border p-2 rounded w-full"
                  rows={4}
                ></textarea>
              </div>
              <button
                onClick={handleAddQandF}
                className="mt-4 bg-mg text-white px-4 py-2 rounded-full"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      </div>
    ),
    store: <p>{product.storeDetails || "Not available"}</p>,
  };

  const tabLabels: Record<TabKey, string> = {
    description: "Product Description",
    specifications: "Specifications",
    reviews: `Customer Reviews (${product.buyers?.length || 0})`,
    store: "Store Information",
    qandf: "Question / Feedback",
  };

  return (
    <div>
      <div className="flex justify-around mt-[70px]">
        {Object.keys(tabs).map((tab) => (
          <button
            key={tab}
            className={`px-1 py-2 font-medium ${
              activeTab === tab ? "border-b-[4px] border-mo" : ""
            }`}
            onClick={() => setActiveTab(tab as TabKey)}
          >
            {tabLabels[tab as TabKey]}
          </button>
        ))}
      </div>

      <div className="mt-4 p-4 bg-bgt rounded-[4px] min-h-[400px]">
        {tabs[activeTab]}
      </div>
    </div>
  );
};

export default TabsSection;
