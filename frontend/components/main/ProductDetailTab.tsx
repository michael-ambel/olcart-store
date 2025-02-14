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
    if (replayTo === parentId) {
      setReplayTo("");
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

      await createOrUpdateReview({
        productId: product._id,
        username: user?.name,
        rating: reviewInput.rating,
        comment: reviewInput.comment,
      }).unwrap();

      showToast("success", "Review submitted successfully!");
      setReviewInput({ rating: 0, comment: "" });
    } catch {
      showToast("error", "An error occurred while submitting the review.");
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
      <div className="space-y-6">
        {product.buyers?.length ? (
          <ul className="space-y-4">
            {product.buyers.map((buyer: IBuyer, index: number) => (
              <li
                key={index}
                className="p-6 bg-white rounded-2xl shadow-sm border border-bl/5"
              >
                <p className="font-semibold text-lg text-bl">
                  {buyer.username}
                </p>
                <div className="flex gap-2 my-3">
                  {tstar.map((ts, i) => {
                    const s = buyer.reviews?.rating || 0;
                    const src =
                      s >= ts
                        ? "/icons/fstar.svg"
                        : ts - 1 < s && s < ts
                          ? "/icons/hstar.svg"
                          : "/icons/zstar.svg";
                    return (
                      <div key={i} className="w-6 h-6">
                        <Image
                          src={src}
                          alt=""
                          width={24}
                          height={24}
                          className="w-full h-full"
                        />
                      </div>
                    );
                  })}
                </div>
                <p className="text-bl/90">{buyer.reviews?.comment}</p>
                <p className="text-sm text-bl/50 mt-2">
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
          <p className="text-bl/50">No reviews yet.</p>
        )}

        {/* Add Review Form */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-bl/5">
          <h3 className="text-xl font-bold text-bl mb-6">
            {reviewd ? "Update My Review" : "Add Your Review"}
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block font-medium text-bl mb-3">Rating</label>
              <div className="flex gap-3">
                {tstar.map((star) => (
                  <button
                    key={star}
                    onClick={() =>
                      setReviewInput({ ...reviewInput, rating: star })
                    }
                    className="w-6 h-6 transition-transform hover:scale-110"
                  >
                    <Image
                      src={
                        reviewInput.rating >= star
                          ? "/icons/fstar.svg"
                          : "/icons/zstar.svg"
                      }
                      alt={`Star ${star}`}
                      width={40}
                      height={40}
                      className="w-full h-full"
                    />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block font-medium text-bl mb-3">Comment</label>
              <textarea
                value={reviewInput.comment}
                onChange={(e) =>
                  setReviewInput({ ...reviewInput, comment: e.target.value })
                }
                className="w-full p-4 border border-bl/20 rounded-xl bg-bl/5 focus:ring-2 focus:ring-mo"
                rows={4}
              />
            </div>
            <button
              onClick={handleAddReview}
              className="w-full bg-mo text-white py-4 rounded-xl font-bold hover:bg-mo/90 transition-all"
            >
              Submit Review
            </button>
          </div>
        </div>
      </div>
    ),
    description: (
      <p className="text-bl/90 text-lg leading-relaxed">
        {product.description}
      </p>
    ),
    specifications: (
      <ul className="space-y-3 pl-5">
        {product.specifications?.map((spec: string, index: number) => (
          <li
            key={index}
            className="text-bl/90 relative pl-5 before:content-['•'] before:text-mo before:absolute before:left-0"
          >
            {spec}
          </li>
        ))}
      </ul>
    ),
    qandf: (
      <div className="space-y-6">
        {product.questionsAndFeedback?.length ? (
          <ul className="space-y-4">
            {product.questionsAndFeedback
              .slice()
              .reverse()
              .map((qf, index) => (
                <li
                  key={index}
                  className="p-6 bg-white rounded-2xl shadow-sm border border-bl/5"
                >
                  <p className="font-semibold text-lg text-bl">{qf.username}</p>
                  <div className="flex items-start gap-4 mt-3">
                    <div
                      className={`w-8 h-8 flex items-center justify-center rounded-lg ${
                        qf.type === "question" ? "bg-mo/10" : "bg-mg/10"
                      }`}
                    >
                      <p
                        className={`text-sm font-bold ${
                          qf.type === "question" ? "text-mo" : "text-mg"
                        }`}
                      >
                        {qf.type === "question" ? "Q" : "F"}
                      </p>
                    </div>
                    <div className="flex-1">
                      <p className="text-bl/90">{qf.message}</p>
                      <div className="flex justify-between items-center mt-4">
                        {qf.type !== "replay" && (
                          <button
                            onClick={() => qf._id && handleReply(qf._id)}
                            className="px-4 py-2 text-sm bg-bl/5 text-bl rounded-full hover:bg-bl/10 transition-colors"
                          >
                            Add Reply
                          </button>
                        )}
                        <p className="text-sm text-bl/50">
                          {new Date(qf.createdAt || "").toLocaleDateString()}
                        </p>
                      </div>

                      {replayTo === qf._id && (
                        <div className="mt-6">
                          <textarea
                            value={qandfInput.message}
                            onChange={(e) =>
                              setQandfInput({
                                ...qandfInput,
                                message: e.target.value,
                              })
                            }
                            className="w-full p-4 border border-bl/20 rounded-xl bg-bl/5 focus:ring-2 focus:ring-mo"
                            rows={3}
                            placeholder="Write your reply..."
                          />
                          <button
                            onClick={handleAddQandF}
                            className="mt-4 bg-mo text-white px-6 py-3 rounded-xl font-medium hover:bg-mo/90 transition-colors"
                          >
                            Submit Reply
                          </button>
                        </div>
                      )}

                      {qf.replies && (
                        <div className="mt-6 space-y-4">
                          {qf.replies
                            .slice()
                            .reverse()
                            .map((replay, index) => (
                              <div
                                key={index}
                                className="p-4 bg-bl/5 rounded-xl border border-bl/10"
                              >
                                <div className="flex items-center gap-3">
                                  <p className="font-medium text-bl">
                                    {replay.username}
                                  </p>
                                  <p className="text-sm text-bl/50">
                                    {new Date(
                                      replay.createdAt || ""
                                    ).toDateString()}
                                  </p>
                                </div>
                                <p className="mt-2 text-bl/90">
                                  {replay.message}
                                </p>
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
          <p className="text-bl/50">No questions or feedback yet.</p>
        )}

        {/* Add Question/Feedback Form */}
        <div className="p-6 bg-white rounded-2xl shadow-sm border border-bl/5">
          <h3 className="text-xl font-bold text-bl mb-6">
            Ask a Question or Leave Feedback
          </h3>
          <div className="space-y-6">
            <div>
              <label className="block font-medium text-bl mb-3">Type</label>
              <select
                value={qandfInput.type}
                onChange={(e) =>
                  setQandfInput({ ...qandfInput, type: e.target.value })
                }
                className="w-full p-3 border border-bl/20 rounded-xl bg-bl/5 focus:ring-2 focus:ring-mo"
              >
                <option value="question">Question</option>
                <option value="feedback">Feedback</option>
              </select>
            </div>
            <div>
              <label className="block font-medium text-bl mb-3">Message</label>
              <textarea
                value={qandfInput.message}
                onChange={(e) =>
                  setQandfInput({ ...qandfInput, message: e.target.value })
                }
                className="w-full p-4 border border-bl/20 rounded-xl bg-bl/5 focus:ring-2 focus:ring-mo"
                rows={4}
                placeholder="Type your message here..."
              />
            </div>
            <button
              onClick={handleAddQandF}
              className="w-full bg-mo text-white py-4 rounded-xl font-bold hover:bg-mo/90 transition-all"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    ),
    store: (
      <p className="text-bl/90 text-lg">
        {product.storeDetails || "Store information not available"}
      </p>
    ),
  };

  const tabLabels: Record<TabKey, string> = {
    description: "Product Description",
    specifications: "Specifications",
    reviews: `Customer Reviews (${product.buyers?.length || 0})`,
    store: "Store Information",
    qandf: "Question / Feedback",
  };

  return (
    <div className="mt-12">
      <div className="flex flex-wrap gap-2 justify-center border-b border-bl/10">
        {Object.keys(tabs).map((tab) => (
          <button
            key={tab}
            className={`px-5 py-3 text-sm sm:text-base font-medium rounded-t-xl transition-colors ${
              activeTab === tab
                ? "bg-mo text-white shadow-lg"
                : "text-bl/70 hover:bg-bl/5"
            }`}
            onClick={() => setActiveTab(tab as TabKey)}
          >
            {tabLabels[tab as TabKey]}
          </button>
        ))}
      </div>

      <div className="mt-2 p-6 bg-white rounded-2xl shadow-sm border border-bl/5">
        {tabs[activeTab]}
      </div>
    </div>
  );
};

export default TabsSection;
