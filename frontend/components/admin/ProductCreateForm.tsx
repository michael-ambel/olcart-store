"use client";

import React, { useState, useEffect } from "react";
import { useCreateProductMutation } from "@/store/apiSlices/productApiSlice";
import { CategoryTree } from "@/store/types/categoryTypes";
import { useGetCategoriesQuery } from "@/store/apiSlices/categoryApiSlice";
import { Product } from "@/store/types/productTypes";
import Image from "next/image";

const ProductCreateForm: React.FC = () => {
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [price, setPrice] = useState<number | "">("");
  const [discountPrice, setDiscountPrice] = useState<number | "">("");
  const [stock, setStock] = useState<number | "">("");
  const [tags, setTags] = useState<string[]>([]);
  const [images, setImages] = useState<File[]>([]);

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [categoriesData, setCategoriesData] = useState<CategoryTree[]>([]);
  const [selectedPath, setSelectedPath] = useState<CategoryTree[]>([]);

  const [createProduct, { isLoading, isError, error }] =
    useCreateProductMutation();
  const { data, isLoading: isCategoriesLoading } = useGetCategoriesQuery();

  useEffect(() => {
    if (data) {
      setCategoriesData(data);
    }
  }, [data]);

  const handleSelectionChange = (level: number, id: string) => {
    const updatedPath = selectedPath.slice(0, level);
    const category = findCategoryById(
      level === 0 ? categoriesData : selectedPath[level - 1]?.subCategories,
      id
    );

    if (category) {
      setSelectedPath([...updatedPath, category]);
    } else {
      setSelectedPath(updatedPath);
    }
  };

  const findCategoryById = (
    categories: CategoryTree[] | undefined,
    id: string
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
          key={level}
          value={selectedPath[level]?._id || ""}
          onChange={(e) => handleSelectionChange(level, e.target.value)}
          className="w-auto border rounded p-2 mb-2"
        >
          <option value="">Select</option>
          {categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))}
        </select>
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
      prevPreviews.filter((_, i) => i !== index)
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

  // const handleSubmit = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   const productData: Partial<Product> = {
  //     name,
  //     description,
  //     price: typeof price === "number" ? price : 0,
  //     category: selectedPath.map((category) => category._id),
  //     // category: selectedPath.map((category) => category._id).join("/"),
  //     stock: typeof stock === "number" ? stock : 0,
  //     tags,
  //     images,
  //   };

  //   try {
  //     await createProduct(productData);

  //     alert("Product created successfully!");
  //   } catch (error) {
  //     console.error("Error creating product:", error);
  //   }
  // };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Create FormData instance
    const formData = new FormData();
    formData.append("name", name || "");
    formData.append("description", description || "");
    formData.append("price", price.toString());
    formData.append("stock", stock.toString());
    formData.append("tags", JSON.stringify(tags));

    // Append category without stringifying, just as an array of ObjectIds
    selectedPath.forEach((category) => {
      formData.append("category", category._id);
    });
    // Append images to FormData
    if (images && images.length > 0) {
      images.forEach((imageFile) => {
        formData.append("images", imageFile);
      });
    }

    try {
      console.log(formData);
      // Use your API function to send FormData
      await createProduct(formData);

      alert("Product created successfully!");
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  return (
    <div className="w-full mx-auto p-4">
      <h1 className="text-xl font-bold mb-4">Create New Product</h1>
      <form onSubmit={handleSubmit} className="flex  gap-4">
        <div className="w-1/2">
          {" "}
          <div>
            {" "}
            <label htmlFor="name" className="block text-sm font-medium">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="description" className="block text-sm font-medium">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label htmlFor="price" className="block text-sm font-medium">
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              required
              className="w-full border rounded p-2"
            />
          </div>
          <div>
            <label
              htmlFor="discountPrice"
              className="block text-sm font-medium"
            >
              Discount Price
            </label>
            <input
              type="number"
              id="discountPrice"
              value={discountPrice}
              onChange={(e) => setDiscountPrice(Number(e.target.value))}
              className="w-full border rounded p-2"
            />
          </div>
          {/* Stock Input */}
          <div>
            <label htmlFor="stock" className="block text-sm font-medium">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(Number(e.target.value))}
              required
              className="w-full border rounded p-2"
            />
          </div>
        </div>

        <div className="w-1/2">
          <div className="">
            <label htmlFor="category" className="block  text-sm font-medium">
              Category
            </label>
            <div className="flex flex-wrap w-auto category-selectors">
              {renderSelectors()}
            </div>
          </div>

          <div>
            <label htmlFor="tags" className="block text-sm font-medium">
              Tags (Press Enter to Add)
            </label>
            <input
              type="text"
              id="tags"
              onKeyDown={handleTagAdd} // Only trigger on keydown
              className="w-full border rounded p-2"
            />
            <div className="mt-2 flex flex-wrap gap-2">
              {tags.map((tag, index) => (
                <span
                  key={index}
                  className="bg-gray-200 px-2 py-1 rounded text-sm flex items-center"
                >
                  {tag}
                  <button
                    type="button"
                    className="ml-2 text-red-500"
                    onClick={() => handleTagRemove(tag)}
                  >
                    &times;
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div>
            <label htmlFor="images" className="block text-sm font-medium">
              Product Images
            </label>
            <input
              type="file"
              id="images"
              multiple
              onChange={handleImageUpload}
              className="w-full border rounded p-2"
            />
            <div className=" flex flex-wrap w-full h-auto gap-2 mt-2">
              {imagePreviews.map((preview, index) => (
                <div className="relative w-[100px] h-[100px]">
                  <Image
                    key={index}
                    src={preview}
                    width={60}
                    height={60}
                    alt="preview"
                    className="w-[100px] h-[100px] object-cover"
                  />

                  <button
                    type="button"
                    className="absolute right-[2px] top-[-6px] h-[10px] ml-2 text-[30px] text-red-600"
                    onClick={() => handleRemoveImage(index)}
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 my-2 rounded"
          >
            Create Product
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductCreateForm;
