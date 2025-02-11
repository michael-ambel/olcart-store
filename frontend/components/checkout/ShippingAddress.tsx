"use client";

import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useAddShippingAddressMutation,
  useGetShippingAddressesQuery,
  useUpdateShippingAddressMutation,
  useDeleteShippingAddressMutation,
} from "@/store/apiSlices/userApiSlice";

import { setCurrentAddress } from "@/store/slices/orderSlice";
import { IShippingAddress } from "@/store/types/userTypes";
import { RootState } from "@/store/store";

import PlaceOrderButton from "./PlaceOrderButton";
import { showToast } from "../ToastNotifications";

const ShippingAddress = () => {
  const {
    data: addresses = [],
    isLoading,
    isError,
  } = useGetShippingAddressesQuery();
  const [addShippingAddress, { isLoading: isAdding }] =
    useAddShippingAddressMutation();
  const [updateShippingAddress, { isLoading: isUpdating }] =
    useUpdateShippingAddressMutation();
  const [deleteShippingAddress, { isLoading: isDeleting }] =
    useDeleteShippingAddressMutation();

  const selectedAddress = useSelector(
    (state: RootState) => state.order.currentAddress
  );

  const dispatch = useDispatch();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState<IShippingAddress>({
    name: "",
    address: "",
    city: "",
    postalCode: "",
    country: "",
    phone: "",
    isDefault: false,
  });
  const [loadingState, setLoadingState] = useState<{ [key: string]: string }>(
    {}
  );

  // Set the first address default
  useEffect(() => {
    if (!selectedAddress && addresses.length > 0) {
      if (addresses[0]) {
        dispatch(setCurrentAddress(addresses[0]));
      }
    }
  }, [addresses, selectedAddress, dispatch]);

  const handleSelectAddress = (address: IShippingAddress) => {
    dispatch(setCurrentAddress(address));
  };

  const handleFormChange = (
    field: keyof IShippingAddress,
    value: string | boolean
  ) => {
    setAddressForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleOpenModal = (isEditMode: boolean, address?: IShippingAddress) => {
    setIsEditing(isEditMode);
    setIsModalOpen(true);
    if (isEditMode && address) {
      address._id && setEditingAddressId(address._id);
      setAddressForm(address);
    } else {
      setAddressForm({
        name: "",
        address: "",
        city: "",
        postalCode: "",
        country: "",
        phone: "",
        isDefault: false,
      });
    }
  };

  const handleSaveAddress = async () => {
    try {
      if (isEditing && editingAddressId) {
        setLoadingState((prev) => ({
          ...prev,
          [editingAddressId]: "updating",
        }));
        await updateShippingAddress({
          ...addressForm,
          _id: editingAddressId,
        }).unwrap();
        showToast("success", "Address updated successfully");
      } else {
        setLoadingState((prev) => ({ ...prev, new: "adding" }));
        await addShippingAddress(addressForm).unwrap();
        showToast("success", "Address added successfully");
      }
      setIsModalOpen(false);
      setEditingAddressId(null);
    } catch {
      showToast("error", "Error while saving the address:");
      return;
    } finally {
      setLoadingState((prev) => ({
        ...prev,
        [editingAddressId || "new"]: "",
      }));
    }
  };

  const handleDeleteAddress = async (addressId: string) => {
    try {
      setLoadingState((prev) => ({ ...prev, [addressId]: "deleting" }));
      await deleteShippingAddress({ _id: addressId }).unwrap();
    } catch {
      showToast("error", "Error while deleting the address:");
      return;
    } finally {
      setLoadingState((prev) => ({ ...prev, [addressId]: "" }));
    }
  };

  if (isLoading) return <p>Loading addresses...</p>;
  if (isError) return <p>Failed to load addresses</p>;

  return (
    <div className="container w-full mx-auto  py-[120px]">
      <h1 className="text-[18px] font-semibold mb-4">Shipping Addresses</h1>
      <div className="flex flex-wrap justify justify-between gap-2">
        {addresses.map((address: IShippingAddress) => (
          <div
            key={address._id}
            className={`relative flex flex-col justify-between text-[14px] gap-1 p-4 mb-2 w-[360px] border-[1.5px] rounded-[8px] bg-bl/10 border-bg`}
          >
            <label className="flex  items-center">
              <input
                type="checkbox"
                className={`absolute right-[18px] top-[16px] h-[22px] w-[22px] appearance-none rounded-md border-2 border-bl cursor-pointer focus:outline-none 
    flex items-center justify-center
 
    ${
      selectedAddress?._id === address?._id || false
        ? "after:content-['✔'] after:absolute after:right-0 after:font-bold after:text-[18px] after:text-mo after:pointer-events-none after:h-full after:w-full after:flex after:items-center after:justify-center"
        : ""
    }`}
                checked={selectedAddress?._id === address?._id || false}
                onChange={() => handleSelectAddress(address)}
              />

              <div className="flex flex-col gap-2 w-full text-mb">
                <p className="bg-bg mr-[34px] p-2 rounded-[10px]">
                  Name:
                  <span className="text-bl font-semibold"> {address.name}</span>
                </p>
                <p className="bg-bg  p-2 rounded-[10px]">
                  Street:{" "}
                  <span className="text-bl font-semibold">
                    {address.address}
                  </span>{" "}
                </p>
                <p className="bg-bg  p-2 rounded-[10px]">
                  City:{" "}
                  <span className="text-bl font-semibold"> {address.city}</span>
                </p>
                <p className="bg-bg  p-2 rounded-[10px]">
                  Postal code:{" "}
                  <span className="text-bl font-semibold">
                    {address.postalCode}
                  </span>
                </p>
                <p className="bg-bg  p-2 rounded-[10px]">
                  State:{" "}
                  <span className="text-bl font-semibold"> {address.city}</span>
                </p>
                <p className="bg-bg  p-2 rounded-[10px]">
                  Phone number:{" "}
                  <span className="text-bl font-semibold">{address.phone}</span>
                </p>
              </div>
            </label>

            <div className="flex justify-between text-mo gap-2 mt-2">
              <p>
                <strong>{address.isDefault ? "Default" : ""}</strong>
              </p>
              <div className="flex justify-between w-[150px]">
                <button
                  className="px-4 py-1 border-[1px] border-bl font-semibold text-mg rounded-full"
                  onClick={() => handleOpenModal(true, address)}
                  disabled={
                    loadingState[address._id ?? ""] === "updating" ||
                    loadingState["new"] === "adding" ||
                    loadingState[address._id ?? ""] === "deleting"
                  }
                >
                  {loadingState[address._id ?? ""] === "updating"
                    ? "Saving..."
                    : "Edit"}
                </button>
                <button
                  className="px-3 py-1 border-[1px] border-bl font-semibold text-mo  rounded-full"
                  onClick={() =>
                    address._id && handleDeleteAddress(address._id)
                  }
                  disabled={
                    loadingState[address._id ?? ""] === "deleting" ||
                    loadingState["new"] === "adding" ||
                    loadingState[address._id ?? ""] === "updating"
                  }
                >
                  {loadingState[address._id ?? ""] === "deleting"
                    ? "Deleting..."
                    : "Delete"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-bl bg-opacity-50">
          <div className="bg-bg p-6 rounded-[16px] shadow-lg w-[400px] text-[15px] mt-[90px]">
            <h2 className="text-lg font-bold mb-4">
              {isEditing ? "Edit Address" : "Add New Address"}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSaveAddress();
              }}
            >
              <input
                type="text"
                placeholder="Name"
                value={addressForm.name}
                onChange={(e) => handleFormChange("name", e.target.value)}
                className="w-full mb-2 p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Address"
                value={addressForm.address}
                onChange={(e) => handleFormChange("address", e.target.value)}
                className="w-full mb-2 p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="City"
                value={addressForm.city}
                onChange={(e) => handleFormChange("city", e.target.value)}
                className="w-full mb-2 p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Postal Code"
                value={addressForm.postalCode}
                onChange={(e) => handleFormChange("postalCode", e.target.value)}
                className="w-full mb-2 p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Country"
                value={addressForm.country}
                onChange={(e) => handleFormChange("country", e.target.value)}
                className="w-full mb-2 p-2 border rounded"
                required
              />
              <input
                type="text"
                placeholder="Phone"
                value={addressForm.phone}
                onChange={(e) => handleFormChange("phone", e.target.value)}
                className="w-full mb-2 p-2 border rounded"
                required
              />
              <label className="flex items-center gap-2 my-2">
                <input
                  type="checkbox"
                  checked={addressForm.isDefault}
                  onChange={(e) =>
                    handleFormChange("isDefault", e.target.checked)
                  }
                  className="flex right-4 top-4 w-[18px] h-[18px] rounded-[4px] border-[1.5px] border-mo  appearance-none   cursor-pointer transition-all duration-300 checked:before:content-['✔'] text-[18px] items-center"
                />
                <span>Set as Default Address</span>
              </label>
              <div className="flex justify-end gap-4 mt-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-mb text-white rounded-full"
                  disabled={isAdding || isUpdating || isDeleting}
                >
                  {isAdding || isUpdating ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="px-4 py-2 bg-bl text-white rounded-full"
                  onClick={() => setIsModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      <div className="flex justify-between my-[70px] px-[20px]">
        <button
          className="mb-4 px-[26px] py-2 bg-mb text-white rounded-full"
          onClick={() => handleOpenModal(false)}
          disabled={isAdding || isUpdating || isDeleting}
        >
          {isAdding ? "Saving..." : "Add Address"}
        </button>

        <PlaceOrderButton />
      </div>
    </div>
  );
};

export default ShippingAddress;
