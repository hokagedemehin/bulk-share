"use client";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";

import { useCloseBackdrop } from "@/hooks/backdrop";
import { BackRouter } from "@/util/helpers/routers";
import {
  Avatar,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormLabel,
  IconButton,
  TextField,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { useSharedItems } from "@/hooks/items";
import Image from "next/image";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";
import { enqueueSnackbar } from "notistack";
import { useAppDispatch } from "@/util/store/store";
import {
  setCloseBackdrop,
  setOpenBackdrop,
} from "@/util/store/slice/backdropSlice";
import { v4 as uuidv4 } from "uuid";
import CustomDialog from "@/components/layout/CustomDialog";
import { Controller, useForm } from "react-hook-form";
import { getAllISOCodes } from "iso-country-currency";
import { useParams } from "next/navigation";
import {
  SESv2Client,
  SendEmailCommand,
  SendEmailCommandInput,
} from "@aws-sdk/client-sesv2";
import { fetchAuthSession } from "aws-amplify/auth";

Amplify.configure(outputs);

const client = generateClient<Schema>();

function stringToColor(string: string) {
  let hash = 0;
  let i;

  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }

  return color;
}

function stringAvatar(name: string) {
  return {
    sx: {
      bgcolor: stringToColor(name),
    },
    children: `${name.split(" ")[0][0].toUpperCase()}${name.split(" ")[1] ? name.split(" ")[1][0].toUpperCase() : ""}`,
  };
}

const maskString = (str: string) => {
  if (!str || str.length < 2) return "*";
  return (
    str[0].toLocaleUpperCase() +
    "*".repeat(str.length - 2) +
    str[str.length - 1]
  );
};

const maskEmail = (email: string) => {
  if (!email.includes("@")) return maskString(email);
  const [local, domain] = email.split("@");
  return maskString(local) + "@" + domain;
};

const maskPhone = (phone: string) => {
  const digits = phone.replace(/\D/g, "");
  if (digits.length <= 4) return digits;
  const visiblePart = digits.slice(-4);
  const maskedPart = "*".repeat(digits.length - 4);
  return maskedPart + visiblePart;
};

const ItemDetailsPage = () => {
  useCloseBackdrop();
  const backRouter = BackRouter();
  const { id } = useParams();
  const { getSharedItemDetails } = useSharedItems();
  const app_dispatch = useAppDispatch();
  const currencyList = useMemo(() => getAllISOCodes(), []);

  const [itemDetails, setItemDetails] = useState([] as any);

  const [confirmedMembers, setConfirmedMembers] = useState([] as any);

  // console.log("itemDetails :>> ", itemDetails);

  useEffect(() => {
    (async () => {
      const data = await getSharedItemDetails(id as string);
      if (data) {
        setItemDetails(data);
        const confirmed = data?.members?.filter(
          (member: any) => member.status === "confirmed",
        );
        setConfirmedMembers(confirmed);
      }
      const session = await fetchAuthSession();
      console.log("session :>> ", session);
    })();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /*********************************************
   * REMOVE SELF DIALOG
   * **********************************************/
  const [openRemoveSelfDialog, setOpenRemoveSelfDialog] = useState(false);
  const [selectedSelf, setSelectedSelf] = useState(null as any);

  // const handleOpenRemoveSelfDialog = (item: any) => {
  //   setSelectedSelf(item);
  //   setOpenRemoveSelfDialog(true);
  // };

  const handleCloseRemoveDialog = () => {
    setOpenRemoveSelfDialog(false);
    setSelectedSelf(null);
  };

  const handleRemoveSelf = async () => {
    setOpenRemoveSelfDialog(false);

    try {
      app_dispatch(setOpenBackdrop());
      // move the member to removemMembers list

      const { data: removedSelf, errors } = await client.models.ListItem.update(
        {
          id: itemDetails?.id,
          removedMembers: JSON.stringify([
            ...(itemDetails?.removedMembers || []),
            {
              id: selectedSelf?.id,
              userSub: selectedSelf?.userSub,
              contactName: selectedSelf?.contactName,
              contactEmail: selectedSelf?.contactEmail,
              contactPhone: selectedSelf?.contactPhone,
              isOwner: selectedSelf?.isOwner,
              status: "removed",
            },
          ]),
          members: JSON.stringify(
            itemDetails?.members?.filter(
              (member: any) => member.id !== selectedSelf?.id,
            ),
          ),
        },
      );

      if (removedSelf) {
        app_dispatch(setCloseBackdrop());
        // console.log("removedMember :>> ", removedMember);
        enqueueSnackbar(`You have been removed from the group successfully`, {
          variant: "success",
        });
        const parsedItem = {
          ...removedSelf,
          members: JSON.parse(removedSelf.members as string),
          removedMembers: JSON.parse(
            removedSelf.removedMembers as string,
          )?.filter((member: any) => member.status === "removed"),
          otherImages: JSON.parse(removedSelf.otherImages as string),
        };
        setItemDetails(parsedItem);

        const confirmed = parsedItem?.members?.filter(
          (member: any) => member.status === "confirmed",
        );
        setConfirmedMembers(confirmed);
        setSelectedSelf(null);
        setOpenRemoveSelfDialog(false);
        return;
      }

      if (errors) {
        app_dispatch(setCloseBackdrop());
        console.error("Error removing member", errors);
        enqueueSnackbar("Error removing member. Please try again.", {
          variant: "error",
        });
        return;
      }
    } catch (error) {
      app_dispatch(setCloseBackdrop());
      console.error("Error removing member", error);
      enqueueSnackbar("Error removing member. Please try again.", {
        variant: "error",
      });
    }
  };

  /*********************************************
   * ADD SELF DIALOG
   * **********************************************/
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    clearErrors,
  } = useForm({
    defaultValues: {
      contactName: "",
      contactEmail: "",
      contactPhone: "",
      contactMethod: "",
      emailSelected: false,
      phoneSelected: false,
      isOwner: false,
    },
  });
  const [openAddSelfDialog, setOpenAddSelfDialog] = useState(false);
  const handleOpenAddSelfDialog = () => {
    setOpenAddSelfDialog(true);
  };
  const handleCloseAddSelfDialog = () => {
    setOpenAddSelfDialog(false);
  };
  const onSubmit = async (data: any) => {
    setOpenAddSelfDialog(false);

    try {
      app_dispatch(setOpenBackdrop());
      // add member to the group

      const { data: addSelf, errors } = await client.models.ListItem.update({
        id: itemDetails?.id,
        members: JSON.stringify([
          ...(itemDetails?.members || []),
          {
            id: uuidv4(),
            userSub: uuidv4(),
            contactName: data?.contactName,
            contactEmail: data?.contactEmail,
            contactPhone: data?.contactPhone,
            isOwner: data?.isOwner,
            status: "pending",
          },
        ]),
      });

      if (addSelf) {
        app_dispatch(setCloseBackdrop());
        enqueueSnackbar(`Your request has been sent for confirmation`, {
          variant: "success",
          autoHideDuration: 6000,
        });
        const parsedItem = {
          ...addSelf,
          members: JSON.parse(addSelf.members as string),
          otherImages: JSON.parse(addSelf.otherImages as string),
          removedMembers: JSON.parse(addSelf.removedMembers as string)?.filter(
            (member: any) => member.status === "removed",
          ),
        };
        setItemDetails(parsedItem);

        const confirmed = parsedItem?.members?.filter(
          (member: any) => member.status === "confirmed",
        );
        setConfirmedMembers(confirmed);
        setOpenAddSelfDialog(false);
        reset();

        // send an email to the ower of the item
        try {
          const session = await fetchAuthSession();
          const emailClient = new SESv2Client({
            credentials: session.credentials,
            region: "eu-west-1", // Change to your region
          });
          const emailInput: SendEmailCommandInput = {
            FromEmailAddress: "sharing.bulk@gmail.com",
            FromEmailAddressIdentityArn:
              "arn:aws:ses:eu-west-1:927292413625:identity/sharing.bulk@gmail.com",
            Destination: {
              ToAddresses: [itemDetails?.contactEmail],
            },
            Content: {
              Simple: {
                Subject: {
                  Data: `New member request for ${itemDetails?.name}`,
                  Charset: "UTF-8",
                },
                Body: {
                  Text: {
                    Data: `Hello ${itemDetails?.contactName},\n\nA new member has requested to join your group for the item "${itemDetails?.name}".\n\nContact Name: ${data?.contactName}\nContact Email: ${data?.contactEmail}\nContact Phone: ${data?.contactPhone}\n\nPlease review and confirm their request.\n\nThank you!\n\nBulk Share Team\n\nItem Link: https://bulk-share.com/shared-items/${itemDetails?.id}\n\nIf you have any questions, please contact us at sharing.bulk@gmail.com`,
                    Charset: "UTF-8",
                  },
                  Html: {
                    Data: `<p>Hello ${itemDetails?.contactName},</p>
                    <p>A new member has requested to join your group for the item "<strong>${itemDetails?.name}</strong>".</p>
                    <p><strong>Contact Name:</strong> ${data?.contactName}</p>
                    <p><strong>Contact Email:</strong> ${data?.contactEmail}</p>
                    <p><strong>Contact Phone:</strong> ${data?.contactPhone}</p>
                    <p>Please review and confirm their request.</p>
                    <p>Thank you!</p>
                    <p><strong>Bulk Share Team</strong></p>
                    <p><a href="https://bulk-share.com/shared-items/${itemDetails?.id}">View Item</a></p>
                    <p>If you have any questions, please contact us at <a href="mailto:sharing.bulk@gmail.com">
                      sharing.bulk@gmail.com
                    </a>

                    `,
                    Charset: "UTF-8",
                  },
                },
              },
            },
          };
          const command = new SendEmailCommand(emailInput);
          await emailClient.send(command);
        } catch (error) {
          console.error("Error sending email", error);
        }
        return;
      }

      if (errors) {
        app_dispatch(setCloseBackdrop());
        console.error("Error adding member", errors);
        enqueueSnackbar("Error adding member. Please try again.", {
          variant: "error",
        });
        return;
      }
    } catch (error) {
      app_dispatch(setCloseBackdrop());
      console.error("Error adding member", error);
      enqueueSnackbar("Error adding member. Please try again.", {
        variant: "error",
      });
    }
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

  const handleWhatsappRedirect = () => {
    const message = `Hi, I’d like to know more details about ${itemDetails?.name}`;
    const url = `https://wa.me/${itemDetails?.contactPhone}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
  };

  const handleMailRedirect = () => {
    const subject = `Inquiry about ${itemDetails?.name}`;
    const body = `Hi, I’d like to know more details about ${itemDetails?.name}`;
    const mailtoLink = `mailto:${itemDetails?.contactEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    window.open(mailtoLink, "_blank");
    // window.location.href = mailtoLink;
  };

  return (
    <div className="px-2 pt-5">
      <section className="container mx-auto my-5">
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
        <div className="">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Item Details
          </h1>
          <p className="mt-2 text-sm text-gray-600 md:text-base">
            See the details of your item here and all the members that are part
            of the group
          </p>
        </div>
      </section>
      {/* members */}
      <section className="container mx-auto my-5">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {/* image */}
          <div className="">
            {itemDetails?.coverImage && (
              <Image
                src={itemDetails?.coverImage}
                alt={itemDetails?.name}
                width={1500}
                height={1000}
                className="mx-auto max-h-[40vh] w-auto rounded-lg shadow-md"
                priority
              />
            )}
          </div>
          {/* members */}
          <div className="">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <h4 className="text-xl font-bold md:text-2xl">Members</h4>
              </div>
              <div className="">
                <Button
                  variant="outlined"
                  className="hidden rounded-full normal-case md:flex"
                  onClick={() => {
                    handleOpenAddSelfDialog();
                  }}
                  startIcon={
                    <Icon
                      icon="material-symbols:group-add"
                      className="text-gray-900 dark:text-white"
                      width={20}
                      height={20}
                    />
                  }
                >
                  <span className="text-sm font-semibold">Join</span>
                </Button>
                <IconButton
                  aria-label="add member"
                  name="add-member"
                  className="flex rounded-full bg-gray-200 p-2 text-gray-900 md:hidden dark:bg-gray-600 dark:text-white"
                  onClick={() => {
                    handleOpenAddSelfDialog();
                  }}
                >
                  <Icon
                    icon="material-symbols:group-add"
                    className="text-gray-900 dark:text-white"
                    width={20}
                    height={20}
                  />
                </IconButton>
              </div>
            </div>
            <div className="">
              <div className="h-[28vh] overflow-y-auto">
                {confirmedMembers?.length > 0 &&
                  confirmedMembers?.map((member: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between space-x-3 border-b border-gray-200 py-2 dark:border-gray-600"
                    >
                      <div className="flex w-full items-center space-x-2">
                        <Avatar
                          {...stringAvatar(member?.contactName)}
                          alt={member?.contactName}

                          // className="h-10 w-10"
                        />
                        <div className="w-[80%]">
                          <div className="flex">
                            <p className="font-poppins text-sm font-semibold text-gray-900 md:text-base dark:text-white">
                              {member?.isOwner
                                ? member?.contactName
                                : maskString(member?.contactName)}{" "}
                            </p>
                            {member?.isOwner && (
                              <span className="ml-2 h-fit rounded-full bg-blue-100 px-2 py-1 text-xs font-semibold text-blue-800 dark:bg-blue-900 dark:text-blue-300">
                                Owner
                              </span>
                            )}
                          </div>
                          <p className="font-poppins text-xs text-gray-500">
                            {member?.isOwner
                              ? member?.contactEmail
                              : `${maskEmail(member?.contactEmail)}`}
                          </p>
                          <p className="text-xs text-gray-500">
                            {member?.isOwner
                              ? member?.contactPhone
                              : `${maskPhone(member?.contactPhone)}`}
                          </p>
                        </div>
                      </div>
                      <div className="">
                        {member?.isOwner && (
                          <div className="flex items-center space-x-3">
                            {itemDetails?.contactPhone && (
                              <IconButton
                                aria-label="accept"
                                className="rounded-full bg-[#25D366] p-2 text-white transition duration-300 ease-in-out"
                                onClick={() => {
                                  handleWhatsappRedirect();
                                }}
                              >
                                <Icon
                                  icon="ic:outline-whatsapp"
                                  className="text-white"
                                  width={20}
                                  height={20}
                                />
                              </IconButton>
                            )}
                            {itemDetails?.contactEmail && (
                              <IconButton
                                aria-label="delete"
                                className="rounded-full bg-blue-500 p-2 text-white transition duration-300 ease-in-out"
                                onClick={() => {
                                  handleMailRedirect();
                                }}
                              >
                                <Icon
                                  icon="fluent:mail-28-regular"
                                  className="text-white"
                                  width={20}
                                  height={20}
                                />
                              </IconButton>
                            )}
                          </div>
                        )}
                        {/* {!member?.isOwner && (
                          <div className="flex items-center space-x-3">
                            <IconButton
                              aria-label="delete"
                              className="rounded-full bg-red-500 p-2 text-white transition duration-300 ease-in-out hover:bg-red-600"
                              onClick={() => {
                                handleOpenRemoveSelfDialog(member);
                              }}
                            >
                              <Icon
                                icon="material-symbols:delete-outline"
                                className="text-white"
                                width={20}
                                height={20}
                              />
                            </IconButton>
                          </div>
                        )} */}
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* item details */}
      <section className="container mx-auto mt-5">
        {/* instructions */}
        <div className="my-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="">
            <p className="font-poppins text-sm font-semibold text-gray-900 md:text-base dark:text-white">
              Instructions for this item
            </p>
            <p className="font-poppins text-sm text-gray-500 md:text-base">
              {itemDetails?.instruction ? itemDetails?.instruction : "-"}
            </p>
          </div>

          <div className="">
            <p className="font-poppins text-sm font-semibold text-gray-900 md:text-base dark:text-white">
              Special Information
            </p>
            <p className="font-poppins text-sm text-gray-500 md:text-base">
              {itemDetails?.specialInformation
                ? itemDetails?.specialInformation
                : "-"}
            </p>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-5">
            <div className="">
              <p className="font-poppins text-sm font-semibold text-gray-900 md:text-base dark:text-white">
                Item Name
              </p>
              <p className="font-poppins text-sm text-gray-500 md:text-base">
                {itemDetails?.name}
              </p>
            </div>
            <div className="">
              <p className="font-poppins text-sm font-semibold text-gray-900 md:text-base dark:text-white">
                Short Description
              </p>
              <p className="font-poppins text-sm text-gray-500 md:text-base">
                {itemDetails?.description?.short}
              </p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="">
              <p className="font-poppins text-sm font-semibold text-gray-900 md:text-base dark:text-white">
                Price
              </p>
              <p className="font-poppins text-sm text-gray-500 md:text-base">
                {
                  currencyList.find(
                    (currency: any) =>
                      currency.currency === itemDetails?.currency,
                  )?.symbol
                }
                {new Intl.NumberFormat("en-US").format(itemDetails?.price)}{" "}
                {itemDetails?.price > 0 && (
                  <span className="text-sm text-gray-500 dark:text-gray-300">
                    (
                    {
                      currencyList.find(
                        (currency: any) =>
                          currency.currency === itemDetails?.currency,
                      )?.symbol
                    }
                    {itemDetails?.peopleRequired > 1 &&
                      new Intl.NumberFormat("en-US", {
                        maximumFractionDigits: 2,
                      }).format(
                        itemDetails?.price / itemDetails?.peopleRequired,
                      )}{" "}
                    per person)
                  </span>
                )}
              </p>
            </div>
            <div className="">
              <p className="font-poppins text-sm font-semibold text-gray-900 md:text-base dark:text-white">
                Meet up location
              </p>
              <p className="font-poppins text-sm text-gray-500 md:text-base">
                {itemDetails?.location ? itemDetails?.location : "-"}
              </p>
            </div>
          </div>
          <div className="space-y-5">
            <div className=""></div>
            <div className="">
              <p className="font-poppins text-sm font-semibold text-gray-900 md:text-base dark:text-white">
                People Limit
              </p>
              <p className="font-poppins text-sm text-gray-500 md:text-base">
                {itemDetails?.peopleRequired}
              </p>
            </div>
            <div className="">
              <p className="font-poppins text-sm font-semibold text-gray-900 md:text-base dark:text-white">
                Status
              </p>
              <p className="font-poppins text-sm text-gray-500 md:text-base">
                {itemDetails?.status === "active" ? "Active" : "Inactive"}
              </p>
            </div>
          </div>
        </div>
        <div className="my-4">
          <p className="font-poppins text-sm font-semibold text-gray-900 md:text-base dark:text-white">
            Long Description
          </p>
          <p className="font-poppins text-sm text-gray-500 md:text-base">
            {itemDetails?.description?.long}
          </p>
        </div>
      </section>
      {/* other images */}
      <section className="container mx-auto my-5 border-t border-gray-200 pt-5 dark:border-gray-600">
        <div className="overflow-x-auto">
          <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
            More Images
          </h1>
          {itemDetails?.otherImages?.length > 0 &&
            itemDetails?.otherImages?.some((image: any) => image === "") && (
              <p className="mt-10 mb-8 text-center text-sm text-gray-500">
                They are no other images for this item yet.
              </p>
            )}
          <div className="flex space-x-3 overflow-x-auto">
            {itemDetails?.otherImages?.length > 0 &&
              itemDetails?.otherImages?.every((image: any) => image !== "") &&
              itemDetails?.otherImages?.map((image: any, index: number) => (
                <Image
                  key={index}
                  src={image}
                  alt={itemDetails?.name}
                  width={1500}
                  height={1000}
                  className="h-[30vh] min-w-[300px] rounded-lg object-contain md:h-[50vh] md:min-w-[500px]"
                />
              ))}
          </div>
        </div>
      </section>
      {/* delete myself dialog */}
      <CustomDialog
        title="Remove Member"
        message={`Are you sure you want to remove yourself from this group?`}
        buttonText="Remove"
        openDialog={openRemoveSelfDialog}
        handleCloseDialog={handleCloseRemoveDialog}
        selectedItem={selectedSelf}
        handleAction={handleRemoveSelf}
      />
      {/* add myself dialog */}
      <Dialog
        open={openAddSelfDialog}
        onClose={handleCloseAddSelfDialog}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            style: {
              borderRadius: 20,
            },
          },
        }}
        aria-labelledby="add-member-dialog-title"
        aria-describedby="add-member-dialog-description"
      >
        <div className="flex items-center justify-between px-2">
          <DialogTitle className="font-poppins text-xl font-bold">
            Join this group
          </DialogTitle>
          <IconButton className="" onClick={handleCloseAddSelfDialog}>
            <Icon
              className="text-red-600"
              icon="material-symbols:close-rounded"
              width={20}
              height={20}
            />
          </IconButton>
        </div>
        <DialogContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
            {/* name */}
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
                      Full Name
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
                  name="contactPhone"
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
                      error={!!errors.contactPhone}
                      className="space-y-1"
                    >
                      <FormLabel
                        error={!!errors.contactPhone}
                        className={`text-sm ${
                          errors.contactPhone
                            ? "text-red-400"
                            : "text-gray-900 dark:text-white"
                        }`}
                        htmlFor="contactPhone"
                      >
                        Phone Number
                      </FormLabel>
                      <TextField
                        {...field}
                        fullWidth
                        error={!!errors.contactPhone}
                        size="small"
                        helperText={errors.contactPhone?.message || " "}
                      />
                    </FormControl>
                  )}
                />
              )}
            </div>
          </form>
        </DialogContent>
        <DialogActions>
          <Button
            variant="text"
            className="rounded-full normal-case"
            onClick={handleCloseAddSelfDialog}
            color="error"
          >
            <span className="text-sm font-semibold">Cancel</span>
          </Button>
          <Button
            variant="outlined"
            className="rounded-full normal-case"
            onClick={handleSubmit(onSubmit)}
            color="success"
          >
            <span className="text-sm font-semibold">Join</span>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default ItemDetailsPage;
