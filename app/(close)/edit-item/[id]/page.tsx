"use client";
import { useCloseBackdrop } from "@/hooks/backdrop";
import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
  Typography,
} from "@mui/material";
import React, { use, useCallback, useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { BackRouter, PushRouter } from "@/util/helpers/routers";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";
import { country_states } from "@/util/helpers/country_state";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import axios from "axios";
import { enqueueSnackbar } from "notistack";
import { fetchUserAttributes } from "aws-amplify/auth";
import { useAppDispatch } from "@/util/store/store";
import {
  setCloseBackdrop,
  setOpenBackdrop,
} from "@/util/store/slice/backdropSlice";
import { useSharedItems } from "@/hooks/items";
import dayjs from "dayjs";
import { DateTimePicker } from "@mui/x-date-pickers";
import { v4 as uuidv4 } from "uuid";
import { parsePhoneNumberFromString } from "libphonenumber-js";
import CustomDialog from "@/components/layout/CustomDialog";

const client = generateClient<Schema>();

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      // border: "1px solid",
      // width: 250,
    },
  },
};

const EditItemPage = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  useCloseBackdrop();
  const app_dispatch = useAppDispatch();
  const pushRouter = PushRouter();
  const backRouter = BackRouter();

  const { getSingleItem } = useSharedItems();
  const [itemDetail, setItemDetail] = useState(null as any);

  /*********************************************
   * USER DETAILS
   * **********************************************/
  const [userDetails, setUserDetails] = useState(null as any);
  // console.log("userDetails :>> ", userDetails);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const user = await fetchUserAttributes();
        setUserDetails(user);
      } catch (error) {
        console.error("Error fetching user details", error);
      }
    };
    fetchUser();
  }, []);

  /*********************************************
   * COUNTRY | STATE | CURRENCY
   * **********************************************/
  const [countryList, setCountryList] = useState([] as any);
  const [selectedCountry, setSelectedCountry] = useState("");
  // const [countryCode, setCountryCode] = useState("" as any);

  useEffect(() => {
    const tempArr: any = [];

    country_states.map((item: any) => {
      tempArr.push({
        id: item?.iso2,
        iso3: item?.iso3,
        iso2: item?.iso2,
        label: item?.name,
        value: item?.name,
        symbol: item?.currency_symbol,
        currency: item?.currency,
        flag: item?.emoji,
        phone_code: item?.phone_code.replace(/\D/g, ""),
      });
    });
    setCountryList(tempArr);

    return () => {};
  }, []);

  const [stateList, setStateList] = useState([] as any);

  useEffect(() => {
    const filteredStates = country_states.filter(
      (item: any) => item.name === selectedCountry,
    );
    const tempArr: any = [];
    if (filteredStates.length > 0) {
      filteredStates.map((item: any) => {
        item?.states.map((state: any) => {
          tempArr.push({
            id: state?.id,
            label: state?.name,
            value: state?.name,
          });
        });
      });
      setStateList(tempArr);
    } else {
      setStateList([]);
    }

    return () => {};
  }, [selectedCountry]);

  const handleSelectedCurrency = (event: SelectChangeEvent<string>) => {
    const country = event.target.value;
    setSelectedCountry(country);
    // const findCountry = countryList.find((item: any) => item.value === country);
    // if (findCountry) {
    //   setCountryCode(findCountry.iso2);
    // }
  };

  /*********************************************
   * CONTACT OPTIONS
   * **********************************************/
  const [selectedOption, setSelectedOption] = useState({
    emailSelected: false,
    phoneSelected: false,
  });

  const handleSelectedContactMethod = (event: any) => {
    const { name, checked } = event.target;
    setSelectedOption((prevState) => ({
      ...prevState,
      [name]: checked,
    }));
  };

  /*********************************************
   * IS DIGITAL OPTION
   * **********************************************/
  const [digitalProduct, setDigitalProduct] = useState(false);

  /*********************************************
   * IMAGE UPLOAD
   * **********************************************/
  const [itemImage, setItemImage] = useState<any>([]);
  const [itemImageUpload, setItemImageUpload] = useState<any>(null);
  // console.log("itemImageUpload :>> ", itemImageUpload);
  const onDrop = useCallback((acceptedFiles: any) => {
    // Do something with the files
    setItemImageUpload(acceptedFiles[0]);
    setItemImage(
      acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ),
    );
  }, []);

  const handleRemoveImage = () => {
    setItemImage([]);
    setItemImageUpload(null);
  };

  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop,
    maxFiles: 1,
    multiple: false,
    maxSize: 9 * 1024 * 1024, // 9MB
  });

  /*********************************************
   * ADDITIONAL IMAGE UPLOAD 1
   * **********************************************/
  const [moreImage1, setMoreImage1] = useState<any>([]);
  const [moreImageUpload1, setMoreImageUpload1] = useState<any>(null);

  const onDrop1 = useCallback((acceptedFiles: any) => {
    // Do something with the files
    setMoreImageUpload1(acceptedFiles[0]);
    setMoreImage1(
      acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ),
    );
  }, []);

  const handleRemoveImage1 = () => {
    setMoreImage1([]);
    setMoreImageUpload1(null);
  };

  const {
    getRootProps: getRootProps1,
    getInputProps: getInputProps1,
    isDragActive: isDragActive1,
    isDragAccept: isDragAccept1,
    isDragReject: isDragReject1,
  } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: onDrop1,
    maxFiles: 1,
    multiple: false,
    maxSize: 9 * 1024 * 1024, // 9MB
  });

  /*********************************************
   * ADDITIONAL IMAGE UPLOAD 2
   * **********************************************/
  const [moreImage2, setMoreImage2] = useState<any>([]);
  const [moreImageUpload2, setMoreImageUpload2] = useState<any>(null);
  const onDrop2 = useCallback((acceptedFiles: any) => {
    // Do something with the files
    setMoreImageUpload2(acceptedFiles[0]);
    setMoreImage2(
      acceptedFiles.map((file: any) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      ),
    );
  }, []);
  const handleRemoveImage2 = async () => {
    setMoreImage2([]);
    setMoreImageUpload2(null);
    // const url = await uploadImage(moreImageUpload2);
    // console.log("url :>> ", url);
  };
  const {
    getRootProps: getRootProps2,
    getInputProps: getInputProps2,
    isDragActive: isDragActive2,
    isDragAccept: isDragAccept2,
    isDragReject: isDragReject2,
  } = useDropzone({
    accept: {
      "image/*": [],
    },
    onDrop: onDrop2,
    maxFiles: 1,
    multiple: false,
    maxSize: 9 * 1024 * 1024, // 9MB
  });

  /*********************************************
   * UPLOAD IMAGE FUNCTION
   * **********************************************/
  const uploadImage = async (file: any) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset || "");

    try {
      const response = await axios.post(
        `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );

      return response.data.secure_url;
    } catch (error) {
      console.error("Error uploading image", error);
    }
  };

  /*********************************************
   * REACT HOOK FORM
   * **********************************************/
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    clearErrors,
    setError,
  } = useForm({
    defaultValues: {
      itemName: "",
      shortDescription: "",
      longDescription: "",
      isDigital: false,
      price: "",
      expiresAt: dayjs(dayjs().add(2, "day").toDate()),
      instruction: "",
      specialInformation: "",
      currency: "",
      country: "",
      state: "",
      location: "",
      contactMethod: "",
      emailSelected: false,
      phoneSelected: false,
      contactEmail: "",
      // contactPhone: "",
      phone_code: "",
      phone: "",
      contactName: "",
      peopleRequired: 0,
    },
  });

  useEffect(() => {
    // if (userDetails) {
    //   setValue(
    //     "contactName",
    //     `${userDetails?.family_name} ${userDetails?.given_name}`,
    //   );
    //   setValue("contactEmail", userDetails?.email);
    //   // setValue("contactPhone", userDetails?.phone_number);
    // }
    // const localCountry = localStorage.getItem("bulk_share_country");
    // const localState = localStorage.getItem("bulk_share_state");
    // const localCurrency = localStorage.getItem("bulk_share_currency");
    // const localPhoneCode = localStorage.getItem("bulk_share_phone_code");
    // const localPhone = localStorage.getItem("bulk_share_phone");
    // const localName = localStorage.getItem("bulk_share_name");
    // setSelectedCountry(localCountry || "");

    //     if (localName) {
    //   setValue("contactName", localName);
    // } else {
    //   setValue(
    //     "contactName",
    //     `${userDetails?.family_name} ${userDetails?.given_name}`,
    //   );
    // }

    // if (localCountry) {
    //   setValue("country", localCountry);
    // }

    // if (localState) {
    //   setValue("state", localState);
    // }

    // if (localCurrency) {
    //   setValue("currency", localCurrency);
    // }

    (async () => {
      const itemDetails = await getSingleItem(id);
      console.log("itemDetails :>> ", itemDetails);
      if (itemDetails) {
        setValue("itemName", itemDetails?.name || "");
        setValue(
          "shortDescription",
          itemDetails.description ? itemDetails.description.short! : "",
        );
        setValue(
          "longDescription",
          itemDetails.description ? itemDetails.description.long! : "",
        );
        setValue("price", itemDetails?.price.toString() || "");
        setValue(
          "expiresAt",
          itemDetails.expiresAt ? dayjs(itemDetails.expiresAt) : dayjs(),
        );
        setValue("instruction", itemDetails.instruction || "");
        setValue("specialInformation", itemDetails.specialInformation || "");
        setValue("isDigital", itemDetails.isDigital! || false);
        setValue("currency", itemDetails.currency! || "");
        setValue("country", itemDetails.country! || "");
        setSelectedCountry(itemDetails.country! || "");
        setValue("state", itemDetails.state! || "");
        setValue("location", itemDetails.location! || "");
        setValue("contactMethod", itemDetails.contactMethod! || "");
        setValue("contactEmail", itemDetails.contactEmail! || "");
        setValue("phone", itemDetails.phone! || "");
        setValue("phone_code", itemDetails.phone_code! || "");
        setValue("contactName", itemDetails.contactName! || "");
        setValue("peopleRequired", itemDetails.peopleRequired! || 0);
        setItemImageUpload(itemDetails.coverImage);
        setItemImage([
          {
            preview: itemDetails.coverImage,
          },
        ]);
        if (itemDetails.otherImages) {
          if (itemDetails.otherImages[0].trim() !== "") {
            setMoreImageUpload1(itemDetails.otherImages[0]);
            setMoreImage1([
              {
                preview: itemDetails.otherImages[0],
              },
            ]);
          }

          if (itemDetails.otherImages[1].trim() !== "") {
            setMoreImageUpload2(itemDetails.otherImages[1]);
            setMoreImage2([
              {
                preview: itemDetails.otherImages[1],
              },
            ]);
          }
        }
        setSelectedOption({
          emailSelected: itemDetails.contactMethod?.includes("email") || false,
          phoneSelected: itemDetails.contactMethod?.includes("phone") || false,
        });
        setDigitalProduct(itemDetails.isDigital! || false);
        setValue(
          "emailSelected",
          itemDetails.contactMethod?.includes("email") || false,
        );
        setValue(
          "phoneSelected",
          itemDetails.contactMethod?.includes("phone") || false,
        );

        setSelectedCountry(itemDetails.country! || "");
        const filteredStates = country_states.filter(
          (item: any) => item.name === itemDetails.country,
        );
        const tempArr: any = [];
        if (filteredStates.length > 0) {
          filteredStates.map((item: any) => {
            item?.states.map((state: any) => {
              tempArr.push({
                id: state?.id,
                label: state?.name,
                value: state?.name,
              });
            });
          });
          setStateList(tempArr);
        } else {
          setStateList([]);
        }
        setItemDetail(itemDetails);
      }
    })();

    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userDetails, setValue, id]);

  const onSubmit = async (data: any) => {
    if (!data.emailSelected && !data.phoneSelected) {
      setError("contactMethod", {
        type: "manual",
        message: "Please select at least one contact method.",
      });
      return;
    }

    if (!itemImageUpload) {
      enqueueSnackbar("Please provide an item image", {
        variant: "error",
      });
      return;
    }

    if (!data?.phone_code) {
      enqueueSnackbar("Please select your country code", {
        variant: "error",
      });
      return;
    }

    let constructNumber = "";

    const findCountry = country_states.find(
      (item: any) => item.phone_code === data.phone_code,
    );

    if (!findCountry) {
      enqueueSnackbar("Please select a valid country code", {
        variant: "error",
      });
      return;
    } else {
      const parsedPhonenumber = parsePhoneNumberFromString(
        data.phone,
        findCountry.iso2 as any,
      );
      // console.log("parsedPhonenumber :>> ", parsedPhonenumber);
      if (parsedPhonenumber?.isValid()) {
        constructNumber = parsedPhonenumber?.number?.replace("+", "");
      } else {
        setError("phone", {
          type: "manual",
          message: "Please enter a valid phone number",
        });
        enqueueSnackbar("Please enter a valid phone number", {
          variant: "error",
        });
        return;
      }
    }

    // const parsedPhonenumber = parsePhoneNumberFromString(
    //   data.contactPhone,
    //   countryCode,
    // );
    // console.log("parsedPhonenumber :>> ", parsedPhonenumber);
    // if (parsedPhonenumber?.isValid()) {
    //   setValue("contactPhone", parsedPhonenumber?.number?.replace("+", ""));
    // } else {
    //   setError("contactPhone", {
    //     type: "manual",
    //     message: "Invalid phone number",
    //   });
    //   app_dispatch(setCloseBackdrop());
    //   return;
    // }

    let coverURL = "";
    const isImageExist =
      typeof itemImageUpload === "string" &&
      itemImageUpload?.includes("https://");
    if (!isImageExist) {
      coverURL = await uploadImage(itemImageUpload);
      console.log("coverURL :>> ", coverURL);
      if (!coverURL) {
        enqueueSnackbar(
          "Error with cover image, please try again with another image.",
          {
            variant: "error",
          },
        );
        return;
      }
    } else {
      coverURL = itemImageUpload;
      console.log("image already exist", coverURL);
    }

    let moreImage1URL = "";
    if (moreImageUpload1) {
      moreImage1URL = await uploadImage(moreImageUpload1);
    }
    let moreImage2URL = "";
    if (moreImageUpload2) {
      moreImage2URL = await uploadImage(moreImageUpload2);
    }

    let selectedMethod = "";
    if (data.emailSelected && data.phoneSelected) {
      selectedMethod = "email_phone";
    } else if (data.emailSelected) {
      selectedMethod = "email";
    } else if (data.phoneSelected) {
      selectedMethod = "phone";
    }
    try {
      app_dispatch(setOpenBackdrop());

      const { data: listItems, errors } = await client.models.ListItem.update({
        id: id,
        name: data.itemName,
        description: {
          short: data.shortDescription,
          long: data.longDescription,
        },
        instruction: data.instruction,
        specialInformation: data.specialInformation,
        price: parseFloat(data.price),
        expiresAt: data.expiresAt,
        isDigital: data.isDigital,
        currency: data.currency,
        country: data.country,
        flag: findCountry?.emoji || "",
        state: data.state,
        location: data.location,
        coverImage: coverURL || "",
        otherImages: JSON.stringify([moreImage1URL, moreImage2URL]),
        contactMethod: selectedMethod || "",
        contactEmail: data.contactEmail,
        contactPhone: constructNumber || "",
        phone_code: data.phone_code || "",
        phone: data.phone || "",
        contactName: data.contactName,
        userSub: userDetails?.sub || "",
        peopleRequired: parseInt(data.peopleRequired),
        members: JSON.stringify([
          {
            id: uuidv4(),
            userSub: userDetails?.sub,
            contactName: data.contactName,
            contactEmail: data.contactEmail,
            contactPhone: constructNumber || "",
            isOwner: true,
            status: "confirmed",
          },
        ]),
      });
      // console.log("ListItem updated", listItems);

      if (listItems) {
        localStorage.setItem("bulk_share_country", data.country);
        localStorage.setItem("bulk_share_state", data.state);
        localStorage.setItem("bulk_share_currency", data.currency);
        localStorage.setItem("bulk_share_phone_code", data.phone_code);
        localStorage.setItem("bulk_share_phone", data.phone);
        localStorage.setItem("bulk_share_name", data.contactName);

        enqueueSnackbar("Item updated successfully", {
          variant: "success",
        });
        pushRouter("/my-list");
        // app_dispatch(setCloseBackdrop());
      }

      if (errors) {
        enqueueSnackbar("Error creating item", {
          variant: "error",
        });
        console.error("ListItem errors", errors);
        app_dispatch(setCloseBackdrop());
        return;
      }
      // Reset the form after successful submission
      reset();
    } catch (error) {
      app_dispatch(setCloseBackdrop());

      enqueueSnackbar("Something went wrong!", {
        variant: "error",
      });
      console.error("Error creating item", error);
    }
  };

  /*********************************************
   *  CLOSE ITEM DIALOG
   * **********************************************/
  const [closeItemDialog, setCloseItemDialog] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null as any);

  const handleOpenCloseItemDialog = () => {
    setSelectedItem(itemDetail);
    setCloseItemDialog(true);
  };
  const handleCloseItemDialog = () => {
    setSelectedItem(null);
    setCloseItemDialog(false);
  };
  const handleCloseItem = async () => {
    // update item properties visible, visibleTo, status
    if (!selectedItem) {
      enqueueSnackbar("No item selected", {
        variant: "error",
      });
      return;
    }
    try {
      app_dispatch(setOpenBackdrop());

      const { data: closedItem, errors } = await client.models.ListItem.update({
        id: selectedItem?.id,
        visibleTo: "owner",
        status: "closed",
      });

      if (errors) {
        app_dispatch(setCloseBackdrop());
        enqueueSnackbar("Error closing item", {
          variant: "error",
        });
        console.error("Error closing item", errors);
        return;
      }

      if (closedItem) {
        app_dispatch(setCloseBackdrop());
        enqueueSnackbar("Item closed successfully", {
          variant: "success",
        });
        handleCloseItemDialog();
        pushRouter("/my-list");
      }
    } catch (error) {
      app_dispatch(setCloseBackdrop());
      enqueueSnackbar("Something went wrong!", {
        variant: "error",
      });
      console.error("Error closing item", error);
      return;
    }
  };

  return (
    <div className="pt-5">
      <section className="container mx-auto my-5 px-3 md:px-1">
        <div className="mb-3">
          <IconButton aria-label="back" onClick={backRouter}>
            <Icon
              icon="famicons:arrow-back"
              className="text-gray-900 dark:text-white"
              width={30}
              height={30}
            />
          </IconButton>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Edit Item</h1>
        </div>
        <p className="mt-2 text-sm text-gray-600 md:text-base">
          Provide clear details about the item you want to update. This will
          help others to understand your intent and collaborate effectively.
        </p>
        <div className="py-4">
          <form onSubmit={handleSubmit(onSubmit)} className="">
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                {/* name */}
                <div className="">
                  <Controller
                    control={control}
                    name="itemName"
                    rules={{
                      required: "Item name is required",
                    }}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.itemName}
                        className="space-y-1"
                      >
                        <FormLabel
                          error={!!errors.itemName}
                          className={`text-sm ${
                            errors.itemName
                              ? "text-red-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                          htmlFor="name"
                        >
                          Item Name
                        </FormLabel>
                        <TextField
                          {...field}
                          fullWidth
                          error={!!errors.itemName}
                          // className={`rounded-lg border p-2 text-sm ${
                          //   errors.name
                          //     ? "border-red-700"
                          //     : "border-gray-700 focus-within:border-gray-700 hover:border-gray-700"
                          // }`}
                          // disableUnderline
                          helperText={errors.itemName?.message || " "}
                          size="small"
                        />
                      </FormControl>
                    )}
                  />
                </div>
                {/* price */}
                <div className="">
                  <Controller
                    control={control}
                    name="price"
                    rules={{
                      required: "Price is required",
                    }}
                    render={({ field }) => (
                      <FormControl
                        variant="outlined"
                        fullWidth
                        error={!!errors.price}
                        className="space-y-1"
                      >
                        <FormLabel
                          error={!!errors.price}
                          className={`text-sm ${
                            errors.price
                              ? "text-red-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                          htmlFor="price"
                        >
                          Price
                        </FormLabel>
                        <TextField
                          {...field}
                          fullWidth
                          error={!!errors.price}
                          // className={`rounded-lg border p-2 text-sm ${
                          //   errors.price
                          //     ? "border-red-700"
                          //     : "border-gray-700 focus-within:border-gray-700 hover:border-gray-700"
                          // }`}
                          // disableUnderline
                          helperText={errors.price?.message || " "}
                          slotProps={{
                            input: {
                              inputProps: {
                                style: { MozAppearance: "textfield" }, // Firefox
                              },
                              sx: {
                                // Chrome, Safari, Edge
                                "& input::-webkit-outer-spin-button": {
                                  WebkitAppearance: "none",
                                  margin: 0,
                                },
                                "& input::-webkit-inner-spin-button": {
                                  WebkitAppearance: "none",
                                  margin: 0,
                                },
                              },
                            },
                          }}
                          size="small"
                          type="number"
                        />
                      </FormControl>
                    )}
                  />
                </div>
                {/* number of people */}
                <div className="">
                  <Controller
                    control={control}
                    name="peopleRequired"
                    rules={{
                      required: "Number of people is required",
                      min: {
                        value: 1,
                        message: "Number of people must be at least 1",
                      },
                    }}
                    render={({ field }) => (
                      <FormControl
                        variant="outlined"
                        fullWidth
                        error={!!errors.peopleRequired}
                        className="space-y-1"
                      >
                        <FormLabel
                          error={!!errors.peopleRequired}
                          className={`text-sm ${
                            errors.peopleRequired
                              ? "text-red-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                          htmlFor="peopleRequired"
                        >
                          Number of People Required
                        </FormLabel>
                        <TextField
                          {...field}
                          fullWidth
                          error={!!errors.peopleRequired}
                          size="small"
                          type="number"
                          helperText={errors.peopleRequired?.message || " "}
                          slotProps={{
                            input: {
                              inputProps: {
                                style: { MozAppearance: "textfield" },
                              },
                              sx: {
                                "& input::-webkit-outer-spin-button": {
                                  WebkitAppearance: "none",
                                  margin: 0,
                                },
                                "& input::-webkit-inner-spin-button": {
                                  WebkitAppearance: "none",
                                  margin: 0,
                                },
                              },
                            },
                          }}
                        />
                      </FormControl>
                    )}
                  />
                </div>
                {/* is digital */}
                <div className="">
                  <Controller
                    control={control}
                    name="isDigital"
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.isDigital}
                        className="space-y-1"
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              {...field}
                              checked={field.value}
                              onChange={(event) => {
                                field.onChange(event);
                                setDigitalProduct(event.target.checked);
                              }}
                            />
                          }
                          label="Is this a digital item?"
                        />
                        {errors.isDigital?.message ? (
                          <span className="pt-1 pl-4 text-xs text-red-400">
                            {errors.isDigital?.message}
                          </span>
                        ) : (
                          <div className="h-5" />
                        )}
                      </FormControl>
                    )}
                  />
                </div>
                {/* instruction */}
                <div className="">
                  <Controller
                    control={control}
                    name="instruction"
                    rules={{
                      required: "Instruction is required",
                    }}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.instruction}
                        className="space-y-1"
                      >
                        <FormLabel
                          error={!!errors.instruction}
                          className={`text-sm ${
                            errors.instruction
                              ? "text-red-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                          htmlFor="instruction"
                        >
                          Instructions to Join
                        </FormLabel>
                        <TextField
                          {...field}
                          placeholder="Provide clear instructions on how to members can join."
                          fullWidth
                          error={!!errors.instruction}
                          multiline
                          rows={4}
                          helperText={errors.instruction?.message || " "}
                          size="small"
                        />
                      </FormControl>
                    )}
                  />
                </div>
                {/* country */}
                <div className="">
                  <Controller
                    control={control}
                    name="country"
                    rules={{
                      required: "Country is required",
                      // validate: (value) => {
                      //   // if the product is not digital, country is required
                      //   if (!digitalProduct && !value) {
                      //     return "Country is required";
                      //   }
                      // },
                    }}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.country}
                        className="space-y-1"
                      >
                        <FormLabel
                          error={!!errors.country}
                          className={`text-sm ${
                            errors.country
                              ? "text-red-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                          htmlFor="country"
                        >
                          Country
                        </FormLabel>
                        <Select
                          {...field}
                          onChange={(event) => {
                            handleSelectedCurrency(event);
                            field.onChange(event);
                            setValue("state", "");
                            const findCountry = countryList.find(
                              (item: any) => item.value === event.target.value,
                            );
                            if (findCountry) {
                              setValue("currency", findCountry.currency);
                              clearErrors("currency");
                            }
                          }}
                          // disableUnderline
                          displayEmpty
                          fullWidth
                          error={!!errors.country}
                          // className={`rounded-lg border text-sm ${
                          //   errors.country
                          //     ? "border-red-700"
                          //     : "border-gray-700 focus-within:border-gray-700 hover:border-gray-700"
                          // }`}
                          size="small"
                          MenuProps={MenuProps}
                        >
                          <MenuItem
                            value=""
                            onClick={() => {
                              setValue("currency", "");
                            }}
                          >
                            Select a Country
                          </MenuItem>
                          {countryList.map((item: any) => (
                            <MenuItem
                              key={item.id}
                              value={item.value}
                              // onClick={() => {
                              //   setSelectedCountry(item.value);
                              // }}
                            >
                              {item.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {!errors.country?.message ? (
                          <div className="h-5" />
                        ) : (
                          <span className="pt-1 pl-4 text-xs text-red-400">
                            {errors.country?.message}
                          </span>
                        )}
                      </FormControl>
                    )}
                  />
                </div>
                {/* state */}
                <div className="">
                  <Controller
                    control={control}
                    name="state"
                    rules={{
                      // required: "State is required",
                      validate: (value) => {
                        // if the product is not digital, state is required
                        if (!digitalProduct && !value) {
                          return "State is required";
                        }
                      },
                    }}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.state}
                        className="space-y-1"
                      >
                        <FormLabel
                          error={!!errors.state}
                          className={`text-sm ${
                            errors.state
                              ? "text-red-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                          htmlFor="state"
                        >
                          State
                        </FormLabel>
                        <Select
                          {...field}
                          // variant="outlined"
                          // disableUnderline
                          displayEmpty
                          fullWidth
                          error={!!errors.state}
                          disabled={stateList.length === 0}
                          // className={`rounded-lg border text-sm ${
                          //   errors.state
                          //     ? "border-red-700"
                          //     : "border-gray-700 focus-within:border-gray-700 hover:border-gray-700"
                          // }`}
                          size="small"
                          MenuProps={MenuProps}
                        >
                          <MenuItem value="">Select a State</MenuItem>
                          {stateList.map((item: any) => (
                            <MenuItem key={item.id} value={item.value}>
                              {item.label}
                            </MenuItem>
                          ))}
                        </Select>
                        {!errors.state?.message ? (
                          <span className="pt-1 pl-4 text-xs">
                            Please select a country first.
                          </span>
                        ) : (
                          <span className="pt-1 pl-4 text-xs text-red-400">
                            {errors.state?.message}
                          </span>
                        )}
                      </FormControl>
                    )}
                  />
                </div>
                {/* currency */}
                <div className="">
                  <Controller
                    control={control}
                    name="currency"
                    rules={{
                      // required: "Currency is required",
                      validate: (value) => {
                        // if the product is not digital, currency is required
                        if (!digitalProduct && !value) {
                          return "Currency is required";
                        }
                      },
                    }}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.currency}
                        className="space-y-1"
                      >
                        <FormLabel
                          error={!!errors.currency}
                          className={`text-sm ${
                            errors.currency
                              ? "text-red-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                          htmlFor="currency"
                        >
                          Currency
                        </FormLabel>
                        <TextField
                          {...field}
                          fullWidth
                          error={!!errors.currency}
                          helperText={
                            errors.currency?.message ||
                            "Select a country to get currency"
                          }
                          slotProps={{
                            input: {
                              readOnly: true,
                            },
                          }}
                          size="small"
                        />
                      </FormControl>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-2">
                {/* expiresAt */}
                <div className="">
                  <Controller
                    control={control}
                    name="expiresAt"
                    rules={{
                      required: "Expiration date is required",
                      validate: (value) => {
                        if (value.isBefore(dayjs())) {
                          return "Expiration date must be in the future";
                        }
                      },
                    }}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.expiresAt}
                        className="space-y-1"
                      >
                        <FormLabel
                          error={!!errors.expiresAt}
                          className={`text-sm ${
                            errors.expiresAt
                              ? "text-red-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                          htmlFor="expiresAt"
                        >
                          Expiration Date
                        </FormLabel>
                        <DateTimePicker
                          {...field}
                          value={field.value}
                          onChange={(newValue) => {
                            field.onChange(newValue);
                          }}
                          slotProps={{
                            textField: {
                              error: !!errors.expiresAt,
                              size: "small",
                              helperText: errors.expiresAt?.message || " ",
                            },
                          }}
                          disableHighlightToday
                          disablePast
                          minDate={dayjs()}
                        />
                      </FormControl>
                    )}
                  />
                </div>
                {/* location */}
                <div className="">
                  <Controller
                    control={control}
                    name="location"
                    rules={{
                      // required: "Location is required",
                      validate: (value) => {
                        // if the product is not digital, location is required
                        if (!digitalProduct && !value) {
                          return "Location is required";
                        }
                      },
                    }}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.location}
                        className="space-y-1"
                      >
                        <FormLabel
                          error={!!errors.location}
                          className={`text-sm ${
                            errors.location
                              ? "text-red-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                          htmlFor="location"
                        >
                          Meet-up Location
                        </FormLabel>
                        <TextField
                          {...field}
                          fullWidth
                          multiline
                          rows={3}
                          error={!!errors.location}
                          size="small"
                          helperText={errors.location?.message || " "}
                        />
                      </FormControl>
                    )}
                  />
                </div>
                {/* short description */}
                <div className="">
                  <Controller
                    control={control}
                    name="shortDescription"
                    rules={{
                      required: "Short description is required",
                      maxLength: {
                        value: 150,
                        message:
                          "Short description must be less than 150 characters",
                      },
                    }}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.shortDescription}
                        className="mb-2 space-y-1"
                      >
                        <FormLabel
                          error={!!errors.shortDescription}
                          className={`text-sm ${
                            errors.shortDescription
                              ? "text-red-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                          htmlFor="shortDescription"
                        >
                          Short Description
                        </FormLabel>
                        <TextField
                          {...field}
                          fullWidth
                          error={!!errors.shortDescription}
                          size="small"
                          helperText={
                            errors.shortDescription?.message ||
                            "max 150 characters"
                          }
                        />
                      </FormControl>
                    )}
                  />
                </div>
                {/* long description */}
                <div className="">
                  <Controller
                    control={control}
                    name="longDescription"
                    rules={{
                      required: "Long description is required",
                    }}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.longDescription}
                        className="space-y-1"
                      >
                        <FormLabel
                          error={!!errors.longDescription}
                          className={`text-sm ${
                            errors.longDescription
                              ? "text-red-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                          htmlFor="longDescription"
                        >
                          Long Description
                        </FormLabel>
                        <TextField
                          {...field}
                          fullWidth
                          error={!!errors.longDescription}
                          size="small"
                          helperText={errors.longDescription?.message || " "}
                          multiline
                          rows={2}
                        />
                      </FormControl>
                    )}
                  />
                </div>
                {/* special information */}
                <div className="">
                  <Controller
                    control={control}
                    name="specialInformation"
                    // rules={{
                    //   required: "Special information is required",
                    // }}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.specialInformation}
                        className="space-y-1"
                      >
                        <FormLabel
                          error={!!errors.specialInformation}
                          className={`text-sm ${
                            errors.specialInformation
                              ? "text-red-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                          htmlFor="specialInformation"
                        >
                          Special Information (If applicable)
                        </FormLabel>
                        <TextField
                          {...field}
                          placeholder="Any special information about the item."
                          multiline
                          rows={2}
                          fullWidth
                          error={!!errors.specialInformation}
                          size="small"
                          helperText={errors.specialInformation?.message || " "}
                        />
                      </FormControl>
                    )}
                  />
                </div>
                {/* display name */}
                <div className="">
                  <Controller
                    control={control}
                    name="contactName"
                    rules={{
                      required: "Display name is required",
                    }}
                    render={({ field }) => (
                      <FormControl
                        fullWidth
                        error={!!errors.contactName}
                        className="space-y-1"
                      >
                        <FormLabel
                          error={!!errors.contactName}
                          className={`text-sm ${
                            errors.contactName
                              ? "text-red-400"
                              : "text-gray-900 dark:text-white"
                          }`}
                          htmlFor="contactName"
                        >
                          Display Name
                        </FormLabel>
                        <TextField
                          {...field}
                          fullWidth
                          error={!!errors.contactName}
                          size="small"
                          helperText={errors.contactName?.message || " "}
                        />
                      </FormControl>
                    )}
                  />
                </div>

                {/* contact method */}
                <div className="">
                  <FormControl fullWidth className="space-y-1">
                    <FormLabel
                      className={`text-sm ${
                        errors.contactMethod
                          ? "text-red-400"
                          : "text-gray-900 dark:text-white"
                      }`}
                      htmlFor="contactMethod"
                    >
                      Contact Method
                    </FormLabel>
                    <div className="flex items-center space-x-4">
                      <Controller
                        control={control}
                        name="emailSelected"
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...field}
                                checked={selectedOption.emailSelected}
                                onChange={(event) => {
                                  field.onChange(event);
                                  handleSelectedContactMethod(event);
                                  clearErrors("contactMethod");
                                }}
                              />
                            }
                            label="Email"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="phoneSelected"
                        render={({ field }) => (
                          <FormControlLabel
                            control={
                              <Checkbox
                                {...field}
                                checked={selectedOption.phoneSelected}
                                onChange={(event) => {
                                  field.onChange(event);
                                  handleSelectedContactMethod(event);
                                  clearErrors("contactMethod");
                                }}
                              />
                            }
                            label="Phone"
                          />
                        )}
                      />
                    </div>
                    {!errors.contactMethod?.message ? (
                      <span className="pt-1 pl-4 text-xs">
                        Please select at least one contact method.
                      </span>
                    ) : (
                      <span className="pt-1 pl-4 text-xs text-red-400">
                        {errors.contactMethod?.message}
                      </span>
                    )}
                  </FormControl>
                </div>
                {/* email | phone */}
                <div className="">
                  {selectedOption.emailSelected && (
                    <Controller
                      control={control}
                      name="contactEmail"
                      rules={{
                        validate: (value) => {
                          if (selectedOption.emailSelected) {
                            if (!value) {
                              return "Email is required";
                            }
                            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                            if (!emailRegex.test(value)) {
                              return "Invalid email address";
                            }
                          }
                          return true;
                        },
                      }}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          error={!!errors.contactEmail}
                          className="space-y-1"
                        >
                          <FormLabel
                            error={!!errors.contactEmail}
                            className={`text-sm ${
                              errors.contactEmail
                                ? "text-red-400"
                                : "text-gray-900 dark:text-white"
                            }`}
                            htmlFor="contactEmail"
                          >
                            Email
                          </FormLabel>
                          <TextField
                            {...field}
                            fullWidth
                            error={!!errors.contactEmail}
                            size="small"
                            helperText={errors.contactEmail?.message || " "}
                          />
                        </FormControl>
                      )}
                    />
                  )}
                  {selectedOption.phoneSelected && (
                    <Controller
                      control={control}
                      name="phone"
                      rules={{
                        validate: (value) => {
                          if (selectedOption.phoneSelected) {
                            if (!value) {
                              return "Phone number is required";
                            }
                          }
                          return true;
                        },
                      }}
                      render={({ field }) => (
                        <FormControl
                          fullWidth
                          error={!!errors.phone}
                          className="space-y-1"
                        >
                          <FormLabel
                            error={!!errors.phone}
                            className={`text-sm ${
                              errors.phone
                                ? "text-red-400"
                                : "text-gray-900 dark:text-white"
                            }`}
                            htmlFor="phone"
                          >
                            Phone Number
                          </FormLabel>
                          <TextField
                            {...field}
                            type="tel"
                            placeholder="Include country code"
                            fullWidth
                            error={!!errors.phone}
                            size="small"
                            helperText={
                              errors.phone?.message ||
                              "please include country code"
                            }
                            slotProps={{
                              input: {
                                startAdornment: (
                                  <Controller
                                    name="phone_code"
                                    control={control}
                                    render={({ field }) => (
                                      <FormControl
                                        size="small"
                                        sx={{
                                          marginLeft: "-8px",
                                        }}
                                      >
                                        <Select
                                          {...field}
                                          size="small"
                                          variant="standard"
                                          disableUnderline
                                          displayEmpty
                                          MenuProps={MenuProps}
                                          renderValue={(value) => {
                                            const selectedCountry =
                                              countryList.find(
                                                (item: any) =>
                                                  item.phone_code === value,
                                              );
                                            return selectedCountry
                                              ? `+${selectedCountry.phone_code}`
                                              : "🌍+00";
                                          }}
                                          sx={{
                                            width: "75px",
                                            marginRight: "8px",
                                            marginLeft: "-8px",
                                            "& .MuiSelect-select": {
                                              paddingLeft: "8px",
                                              paddingRight: "8px",
                                            },
                                          }}
                                        >
                                          {countryList.map((country: any) => (
                                            <MenuItem
                                              key={country.id}
                                              value={country.phone_code}
                                            >
                                              {country.flag} +
                                              {country.phone_code}{" "}
                                              {country.label}
                                            </MenuItem>
                                          ))}
                                        </Select>
                                      </FormControl>
                                    )}
                                  />
                                ),
                              },
                            }}
                          />
                        </FormControl>
                      )}
                    />
                  )}
                </div>
              </div>
              {/* images */}
              <div className="space-y-2">
                {/* cover image */}
                <div className="h-[22rem]">
                  {itemImage.length === 0 ? (
                    <div
                      {...getRootProps()}
                      className="flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 transition duration-300 ease-in-out hover:cursor-pointer hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500 dark:hover:bg-gray-700"
                    >
                      <input {...getInputProps()} />
                      {isDragAccept && (
                        <Typography
                          variant="body2"
                          className="font-poppins text-center text-xs text-green-600"
                        >
                          Drop the file here ...
                        </Typography>
                      )}
                      {isDragReject && (
                        <p
                          className="font-poppins text-xs text-red-600"
                          text-center
                        >
                          Either file type is not accepted or file size is more
                          than 9mb, sorry!
                        </p>
                      )}
                      {!isDragActive && (
                        <Typography
                          variant="body2"
                          className="font-poppins text-center text-sm text-gray-600 md:text-base dark:text-gray-400"
                        >
                          Upload image (required)
                        </Typography>
                      )}
                    </div>
                  ) : (
                    <Image
                      src={itemImage[0]?.preview}
                      alt="Item Image"
                      className="h-[90%] w-full rounded-lg object-contain"
                      width={500}
                      height={500}
                    />
                  )}
                  {itemImage.length > 0 && (
                    <div className="flex items-center justify-center">
                      <Button
                        variant="outlined"
                        color="error"
                        className="font-poppins mt-2 rounded-lg text-xs normal-case"
                        onClick={handleRemoveImage}
                      >
                        Remove Image
                      </Button>
                    </div>
                  )}
                </div>
                {/* other images */}
                <div className="grid grid-cols-1 gap-4 py-2 md:grid-cols-2">
                  {/* first more image */}
                  <div className="h-[16rem]">
                    {moreImage1.length === 0 ? (
                      <div
                        {...getRootProps1()}
                        className="flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 transition duration-300 ease-in-out hover:cursor-pointer hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500 dark:hover:bg-gray-700"
                      >
                        <input {...getInputProps1()} />
                        {isDragAccept1 && (
                          <Typography
                            variant="body2"
                            className="font-poppins text-center text-xs text-green-600"
                          >
                            Drop the file here ...
                          </Typography>
                        )}
                        {isDragReject1 && (
                          <p
                            className="font-poppins text-xs text-red-600"
                            text-center
                          >
                            Either file type is not accepted or file size is
                            more than 9mb, sorry!
                          </p>
                        )}
                        {!isDragActive1 && (
                          <Typography
                            variant="body2"
                            className="font-poppins text-center text-xs text-gray-600 normal-case dark:text-gray-400"
                          >
                            Additional Image (optional)
                          </Typography>
                        )}
                      </div>
                    ) : (
                      <div className="h-full">
                        <Image
                          src={moreImage1[0]?.preview}
                          alt="Additional image 1"
                          className="h-[85%] w-full rounded-lg object-contain"
                          width={500}
                          height={500}
                        />
                        <div className="flex items-center justify-center">
                          <Button
                            variant="outlined"
                            color="error"
                            className="font-poppins mt-2 rounded-lg text-xs normal-case"
                            onClick={handleRemoveImage1}
                          >
                            Remove Image
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                  {/* second more image */}
                  <div className="h-[16rem]">
                    {moreImage2.length === 0 ? (
                      <div
                        {...getRootProps2()}
                        className="flex h-full w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-100 transition duration-300 ease-in-out hover:cursor-pointer hover:bg-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:hover:border-gray-500 dark:hover:bg-gray-700"
                      >
                        <input {...getInputProps2()} />
                        {isDragAccept2 && (
                          <Typography
                            variant="body2"
                            className="font-poppins text-center text-xs text-green-600"
                          >
                            Drop the file here ...
                          </Typography>
                        )}
                        {isDragReject2 && (
                          <p
                            className="font-poppins text-xs text-red-600"
                            text-center
                          >
                            Either file type is not accepted or file size is
                            more than 9mb, sorry!
                          </p>
                        )}
                        {!isDragActive2 && (
                          <Typography
                            variant="body2"
                            className="font-poppins text-center text-xs text-gray-600 normal-case dark:text-gray-400"
                          >
                            Additional Image (optional)
                          </Typography>
                        )}
                      </div>
                    ) : (
                      <div className="h-full">
                        <Image
                          src={moreImage2[0]?.preview}
                          alt="Additional image 2"
                          className="h-[85%] w-full rounded-lg object-contain"
                          width={500}
                          height={500}
                        />
                        <div className="flex items-center justify-center">
                          <Button
                            variant="outlined"
                            color="error"
                            className="font-poppins mt-2 rounded-lg text-xs normal-case"
                            onClick={handleRemoveImage2}
                          >
                            Remove Image
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
            {/* submit button */}
            <div className="mt-5 flex items-center justify-end">
              <Button
                variant="outlined"
                color="error"
                className="font-poppins mr-2 w-[40%] rounded-xl normal-case md:w-[30%] lg:w-[20%]"
                onClick={() => {
                  handleOpenCloseItemDialog();
                }}
              >
                Close Item
              </Button>
              <Button
                variant="contained"
                color="primary"
                className="font-poppins w-[40%] rounded-xl normal-case md:w-[30%] lg:w-[20%]"
                type="submit"
              >
                Update Item
              </Button>
            </div>
          </form>
        </div>
      </section>
      {/* close item dialog */}
      <CustomDialog
        title="Close Item"
        message="Are you sure you want to close this item. It will not be visible for others to join again?"
        buttonText="Close Item"
        openDialog={closeItemDialog}
        handleCloseDialog={handleCloseItemDialog}
        selectedItem={selectedItem}
        handleAction={handleCloseItem}
      />
    </div>
  );
};

export default EditItemPage;
