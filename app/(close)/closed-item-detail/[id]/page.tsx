"use client";
import { useCloseBackdrop } from "@/hooks/backdrop";
import { BackRouter } from "@/util/helpers/routers";
import { Avatar, Button, IconButton } from "@mui/material";
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
import CustomDialog from "@/components/layout/CustomDialog";
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

const ClosedItemDetailsPage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  useCloseBackdrop();
  const backRouter = BackRouter();
  const router = useRouter();
  const { id } = use(params);
  const { getSingleItem } = useSharedItems();
  const app_dispatch = useAppDispatch();

  const currencyList = useMemo(() => getAllISOCodes(), []);

  const [itemDetails, setItemDetails] = useState([] as any);

  const [confirmedMembers, setConfirmedMembers] = useState([] as any);
  const [pendingMembers, setPendingMembers] = useState([] as any);

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
   * DELETE ITEM DIALOG
   * **********************************************/
  const [selectedDeleteItem, setSelectedDeleteItem] = useState(null as any);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const handleOpenDeleteDialog = (item: any) => {
    setOpenDeleteDialog(true);
    setSelectedDeleteItem(item);
  };

  const handleCloseDeleteDialog = () => {
    setOpenDeleteDialog(false);
    setSelectedDeleteItem(null);
  };

  const handleDeleteItem = async (item: any) => {
    setOpenDeleteDialog(false);
    try {
      app_dispatch(setOpenBackdrop());
      const { data, errors } = await client.models.ListItem.update({
        id: item?.id,
        visible: false,
        visibleTo: "none",
      });
      handleCloseDeleteDialog();
      if (data) {
        app_dispatch(setCloseBackdrop());
        enqueueSnackbar("Item deleted successfully.", {
          variant: "success",
        });
        router.replace("/my-closed-list");
      }
      if (errors) {
        app_dispatch(setCloseBackdrop());
        console.error("Error deleting item", errors);
        enqueueSnackbar("Error deleting item. Please try again.", {
          variant: "error",
        });
        return;
      }
    } catch (error) {
      app_dispatch(setCloseBackdrop());
      enqueueSnackbar("Error deleting item. Please try again.", {
        variant: "error",
      });
      console.error("Error deleting item", error);
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
            Closed Item Details
          </h1>
          <p className="mt-2 text-sm text-gray-600 md:text-base">
            See the details of your closed item here and all the members that
            are part of the group
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
                  className="h-auto min-w-[300px] rounded-lg object-cover shadow-md md:min-w-[500px]"
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
              handleOpenDeleteDialog(itemDetails);
            }}
          >
            <span className="text-sm font-semibold">Delete Item</span>
          </Button>
        </div>
      </section>
      {/* delete dialog */}
      <CustomDialog
        title="Delete this item"
        message={`Are you sure you want to delete ${selectedDeleteItem?.name}?`}
        openDialog={openDeleteDialog}
        handleCloseDialog={handleCloseDeleteDialog}
        selectedItem={selectedDeleteItem}
        handleAction={handleDeleteItem}
      />
    </div>
  );
};

export default ClosedItemDetailsPage;
