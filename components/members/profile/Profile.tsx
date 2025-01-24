"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useMutation } from "@tanstack/react-query";
import { getProfile, saveProfileUpdate } from "@/app/actions";

interface ProfileFormData {
  id: number;
  fullname: string;
  username: string;
  email: string;
  phone: string;
  streetaddress: string;
  city: string;
  country: string;
  postcode: string;
  role: string;
  NF: boolean;
}

const ProfileMain = () => {
  const t = useTranslations("Profile");
  const [error, setError] = useState("");
  const [formData, setFormData] = useState<ProfileFormData>({
    id: 0,
    fullname: "",
    username: "",
    email: "",
    phone: "",
    streetaddress: "",
    city: "",
    country: "",
    postcode: "",
    role: "",
    NF:  true || false,
  });

  const {
    data,
    mutate: server_getProfile,
  } = useMutation({
    mutationFn: getProfile,
    onSuccess: (data) => {
      setFormData({
        id: data.id || 0,
        fullname: data.fullname || "",
        username: data.username || "",
        email: data.email || "",
        phone: data.phone || "",
        streetaddress: data.streetaddress || "",
        city: data.city || "",
        country: data.country || "",
        postcode: data.postcode || "",
        role: data.role || "",
        NF: data.NF || true || false,
      }); // Update form data with fetched profile data
    },
    onError: () => {
      // Error handling
    },
  });

  useEffect(() => {
    server_getProfile();
  }, [server_getProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await saveProfileUpdate(new FormData(e.target as HTMLFormElement));
      // Handle success (e.g., show a success message or redirect)
    } catch (error) {
      console.error('Error updating profile:', error);
      // Handle error (e.g., show an error message)
    }
  };

  const checked = formData.NF === true? true : false;
  console.log(formData);
  console.log("abcd224njdjkdkssnk");
  console.log(formData.NF);
  return (
    <div className="bg-background p-4 rounded-lg shadow-md border-solid border-foreground border-2">
      <h2 className="font-bold text-2xl mb-4">{t("profileUpdate")}</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
        <label>{t("email")}</label>
        <input type="text" name="email" className="bg-foreground text-background p-2 rounded border-solid border-grey" value={formData.email} onChange={handleChange} placeholder="Email" />
        <label>{t("phone")}</label>
        <input type="text" name="phone"className="bg-foreground text-background p-2 rounded border-solid border-grey" value={formData.phone} onChange={handleChange} placeholder="Phone" />
        <label>{t("username")}</label>
        <input type="text" name="username"className="bg-foreground text-background p-2 rounded border-solid border-grey" value={formData.username} onChange={handleChange} placeholder="Username" />
        <label>{t("fullname")}</label>
        <input type="text" name="fullname"className="bg-foreground text-background p-2 rounded border-solid border-grey" value={formData.fullname} onChange={handleChange} placeholder="Full Name" />
        <label>{t("address")}</label>
        <input type="text" name="streetaddress" className="bg-foreground text-background p-2 rounded border-solid border-grey" value={formData.streetaddress} onChange={handleChange} placeholder="Street Address" />
        <label>{t("city")}</label>
        <input type="text" name="city" className="bg-foreground text-background p-2 rounded border-solid border-grey" value={formData.city} onChange={handleChange} placeholder="City" />
        <label>{t("country")}</label>
        <input type="text" name="country" className="bg-foreground text-background p-2 rounded border-solid border-grey" value={formData.country} onChange={handleChange} placeholder="Country" />
        <label>{t("zip")}</label>
        <input type="text" name="postcode" className="bg-foreground text-background p-2 rounded border-solid border-grey" value={formData.postcode} onChange={handleChange} placeholder="Post Code" />
        <label>{t("role")}</label>
        <input type="text" name="role" className="bg-foreground text-background p-2 rounded border-solid border-grey" value={formData.role} onChange={handleChange} placeholder="Role" />
        <label>{t("qualifications")}</label>
        <div>
          <table>
            <tr>
              <th>NF</th>
              <th><input type="checkbox" name="NF" className="bg-foreground text-background p-2 rounded border-solid border-grey" checked={checked} onChange={handleChange} /></th>
            </tr>
            <tr>
              <th>IR</th>
              <th><input type="checkbox" name="NF" className="bg-foreground text-background p-2 rounded border-solid border-grey" checked={checked} onChange={handleChange} /></th>
            </tr>
          </table>
        </div>
       
        <button type="submit" className="text-foreground p-2 rounded border-solid border-foreground border-2 w-auto">Save</button>
      </form>
    </div>
  );
};

export default ProfileMain;