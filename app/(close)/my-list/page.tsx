"use client";
import { useCloseBackdrop } from "@/hooks/backdrop";
import {
  setCloseBackdrop,
  setOpenBackdrop,
} from "@/util/store/slice/backdropSlice";
import { useAppDispatch } from "@/util/store/store";
import {
  // Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  // Fab,
  // Fade,
  IconButton,
  Paper,
  // useScrollTrigger,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useSharedItems } from "@/hooks/items";
import Image from "next/image";
import { Icon } from "@iconify/react";
import {
  EmailShareButton,
  FacebookShareButton,
  LinkedinShareButton,
  TelegramShareButton,
  ThreadsShareButton,
  TumblrShareButton,
  TwitterShareButton,
  WhatsappShareButton,
  EmailIcon,
  FacebookIcon,
  LinkedinIcon,
  TelegramIcon,
  ThreadsIcon,
  TumblrIcon,
  WhatsappIcon,
  XIcon,
} from "react-share";

import { type Schema } from "@/amplify/data/resource";
import { generateClient } from "aws-amplify/api";
import { getAllISOCodes } from "iso-country-currency";
import { enqueueSnackbar } from "notistack";
import Link from "next/link";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import CustomDialog from "@/components/layout/CustomDialog";

const client = generateClient<Schema>();
const MyListPage = () => {
  useCloseBackdrop();
  const app_dispatch = useAppDispatch();
  const router = useRouter();
  const currencyList = useMemo(() => getAllISOCodes(), []);

  /********************************************
   * BACK TO TOP BUTTON
   ********************************************/
  // function ScrollTop() {
  //   // const { children, window } = props;
  //   // Note that you normally won't need to set the window ref as useScrollTrigger
  //   // will default to window.
  //   // This is only being set here because the demo is in an iframe.
  //   const trigger = useScrollTrigger({
  //     target: window ? window : undefined,
  //     disableHysteresis: true,
  //     threshold: 100,
  //   });

  //   const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
  //     const anchor = (
  //       (event.target as HTMLDivElement).ownerDocument || document
  //     ).querySelector("#back-to-top-anchor");

  //     if (anchor) {
  //       anchor.scrollIntoView({
  //         block: "center",
  //       });
  //     }
  //   };

  //   return (
  //     <Fade in={trigger}>
  //       <Box
  //         onClick={handleClick}
  //         role="presentation"
  //         sx={{ position: "fixed", bottom: 16, right: 16 }}
  //       >
  //         <Fab size="small" aria-label="scroll back to top">
  //           <KeyboardArrowUpIcon />
  //         </Fab>
  //       </Box>
  //     </Fade>
  //   );
  // }

  // console.log("currencyList :>> ", currencyList);

  const { getMyItems } = useSharedItems();

  const [myListItems, setMyListItems] = useState<Schema["ListItem"]["type"][]>(
    [],
  );
  const [activeItems, setActiveItems] = useState<Schema["ListItem"]["type"][]>(
    [],
  );
  const [closedItemsLength, setClosedItemsLength] = useState(0);
  // console.log("myListItems :>> ", myListItems);

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
        (item) => item.visible && item.visibleTo === "everyone",
      );
      setActiveItems(filteredItems);
      const closedItems = myListItems.filter(
        (item) => item.visible && item.visibleTo === "owner",
      );
      setClosedItemsLength(closedItems.length);
    }
  }, [myListItems]);

  /*********************************************
   * SHARE DIALOG
   * **********************************************/
  const [selectedShareItem, setSelectedShareItem] = useState(null as any);
  const [openShareDialog, setOpenShareDialog] = useState(false);

  const handleOpenShareDialog = (id: string) => {
    setOpenShareDialog(true);
    setSelectedShareItem(id);
  };

  const handleCloseShareDialog = () => {
    setOpenShareDialog(false);
    setSelectedShareItem(null);
  };

  const shareUrl = `https://bulk-share.com/item/${selectedShareItem}`;
  const shareTitle = `Join this item group on Bulk Share and save money by buying in bulk!`;
  const description = `Join this item group on Bulk Share and save money by buying in bulk!`;

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

  /*********************************************
   *  CLOSE ITEM DIALOG
   * **********************************************/
  const [closeItemDialog, setCloseItemDialog] = useState(false);
  const [selectedCloseItem, setSelectedCloseItem] = useState(null as any);

  const handleOpenCloseItemDialog = (item: any) => {
    setSelectedCloseItem(item);
    setCloseItemDialog(true);
  };
  const handleCloseItemDialog = () => {
    setSelectedCloseItem(null);
    setCloseItemDialog(false);
  };
  const handleCloseItem = async () => {
    // update item properties visible, visibleTo, status
    if (!selectedCloseItem) {
      enqueueSnackbar("No item selected", {
        variant: "error",
      });
      return;
    }
    try {
      app_dispatch(setOpenBackdrop());

      const { data: closedItem, errors } = await client.models.ListItem.update({
        id: selectedCloseItem,
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
        // router("/my-list");
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
    <div className="">
      <section className="container mx-auto my-5 px-3 md:px-1">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My List</h1>
          <div className="flex items-center space-x-3">
            {closedItemsLength > 0 && (
              <Link
                href="/my-closed-list"
                className="rounded-xl border border-red-700 px-5 py-2 text-sm text-red-700 transition duration-300 ease-in-out hover:bg-red-50 dark:border-red-500 dark:text-red-500 dark:hover:bg-red-50/10"
                onClick={() => {
                  app_dispatch(setOpenBackdrop());
                }}
              >
                Closed items
              </Link>
            )}
            <Button
              variant="contained"
              color="primary"
              className="font-poppins rounded-xl"
              onClick={() => {
                app_dispatch(setOpenBackdrop());
                router.push("/create-new-item");
              }}
            >
              Add New Item
            </Button>
          </div>
        </div>
        <p className="mt-2 text-gray-600">
          This is the my list page. You can manage your list here.
        </p>
      </section>
      <section className="px-3 md:px-1">
        {activeItems.length === 0 && (
          <section className="container mx-auto flex h-[50vh] flex-col items-center justify-center">
            <Image
              src="/emptylist1.png"
              alt="empty list"
              width={1000}
              height={1000}
              className="h-auto w-full max-w-[400px] rounded-2xl object-cover"
            />
            <h1 className="text-2xl font-bold text-gray-500">
              No items found. Please add an item.
            </h1>
          </section>
        )}
        {activeItems.length > 0 && (
          <section className="container mx-auto my-5 mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {activeItems.map((item: any) => (
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
                  <p className="mt-2 truncate text-gray-500 dark:text-gray-400">
                    {item?.description?.short}
                  </p>
                  <p className="font-poppins mt-2 text-lg text-gray-600 dark:text-white">
                    {
                      currencyList.find(
                        (currency: any) => currency.currency === item?.currency,
                      )?.symbol
                    }
                    {new Intl.NumberFormat(
                      "en-US",
                      // `en-${
                      //   currencyList.find(
                      //     (currency: any) =>
                      //       currency.currency === item?.currency,
                      //   )?.iso
                      // }`,
                      // {
                      //   style: "currency",
                      //   currency: item?.currency,
                      // },
                    ).format(item?.price)}
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
                      <IconButton
                        className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                        onClick={() => {
                          handleOpenShareDialog(item?.id);
                        }}
                      >
                        <Icon
                          className="text-blue-600"
                          icon="mage:share"
                          width={20}
                          height={20}
                        />
                      </IconButton>
                      <IconButton
                        className="rounded-full bg-gray-100 p-2 text-gray-600 hover:bg-gray-200"
                        onClick={() => {
                          handleOpenCloseItemDialog(item?.id);
                        }}
                      >
                        <Icon
                          className="text-gray-800"
                          icon="mdi:eye-lock-outline"
                          width={20}
                          height={20}
                        />
                      </IconButton>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href={`/edit-item/${item?.id}`}
                        className="rounded-xl border border-sky-700 px-5 py-2 text-sm text-sky-700 transition duration-300 ease-in-out hover:bg-sky-50 dark:border-sky-500 dark:text-sky-500 dark:hover:bg-sky-50/10"
                        onClick={() => {
                          app_dispatch(setOpenBackdrop());
                        }}
                      >
                        Edit
                      </Link>
                      <Link
                        href={`/my-item/${item?.id}`}
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
      {/* share dialog */}
      <Dialog
        open={openShareDialog}
        onClose={handleCloseShareDialog}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            style: {
              borderRadius: 20,
            },
          },
        }}
        aria-labelledby="share-dialog-title"
        aria-describedby="share-dialog-description"
      >
        <div className="flex items-center justify-between px-2">
          <DialogTitle className="font-poppins text-xl font-bold">
            Share this item
          </DialogTitle>
          <IconButton className="" onClick={handleCloseShareDialog}>
            <Icon
              className="text-red-600"
              icon="material-symbols:close-rounded"
              width={20}
              height={20}
            />
          </IconButton>
        </div>
        <DialogContent>
          <div className="">
            <p className="text-gray-600 dark:text-gray-200">
              Share this item link with your friends and family.
            </p>
            <div className="mt-2 flex w-full items-center gap-2">
              <WhatsappShareButton
                url={shareUrl}
                title={shareTitle}
                separator=":: "
                className=""
              >
                <WhatsappIcon size={32} round />
              </WhatsappShareButton>
              <FacebookShareButton url={shareUrl} className="">
                <FacebookIcon size={32} round />
              </FacebookShareButton>
              <LinkedinShareButton url={shareUrl} className="">
                <LinkedinIcon size={32} round />
              </LinkedinShareButton>
              <TelegramShareButton
                url={shareUrl}
                title={shareTitle}
                className=""
              >
                <TelegramIcon size={32} round />
              </TelegramShareButton>
              <TwitterShareButton
                url={shareUrl}
                title={shareTitle}
                className=""
              >
                <XIcon size={32} round />
              </TwitterShareButton>
              <EmailShareButton
                url={shareUrl}
                subject={shareTitle}
                body={description}
                className=""
              >
                <EmailIcon size={32} round />
              </EmailShareButton>
              <ThreadsShareButton
                url={shareUrl}
                title={shareTitle}
                className=""
              >
                <ThreadsIcon size={32} round />
              </ThreadsShareButton>
              <TumblrShareButton url={shareUrl} title={shareTitle} className="">
                <TumblrIcon size={32} round />
              </TumblrShareButton>
            </div>
            {/* share link */}
            <div className="mt-4">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={shareUrl}
                  readOnly
                  className="w-full rounded-lg border border-gray-300 p-2 text-gray-600 dark:bg-gray-800 dark:text-white"
                />
                <Button
                  variant="contained"
                  color="primary"
                  className="font-poppins rounded-xl normal-case"
                  onClick={() => {
                    navigator.clipboard.writeText(shareUrl);
                    handleCloseShareDialog();
                  }}
                >
                  Copy
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {/* delete dialog */}
      <CustomDialog
        title="Delete this item"
        message={`Are you sure you want to delete ${selectedDeleteItem?.name}?`}
        openDialog={openDeleteDialog}
        handleCloseDialog={handleCloseDeleteDialog}
        selectedItem={selectedDeleteItem}
        handleAction={handleDeleteItem}
      />
      {/* close item dialog */}
      <CustomDialog
        title="Close Item"
        message="Are you sure you want to close this item. It will not be visible for others to join again?"
        buttonText="Close Item"
        openDialog={closeItemDialog}
        handleCloseDialog={handleCloseItemDialog}
        selectedItem={selectedCloseItem}
        handleAction={handleCloseItem}
      />
      {/* <ScrollTop /> */}
    </div>
  );
};

export default MyListPage;
