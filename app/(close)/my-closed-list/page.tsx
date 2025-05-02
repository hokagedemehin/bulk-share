"use client";
import { useCloseBackdrop } from "@/hooks/backdrop";
import {
  setCloseBackdrop,
  setOpenBackdrop,
} from "@/util/store/slice/backdropSlice";
import { useAppDispatch } from "@/util/store/store";
import {
  Box,
  Fab,
  Fade,
  IconButton,
  Paper,
  useScrollTrigger,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useSharedItems } from "@/hooks/items";
import Image from "next/image";
import { Icon } from "@iconify/react";

import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { getAllISOCodes } from "iso-country-currency";
import { enqueueSnackbar } from "notistack";
import Link from "next/link";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CustomDialog from "@/components/layout/CustomDialog";

const client = generateClient<Schema>();

const MyClosedItemsPage = () => {
  useCloseBackdrop();
  const app_dispatch = useAppDispatch();
  const currencyList = useMemo(() => getAllISOCodes(), []);

  /********************************************
   * BACK TO TOP BUTTON
   ********************************************/
  function ScrollTop() {
    const trigger = useScrollTrigger({
      target: window,
      disableHysteresis: true,
      threshold: 100,
    });

    const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
      const anchor = (
        (event.target as HTMLDivElement).ownerDocument || document
      ).querySelector("#back-to-top-anchor");

      if (anchor) {
        anchor.scrollIntoView({
          block: "center",
        });
      }
    };

    return (
      <Fade in={trigger}>
        <Box
          onClick={handleClick}
          role="presentation"
          sx={{ position: "fixed", bottom: 16, right: 16 }}
        >
          <Fab size="small" aria-label="scroll back to top">
            <KeyboardArrowUpIcon />
          </Fab>
        </Box>
      </Fade>
    );
  }

  const { getMyItems } = useSharedItems();

  const [myListItems, setMyListItems] = useState<Schema["ListItem"]["type"][]>(
    [],
  );
  const [closedItems, setClosedItems] = useState<Schema["ListItem"]["type"][]>(
    [],
  );

  useEffect(() => {
    let listSub1: { unsubscribe: () => void } | null = null;

    const fetchItems = async () => {
      listSub1 = await getMyItems(setMyListItems);
    };

    fetchItems();

    return () => {
      if (listSub1) {
        listSub1.unsubscribe();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useMemo(() => {
    if (myListItems.length > 0) {
      const filteredItems = myListItems.filter(
        (item) => item.visible && item.visibleTo === "owner",
      );
      setClosedItems(filteredItems);
    }
  }, [myListItems]);

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
    <div>
      <section className="container mx-auto my-5 px-3 md:px-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My Closed List</h1>
          <div className="flex items-center space-x-3">
            <Link
              href="/my-list"
              className="rounded-xl border border-sky-700 px-5 py-2 text-sm text-sky-700 transition duration-300 ease-in-out hover:bg-sky-50 dark:border-sky-500 dark:text-sky-500 dark:hover:bg-sky-50/10"
              onClick={() => {
                app_dispatch(setOpenBackdrop());
              }}
            >
              Active items
            </Link>
          </div>
        </div>
        <p className="mt-2 text-gray-600">
          This is the my closed list page. You can manage your closed list items
          here.
        </p>
      </section>
      <section className="px-3 md:px-1">
        {closedItems.length === 0 && (
          <section className="container mx-auto flex h-[50vh] flex-col items-center justify-center">
            <Image
              src="/emptylist1.png"
              alt="empty list"
              width={1000}
              height={1000}
              className="h-auto w-full max-w-[400px] rounded-2xl object-cover"
            />
            <h1 className="text-2xl font-bold text-gray-500">
              No items found. Please check your active items.
            </h1>
          </section>
        )}
        {closedItems.length > 0 && (
          <section className="container mx-auto my-5 mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {closedItems.map((item: any) => (
              <Paper
                key={item?.id}
                elevation={3}
                className="mb-10 rounded-xl px-4"
              >
                <div className="flex h-[18rem] -translate-y-10 justify-center">
                  <Image
                    src={item?.coverImage || "/itemImage1.png"}
                    alt={item?.name}
                    width={1000}
                    height={1000}
                    className="h-auto w-full max-w-[300px] rounded-2xl object-cover"
                  />
                </div>
                <div className="-translate-y-5">
                  <h2 className="text-xl font-bold">{item?.name}</h2>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    {item?.description?.short}
                  </p>
                  <p className="font-poppins mt-2 text-lg text-gray-600 dark:text-white">
                    {
                      currencyList.find(
                        (currency: any) => currency.currency === item?.currency,
                      )?.symbol
                    }
                    {new Intl.NumberFormat("en-US").format(item?.price)}
                  </p>
                  <p className="mt-2 text-gray-500 dark:text-gray-400">
                    {item?.members?.length - 1} members joined
                  </p>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <IconButton
                        className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                        onClick={() => {
                          handleOpenDeleteDialog(item);
                        }}
                      >
                        <Icon
                          className="text-red-600"
                          icon="weui:delete-on-outlined"
                          width={20}
                          height={20}
                        />
                      </IconButton>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/closed-item-detail/${item?.id}`}
                        className="rounded-xl border border-green-700 px-5 py-2 text-sm text-green-700 transition duration-300 ease-in-out hover:bg-green-50 dark:border-green-500 dark:text-green-500 dark:hover:bg-green-50/10"
                        onClick={() => {
                          app_dispatch(setOpenBackdrop());
                        }}
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </div>
              </Paper>
            ))}
          </section>
        )}
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
      <ScrollTop />
    </div>
  );
};

export default MyClosedItemsPage;
