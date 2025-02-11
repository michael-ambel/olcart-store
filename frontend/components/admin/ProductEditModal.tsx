"use client";

import React, { useState, useEffect } from "react";
import { useUpdateProductMutation } from "@/store/apiSlices/productApiSlice";
import { CategoryTree } from "@/store/types/categoryTypes";
import { Product } from "@/store/types/productTypes";
import { useGetCategoriesQuery } from "@/store/apiSlices/categoryApiSlice";
import Image from "next/image";
import { showToast } from "../ToastNotifications";

const ProductEditModal = ({
  product,
  onClose,
}: {
  product: Product;
  onClose: () => void;
}) => {
  const [name, setName] = useState(product.name);
  const [description, setDescription] = useState(product.description);
  const [price, setPrice] = useState<number | "">(product.price);
  const [shippingPrice, setShippingPrice] = useState<number | "">(
    product.shippingPrice,
  );
  const [discountPrice, setDiscountPrice] = useState<number | "">(
    product.discountPrice || "",
  );
  const [stock, setStock] = useState<number | "">(product.stock);
  const [tags, setTags] = useState<string[]>(product.tags || []);
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>(
    product.images as string[],
  );
  const [categoriesData, setCategoriesData] = useState<CategoryTree[]>([]);
  const [selectedPath, setSelectedPath] = useState<CategoryTree[]>([]);

  const { data: categories } = useGetCategoriesQuery();
  const [updateProduct] = useUpdateProductMutation();

  useEffect(() => {
    if (categories) setCategoriesData(categories);
  }, [categories]);

  useEffect(() => {
    if (categoriesData.length > 0 && product.category) {
      const buildCategoryPath = () => {
        const path: CategoryTree[] = [];
        let currentCategories: CategoryTree[] | undefined = categoriesData;

        product.category.forEach((cat) => {
          const foundCategory = currentCategories?.find((c) => c._id === cat);

          if (foundCategory) {
            path.push(foundCategory);
            currentCategories = foundCategory.subCategories;
          }
        });

        setSelectedPath(path);
      };
      buildCategoryPath();
    }
  }, [categoriesData, product.category]);

  const findCategoryById = (
    categories: CategoryTree[] | undefined,
    id: string,
  ): CategoryTree | undefined => {
    if (!categories) return undefined;
    for (const category of categories) {
      if (category._id === id) return category;
      if (category.subCategories) {
        const found = findCategoryById(category.subCategories, id);
        if (found) return found;
      }
    }
    return undefined;
  };

  const handleSelectionChange = (level: number, id: string) => {
    const updatedPath = selectedPath.slice(0, level);
    const category = findCategoryById(
      level === 0 ? categoriesData : selectedPath[level - 1]?.subCategories,
      id,
    );

    if (category) {
      setSelectedPath([...updatedPath, category]);
    } else {
      setSelectedPath(updatedPath);
    }
  };

  const renderSelectors = () => {
    const allSelectors = [];

    for (let level = 0; level <= selectedPath.length; level++) {
      const categories =
        level === 0
          ? categoriesData
          : selectedPath[level - 1]?.subCategories || [];

      if (!categories || categories.length === 0) break;

      allSelectors.push(
        <select
          key={`category-level-${level}-${selectedPath[level]?._id || "root"}`}
          value={selectedPath[level]?._id || ""}
          onChange={(e) => handleSelectionChange(level, e.target.value)}
          className="w-auto border-2 border-mb/30 rounded-lg p-2 mb-2 focus:border-mb focus:border-2"
        >
          <option value="">Select</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>,
      );
    }

    return allSelectors;
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files) {
      setImages((prevImages) => [...prevImages, ...Array.from(files)]);
      setImagePreviews((prevPreviews) => [
        ...prevPreviews,
        ...Array.from(files).map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const handleRemoveImage = (index: number) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
    setImagePreviews((prevPreviews) =>
      prevPreviews.filter((_, i) => i !== index),
    );
  };

  const handleTagAdd = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Enter") {
      const inputValue = (event.target as HTMLInputElement).value.trim();
      if (inputValue) {
        event.preventDefault();
        setTags((prevTags) => [...prevTags, inputValue]);
        (event.target as HTMLInputElement).value = "";
      }
    }
  };

  const handleTagRemove = (tagToRemove: string) => {
    setTags((prevTags) => prevTags.filter((tag) => tag !== tagToRemove));
  };

  const hasChanged = (field: keyof Product) => {
    const originalValue = product[field];
    const newValue =
      field === "tags"
        ? tags
        : field === "category"
          ? selectedPath.map((c) => c._id)
          : field === "price"
            ? price
            : field === "shippingPrice"
              ? shippingPrice
              : field === "discountPrice"
                ? discountPrice
                : field === "stock"
                  ? stock
                  : field === "name"
                    ? name
                    : description;

    return JSON.stringify(newValue) !== JSON.stringify(originalValue);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !description || price === "" || stock === "") {
      showToast("error", "Please fill in all required fields.");
      return;
    }

    const formData = new FormData();

    if (hasChanged("name")) formData.append("name", name);
    if (hasChanged("description")) formData.append("description", description);
    if (hasChanged("price")) formData.append("price", price.toString());
    if (hasChanged("shippingPrice"))
      formData.append("shippingPrice", shippingPrice.toString());
    if (hasChanged("stock")) formData.append("stock", stock.toString());
    if (hasChanged("discountPrice") && discountPrice !== "")
      formData.append("discountPrice", discountPrice.toString());

    if (hasChanged("tags")) formData.append("tags", JSON.stringify(tags));
    if (hasChanged("category")) {
      selectedPath.forEach((category) =>
        formData.append("category", category._id),
      );
    }

    images.forEach((image) => formData.append("images", image));

    try {
      await updateProduct({ id: product._id, data: formData }).unwrap();
      showToast("success", "Product updated successfully!");
      onClose();
    } catch {
      showToast("error", "Failed to update product!");
    }
  };

  return (
    <div className="z-50 fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-mb">Edit Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-mo">
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4">
          <div className="flex flex-col gap-4">
            <div>
              <label className="block text-sm font-medium text-mb">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border-2 border-mb/30 rounded-lg focus:border-mb focus:border-2"
              />
            </div>
            <div className="flex gap-4">
              <div>
                <label className="block text-sm font-medium text-mb">
                  Price
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-mb/30 rounded-lg focus:border-mb focus:border-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-mb">
                  Shipping Price
                </label>
                <input
                  type="number"
                  value={shippingPrice}
                  onChange={(e) =>
                    setShippingPrice(
                      e.target.value === "" ? "" : Number(e.target.value),
                    )
                  }
                  className="w-full px-4 py-2 border-2 border-mb/30 rounded-lg focus:border-mb focus:border-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-mb">
                  Stock
                </label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(Number(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-mb/30 rounded-lg focus:border-mb focus:border-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-mb">
                  Discount Price
                </label>
                <input
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(Number(e.target.value))}
                  className="w-full px-4 py-2 border-2 border-mb/30 rounded-lg focus:border-mb focus:border-2"
                />
              </div>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-mb mb-2">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={5}
              className="w-full px-4 py-2 border-2 border-mb/30 rounded-lg focus:border-mb focus:border-2"
            />
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-mb mb-2">
                Category Selection
              </label>
              <div className="flex flex-wrap gap-2">{renderSelectors()}</div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-mb mb-2">
                Product Tags
              </label>
              <input
                type="text"
                onKeyDown={handleTagAdd}
                className="w-full px-4 py-2 border-2 border-mb/30 rounded-lg focus:border-mb focus:border-2"
                placeholder="Type and press enter to add tags"
              />
              <div className="mt-2 flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                  <span
                    key={index}
                    className="bg-mg/10 px-3 py-1 rounded-full text-sm text-mg flex items-center"
                  >
                    {tag}
                    <button
                      type="button"
                      className="ml-2 text-mo hover:text-mg transition-colors"
                      onClick={() => handleTagRemove(tag)}
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-mb mb-2">
                Product Images
              </label>
              <div className="relative border-2 border-mb/20 rounded-lg p-4 transition-colors hover:border-mo">
                <input
                  type="file"
                  multiple
                  onChange={handleImageUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="text-center text-mb/60">
                  <span className="text-mo">Click to upload</span> or drag and
                  drop
                </div>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative group">
                    <Image
                      src={preview || "/fallback-image.png"}
                      width={200}
                      height={200}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg shadow-sm"
                    />
                    <button
                      type="button"
                      className="absolute top-1 right-1 bg-mo/80 text-white rounded-full p-1 hover:bg-mo transition-colors"
                      onClick={() => handleRemoveImage(index)}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-bl text-bl rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-mo text-white rounded-lg hover:bg-mg transition-colors"
              >
                Update Product
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductEditModal;
