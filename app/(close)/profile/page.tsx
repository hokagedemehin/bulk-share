"use client";
import { useCloseBackdrop } from "@/hooks/backdrop";
import {
  Button,
  FormControl,
  FormLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
  TextField,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { fetchUserAttributes } from "aws-amplify/auth";
import { country_states } from "@/util/helpers/country_state";
import { enqueueSnackbar } from "notistack";
import parsePhoneNumberFromString from "libphonenumber-js";
import { updateUserAttributes } from "aws-amplify/auth";
import dayjs from "dayjs";

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

const ProfilePage = () => {
  useCloseBackdrop();

  /*********************************************
   * REACT HOOK FORM
   * **********************************************/
  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    clearErrors,
    setError,
  } = useForm({
    defaultValues: {
      given_name: "",
      family_name: "",
      email: "",
      phone: "",
      country: "",
      state: "",
      currency: "",
      phone_code: "",
    },
  });

  useEffect(() => {
    (async () => {
      const user = await fetchUserAttributes();
      console.log("user", user);
      if (user) {
        setValue("given_name", user.given_name || "");
        setValue("family_name", user.family_name || "");
        setValue("email", user.email || "");
        setValue("phone", user["custom:phone"] || "");
        setValue("country", user["custom:country"] || "");
        if (user["custom:country"]) {
          const filterStates = country_states.filter(
            (item: any) => item.name === user["custom:country"],
          );
          if (filterStates.length > 0) {
            const tempArr: any = [];
            filterStates[0].states.map((state: any) => {
              tempArr.push({
                id: state.id,
                label: state.name,
                value: state.name,
              });
            });
            setStateList(tempArr);
            setValue("state", user["custom:state"] || "");
          }
        }
        // setValue("state", user["custom:state"] || "");
        setValue("currency", user["custom:currency"] || "");
        setValue("phone_code", user["custom:phone_code"] || "");
      }
    })();
    return () => {};
  }, [setValue]);

  const onSubmit = async (data: any) => {
    console.log("Form Data: ", data);
    if (!data?.phone_code) {
      enqueueSnackbar("Please select your country code", {
        variant: "error",
      });
      return;
    }
    const fullPhoneNumber = `${data.phone_code}${data.phone}`;
    const findCountry = country_states.find(
      (item: any) => item.phone_code === data.phone_code,
    );
    if (!findCountry) {
      enqueueSnackbar("Please select a valid country phone code", {
        variant: "error",
      });
      return;
    } else {
      const parsedNumber = parsePhoneNumberFromString(
        fullPhoneNumber,
        findCountry.iso2 as any,
      );
      console.log("parsedNumber", parsedNumber);
      if (!parsedNumber?.isValid()) {
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

    try {
      await updateUserAttributes({
        userAttributes: {
          given_name: data.given_name,
          family_name: data.family_name,
          email: data.email,
          "custom:phone": data.phone,
          "custom:country": data.country,
          "custom:state": data.state,
          "custom:currency": data.currency,
          "custom:phone_code": data.phone_code,
          updated_at: dayjs().unix().toString(),
        },
      });
      enqueueSnackbar("Profile updated successfully", {
        variant: "success",
      });
      localStorage.setItem("bulk_share_country", data.country);
      localStorage.setItem("bulk_share_state", data.state);
      localStorage.setItem("bulk_share_currency", data.currency);
      localStorage.setItem("bulk_share_phone_code", data.phone_code);
      localStorage.setItem("bulk_share_phone", data.phone);
      localStorage.setItem(
        "bulk_share_name",
        `${data.given_name} ${data.family_name}`,
      );
    } catch (error) {
      console.error("Error updating user attributes", error);
      enqueueSnackbar("Error updating profile. Please try again.", {
        variant: "error",
      });
      return;
    }
  };

  /*********************************************
   * COUNTRY | STATE | CURRENCY
   * **********************************************/
  const [countryList, setCountryList] = useState([] as any);
  const [selectedCountry, setSelectedCountry] = useState("");
  // const [phoneCountry, setPhoneCountry] = useState("" as any);
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
    //   // setCountryCode(findCountry.iso2);
    // }
  };

  return (
    <div className="px-2 pt-5">
      <section className="container mx-auto my-5">
        <div className="">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Profile
          </h1>
          <p className="mt-2 text-sm text-gray-600 md:text-base">
            See your profile information and manage your account settings.
          </p>
        </div>
      </section>
      <section className="container mx-auto my-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* first name */}
          <div className="space-y-2">
            <Controller
              control={control}
              name="given_name"
              rules={{
                required: "First name is required",
              }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={!!errors.given_name}
                  className="space-y-1"
                >
                  <FormLabel
                    error={!!errors.given_name}
                    className={`text-sm ${
                      errors.given_name
                        ? "text-red-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                    htmlFor="given_name"
                  >
                    First Name
                  </FormLabel>
                  <TextField
                    {...field}
                    fullWidth
                    error={!!errors.given_name}
                    helperText={errors.given_name?.message || " "}
                    size="small"
                  />
                </FormControl>
              )}
            />
          </div>
          {/* last name */}
          <div className="space-y-2">
            <Controller
              control={control}
              name="family_name"
              rules={{
                required: "Last name is required",
              }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={!!errors.family_name}
                  className="space-y-1"
                >
                  <FormLabel
                    error={!!errors.family_name}
                    className={`text-sm ${
                      errors.family_name
                        ? "text-red-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                    htmlFor="family_name"
                  >
                    Last Name
                  </FormLabel>
                  <TextField
                    {...field}
                    fullWidth
                    error={!!errors.family_name}
                    helperText={errors.family_name?.message || " "}
                    size="small"
                  />
                </FormControl>
              )}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* email */}
          <div className="space-y-2">
            <Controller
              control={control}
              name="email"
              rules={{
                validate: (value) => {
                  if (!value) {
                    return "Email is required";
                  }
                  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                  if (!emailRegex.test(value)) {
                    return "Invalid email address";
                  }
                  return true;
                },
              }}
              render={({ field }) => (
                <FormControl
                  fullWidth
                  error={!!errors.email}
                  className="space-y-1"
                >
                  <FormLabel
                    error={!!errors.email}
                    className={`text-sm ${
                      errors.email
                        ? "text-red-400"
                        : "text-gray-900 dark:text-white"
                    }`}
                    htmlFor="email"
                  >
                    Email
                  </FormLabel>
                  <TextField
                    {...field}
                    fullWidth
                    error={!!errors.email}
                    size="small"
                    helperText={errors.email?.message || " "}
                    slotProps={{
                      input: {
                        readOnly: true,
                      },
                    }}
                  />
                </FormControl>
              )}
            />
          </div>
          {/* phone */}
          <div className="space-y-2">
            <Controller
              control={control}
              name="phone"
              rules={{
                validate: (value) => {
                  if (!value) {
                    return "Phone number is required";
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
                      errors.phone?.message || "please select your country code"
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
                                  // width: "170px",
                                  // marginRight: "8px",
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
                                    const selectedCountry = countryList.find(
                                      (item: any) => item.phone_code === value,
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
                                      {country.flag} +{country.phone_code}{" "}
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
          </div>
        </div>
      </section>
      <section className="container mx-auto mt-6 mb-3 border-t-2 border-dashed border-gray-200 pt-4 dark:border-gray-700">
        <div className="">
          <h2 className="font-poppins text-xl font-semibold">
            My List Defaults
          </h2>
          <p className="mt-2 text-sm text-gray-600 md:text-base">
            Set your default values to be used when creating or updating your
            lists.
          </p>
        </div>

        <div className="my-3 grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* country */}
          <div className="">
            <Controller
              control={control}
              name="country"
              rules={{
                required: "Country is required",
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
                    displayEmpty
                    fullWidth
                    error={!!errors.country}
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
                      <MenuItem key={item.id} value={item.value}>
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
                  if (!value) {
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
                    displayEmpty
                    fullWidth
                    error={!!errors.state}
                    disabled={stateList.length === 0}
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
                  if (!value) {
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
      </section>
      <section className="container mx-auto my-5">
        <div className="flex justify-end">
          <Button
            type="submit"
            className="rounded bg-blue-600 px-4 py-2 text-white normal-case hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:outline-none"
            onClick={handleSubmit(onSubmit)}
          >
            Save Changes
          </Button>
        </div>
      </section>
    </div>
  );
};

export default ProfilePage;
