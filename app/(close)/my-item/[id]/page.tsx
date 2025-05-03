"use client";
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
import React, { use, useEffect, useMemo, useState } from "react";
import { Icon } from "@iconify/react";
import { useSharedItems } from "@/hooks/items";
import Image from "next/image";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
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
import dayjs from "dayjs";
import { useRouter } from "next/navigation";

const client = generateClient<Schema>();

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`members-tabpanel-${index}`}
      aria-labelledby={`members-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `members-tab-${index}`,
    "aria-controls": `members-tabpanel-${index}`,
  };
}

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

const MyItemDetailsPage = ({ params }: { params: Promise<{ id: string }> }) => {
  useCloseBackdrop();
  const backRouter = BackRouter();
  const { id } = use(params);
  const { getSingleItem } = useSharedItems();
  const app_dispatch = useAppDispatch();
  const router = useRouter();

  const currencyList = useMemo(() => getAllISOCodes(), []);

  const [itemDetails, setItemDetails] = useState([] as any);

  const [confirmedMembers, setConfirmedMembers] = useState([] as any);
  const [pendingMembers, setPendingMembers] = useState([] as any);

  // console.log("itemDetails :>> ", itemDetails);

  useEffect(() => {
    (async () => {
      const data = await getSingleItem(id as string);
      if (data) {
        setItemDetails(data);
        const confirmed = data?.members?.filter(
          (member: any) => member.status === "confirmed",
        );
        const pending = data?.members?.filter(
          (member: any) => member.status === "pending",
        );
        setConfirmedMembers(confirmed);
        setPendingMembers(pending);
      }
    })();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  /*********************************************************
   * MEMBERS TAB
   **********************************************************/

  const [membersValue, setMembersValue] = React.useState(0);

  const handleChange = (
    event: React.SyntheticEvent,
    newMembersValue: number,
  ) => {
    setMembersValue(newMembersValue);
  };

  /*********************************************
   * REMOVE MEMBER DIALOG
   * **********************************************/
  const [openRemoveMemberDialog, setOpenRemoveMemberDialog] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null as any);

  const handleOpenRemoveMemberDialog = (item: any) => {
    setSelectedMember(item);
    setOpenRemoveMemberDialog(true);
  };

  const handleCloseRemoveDialog = () => {
    setOpenRemoveMemberDialog(false);
    setSelectedMember(null);
  };

  const handleRemoveMember = async () => {
    setOpenRemoveMemberDialog(false);

    try {
      app_dispatch(setOpenBackdrop());
      // move the member to removemMembers list

      const { data: removedMember, errors } =
        await client.models.ListItem.update({
          id: itemDetails?.id,
          removedMembers: JSON.stringify([
            ...(itemDetails?.removedMembers || []),
            {
              id: selectedMember?.id,
              userSub: selectedMember?.userSub,
              contactName: selectedMember?.contactName,
              contactEmail: selectedMember?.contactEmail,
              contactPhone: selectedMember?.contactPhone,
              isOwner: selectedMember?.isOwner,
              status: "removed",
            },
          ]),
          members: JSON.stringify(
            itemDetails?.members?.filter(
              (member: any) => member.id !== selectedMember?.id,
            ),
          ),
        });

      if (removedMember) {
        app_dispatch(setCloseBackdrop());
        // console.log("removedMember :>> ", removedMember);
        enqueueSnackbar(
          `${selectedMember?.contactName} has been removed from the group`,
          {
            variant: "success",
          },
        );
        const parsedItem = {
          ...removedMember,
          members: JSON.parse(removedMember.members as string),
          removedMembers: JSON.parse(
            removedMember.removedMembers as string,
          )?.filter((member: any) => member.status === "removed"),
          otherImages: JSON.parse(removedMember.otherImages as string),
        };
        setItemDetails(parsedItem);

        const confirmed = parsedItem?.members?.filter(
          (member: any) => member.status === "confirmed",
        );
        const pending = parsedItem?.members?.filter(
          (member: any) => member.status === "pending",
        );
        setConfirmedMembers(confirmed);
        setPendingMembers(pending);
        setSelectedMember(null);
        setOpenRemoveMemberDialog(false);
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
   * CONFIRM MEMBER DIALOG
   * **********************************************/
  const [openConfirmMemberDialog, setOpenConfirmMemberDialog] = useState(false);
  const [selectedConfirmMember, setSelectedConfirmMember] = useState(
    null as any,
  );
  const handleOpenConfirmMemberDialog = (item: any) => {
    setSelectedConfirmMember(item);
    setOpenConfirmMemberDialog(true);
  };
  const handleCloseConfirmDialog = () => {
    setOpenConfirmMemberDialog(false);
    setSelectedConfirmMember(null);
  };
  const handleAcceptMember = async () => {
    setOpenConfirmMemberDialog(false);

    try {
      app_dispatch(setOpenBackdrop());
      // change member status to confirmed

      const { data: acceptedMember, errors } =
        await client.models.ListItem.update({
          id: itemDetails?.id,
          members: JSON.stringify(
            itemDetails?.members?.map((member: any) => {
              if (member.id === selectedConfirmMember?.id) {
                return {
                  ...member,
                  status: "confirmed",
                };
              }
              return member;
            }),
          ),
        });

      if (acceptedMember) {
        app_dispatch(setCloseBackdrop());
        // console.log("acceptedMember :>> ", acceptedMember);
        enqueueSnackbar(
          `${selectedConfirmMember?.contactName} has been accepted to the group`,
          {
            variant: "success",
          },
        );
        const parsedItem = {
          ...acceptedMember,
          members: JSON.parse(acceptedMember.members as string),
          otherImages: JSON.parse(acceptedMember.otherImages as string),
          removedMembers: JSON.parse(
            acceptedMember.removedMembers as string,
          )?.filter((member: any) => member.status === "removed"),
        };
        setItemDetails(parsedItem);

        const confirmed = parsedItem?.members?.filter(
          (member: any) => member.status === "confirmed",
        );
        const pending = parsedItem?.members?.filter(
          (member: any) => member.status === "pending",
        );
        setConfirmedMembers(confirmed);
        setPendingMembers(pending);
        setSelectedConfirmMember(null);
        setOpenConfirmMemberDialog(false);
        return;
      }

      if (errors) {
        app_dispatch(setCloseBackdrop());
        console.error("Error accepting member", errors);
        enqueueSnackbar("Error accepting member. Please try again.", {
          variant: "error",
        });
        return;
      }
    } catch (error) {
      app_dispatch(setCloseBackdrop());
      console.error("Error accepting member", error);
      enqueueSnackbar("Error accepting member. Please try again.", {
        variant: "error",
      });
    }
  };

  /*********************************************
   * ADD MEMBER DIALOG
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
  const [openAddMemberDialog, setOpenAddMemberDialog] = useState(false);
  const handleOpenAddMemberDialog = () => {
    setOpenAddMemberDialog(true);
  };
  const handleCloseAddDialog = () => {
    setOpenAddMemberDialog(false);
  };
  const onSubmit = async (data: any) => {
    setOpenAddMemberDialog(false);

    try {
      app_dispatch(setOpenBackdrop());
      // add member to the group

      const { data: addedMember, errors } = await client.models.ListItem.update(
        {
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
              status: "confirmed",
            },
          ]),
        },
      );

      if (addedMember) {
        app_dispatch(setCloseBackdrop());
        enqueueSnackbar(`${data?.contactName} has been added to the group`, {
          variant: "success",
        });
        const parsedItem = {
          ...addedMember,
          members: JSON.parse(addedMember.members as string),
          otherImages: JSON.parse(addedMember.otherImages as string),
          removedMembers: JSON.parse(
            addedMember.removedMembers as string,
          )?.filter((member: any) => member.status === "removed"),
        };
        setItemDetails(parsedItem);

        const confirmed = parsedItem?.members?.filter(
          (member: any) => member.status === "confirmed",
        );
        const pending = parsedItem?.members?.filter(
          (member: any) => member.status === "pending",
        );
        setConfirmedMembers(confirmed);
        setPendingMembers(pending);
        setOpenAddMemberDialog(false);
        reset();
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

  /*********************************************************
   * CLOSE ITEMS
   **********************************************************/
  const handleCloseItem = async () => {
    //change the visible to field of the item to owner
    app_dispatch(setOpenBackdrop());
    try {
      const { data: closedItem, errors } = await client.models.ListItem.update({
        id: itemDetails?.id,
        // visible: false,
        visibleTo: "owner",
        status: "inactive",
      });

      if (closedItem) {
        app_dispatch(setCloseBackdrop());
        enqueueSnackbar("Item has been closed", {
          variant: "success",
        });
        router.replace("/my-list");
        return;
      }

      if (errors) {
        app_dispatch(setCloseBackdrop());
        console.error("Error closing item", errors);
        enqueueSnackbar("Error closing item. Please try again.", {
          variant: "error",
        });
        return;
      }
    } catch (error) {
      app_dispatch(setCloseBackdrop());
      console.error("Error closing item", error);
      enqueueSnackbar("Error closing item. Please try again.", {
        variant: "error",
      });
    }
  };

  return (
    <div className="px-2">
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
      {/* image | members */}
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
                <p className="dark:text-gray-600md:text-base ml-2 text-sm text-gray-400">
                  ({itemDetails?.members?.length})
                </p>
              </div>
              <div className="">
                <Button
                  variant="outlined"
                  className="hidden rounded-full normal-case md:flex"
                  onClick={() => {
                    // backRouter("/add-member");
                    handleOpenAddMemberDialog();
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
                  <span className="text-sm font-semibold">Add Member</span>
                </Button>
                <IconButton
                  aria-label="add member"
                  name="add-member"
                  className="flex rounded-full bg-gray-200 p-2 text-gray-900 md:hidden dark:bg-gray-600 dark:text-white"
                  onClick={() => {
                    // backRouter("/add-member");
                    handleOpenAddMemberDialog();
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
              <Tabs
                value={membersValue}
                onChange={handleChange}
                aria-label="members tabs"
              >
                <Tab label="Confirmed" {...a11yProps(0)} />
                <Tab label="Pending" {...a11yProps(1)} />
              </Tabs>
              <CustomTabPanel value={membersValue} index={0}>
                <div className="h-[25vh] overflow-y-auto">
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
                          <div className="w-[85%]">
                            <p className="font-poppins text-sm font-semibold text-gray-900 capitalize md:text-base dark:text-white">
                              {member?.contactName}
                            </p>
                            <p className="font-poppins text-xs text-gray-500">
                              {member?.contactEmail}
                            </p>
                            <p className="text-xs text-gray-500">
                              {member?.contactPhone}
                            </p>
                          </div>
                        </div>
                        <div className="">
                          {!member?.isOwner && (
                            <>
                              <IconButton
                                aria-label="delete"
                                className="rounded-full bg-red-500 p-2 text-white transition duration-300 ease-in-out hover:bg-red-600"
                                onClick={() => {
                                  handleOpenRemoveMemberDialog(member);
                                }}
                              >
                                <Icon
                                  icon="material-symbols:delete-outline"
                                  className="text-white"
                                  width={20}
                                  height={20}
                                />
                              </IconButton>
                            </>
                          )}
                        </div>
                      </div>
                    ))}
                </div>
              </CustomTabPanel>
              <CustomTabPanel value={membersValue} index={1}>
                <div className="h-[25vh] overflow-y-auto">
                  {pendingMembers?.length > 0 &&
                    pendingMembers?.map((member: any, index: number) => (
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
                            <p className="font-poppins text-sm font-semibold text-gray-900 capitalize md:text-base dark:text-white">
                              {member?.contactName}
                            </p>
                            <p className="font-poppins text-xs text-gray-500">
                              {member?.contactEmail}
                            </p>
                            <p className="text-xs text-gray-500">
                              {member?.contactPhone}
                            </p>
                          </div>
                        </div>
                        <div className="">
                          {!member?.isOwner && (
                            <div className="flex items-center space-x-3">
                              <IconButton
                                aria-label="accept"
                                className="rounded-full bg-green-500 p-2 text-white transition duration-300 ease-in-out hover:bg-green-600"
                                onClick={() => {
                                  handleOpenConfirmMemberDialog(member);
                                }}
                              >
                                <Icon
                                  icon="material-symbols:check"
                                  className="text-white"
                                  width={20}
                                  height={20}
                                />
                              </IconButton>
                              <IconButton
                                aria-label="delete"
                                className="rounded-full bg-red-500 p-2 text-white transition duration-300 ease-in-out hover:bg-red-600"
                                onClick={() => {
                                  handleOpenRemoveMemberDialog(member);
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
                          )}
                        </div>
                      </div>
                    ))}
                  {pendingMembers?.length === 0 && (
                    <p className="mt-14 mb-8 text-center text-sm text-gray-500">
                      You don&apos;t have any pending members for this item yet.
                    </p>
                  )}
                </div>
              </CustomTabPanel>
            </div>
          </div>
        </div>
      </section>
      {/* item details */}
      <section className="container mx-auto mt-5">
        {/* instructions */}
        <div className="my-4">
          <p className="font-poppins text-sm font-semibold text-gray-900 md:text-base dark:text-white">
            Instructions for this item
          </p>
          <p className="font-poppins text-sm text-gray-500 md:text-base">
            {itemDetails?.instruction ? itemDetails?.instruction : "-"}
          </p>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="flex flex-col space-y-5">
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
            <div className="">
              <p className="font-poppins text-sm font-semibold text-gray-900 md:text-base dark:text-white">
                Long Description
              </p>
              <p className="font-poppins text-sm text-gray-500 md:text-base">
                {itemDetails?.description?.long}
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
                {new Intl.NumberFormat("en-US").format(itemDetails?.price)}
              </p>
            </div>
            <div className="">
              <p className="font-poppins text-sm font-semibold text-gray-900 md:text-base dark:text-white">
                Digital Item
              </p>
              <p className="font-poppins text-sm text-gray-500 md:text-base">
                {itemDetails?.isDigital ? "Yes" : "No"}
              </p>
            </div>
            <div className="">
              <p className="font-poppins text-sm font-semibold text-gray-900 md:text-base dark:text-white">
                Link Validity
              </p>
              <p className="font-poppins text-sm text-gray-500 md:text-base">
                {dayjs(itemDetails?.expiresAt).format("DD MMM YYYY, hh:mm A")}
              </p>
            </div>
          </div>
          <div className="space-y-5">
            <div className="">
              <p className="font-poppins text-sm font-semibold text-gray-900 md:text-base dark:text-white">
                Meet up location
              </p>
              <p className="font-poppins text-sm text-gray-500 md:text-base">
                {itemDetails?.location ? itemDetails?.location : "-"}
              </p>
            </div>
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
      </section>
      {/* other images */}
      <section className="container mx-auto my-5 border-t border-gray-200 pt-5 dark:border-gray-600">
        <div className="overflow-x-auto">
          <h1 className="mb-3 text-2xl font-bold text-gray-900 dark:text-white">
            Other Images
          </h1>
          {itemDetails?.otherImages?.length > 0 &&
            itemDetails?.otherImages?.some((image: any) => image === "") && (
              <p className="mt-10 mb-8 text-center text-sm text-gray-500">
                You don&apos;t have any other images for this item yet.
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
      {/* buttons */}
      <section className="container mx-auto mb-5">
        <div className="flex items-center justify-end space-x-4">
          <Button
            variant="outlined"
            className="rounded-full normal-case"
            onClick={() => {
              handleCloseItem();
            }}
          >
            <span className="text-sm font-semibold">Close Item</span>
          </Button>
          <Button
            variant="contained"
            className="rounded-full normal-case"
            onClick={() => {
              app_dispatch(setOpenBackdrop());
              router.push(`/edit-item/${itemDetails?.id}`);
            }}
          >
            <span className="text-sm font-semibold">Update</span>
          </Button>
        </div>
      </section>
      {/* delete member dialog */}
      <CustomDialog
        title="Remove Member"
        message={`Are you sure you want to remove ${selectedMember?.contactName} from this group?`}
        buttonText="Remove"
        openDialog={openRemoveMemberDialog}
        handleCloseDialog={handleCloseRemoveDialog}
        selectedItem={selectedMember}
        handleAction={handleRemoveMember}
      />
      {/* confirm member dialog */}
      <CustomDialog
        title="Confirm Member"
        message={`Are you sure you want to accept ${selectedConfirmMember?.contactName} to this group?`}
        buttonText="Accept"
        buttonColor="success"
        openDialog={openConfirmMemberDialog}
        handleCloseDialog={handleCloseConfirmDialog}
        selectedItem={selectedConfirmMember}
        handleAction={handleAcceptMember}
      />
      {/* add member dialog */}
      <Dialog
        open={openAddMemberDialog}
        onClose={handleCloseAddDialog}
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
            Add Member
          </DialogTitle>
          <IconButton className="" onClick={handleCloseAddDialog}>
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
                      Member&apos;s Full Name
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
            onClick={handleCloseAddDialog}
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
            <span className="text-sm font-semibold">Add Member</span>
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyItemDetailsPage;
