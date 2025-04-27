"use client";
import { useCloseBackdrop } from "@/hooks/backdrop";
import {
  setCloseBackdrop,
  setOpenBackdrop,
} from "@/util/store/slice/backdropSlice";
import { useAppDispatch } from "@/util/store/store";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
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

const client = generateClient<Schema>();
const MyListPage = () => {
  useCloseBackdrop();
  const app_dispatch = useAppDispatch();
  const router = useRouter();
  const currencyList = useMemo(() => getAllISOCodes(), []);

  // console.log("currencyList :>> ", currencyList);

  const { getListItems } = useSharedItems();

  const [myListItems, setMyListItems] = useState<Schema["ListItem"]["type"][]>(
    [],
  );
  // console.log("myListItems :>> ", myListItems);

  useEffect(() => {
    const listSub1 = getListItems(setMyListItems);

    return () => {
      listSub1.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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

  const shareUrl = `https:/bulk-share.vercel.app/item/${selectedShareItem}`;
  const title = `Join this item group on Bulk Share and save money by buying in bulk!`;
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
      const { data, errors } = await client.models.ListItem.delete({
        id: item?.id,
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
    <div className="px-2">
      <section className="container mx-auto my-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My List</h1>
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
        <p className="mt-2 text-gray-600">
          This is the my list page. You can manage your list here.
        </p>
      </section>
      <div className="">
        {myListItems.length === 0 && (
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
        {myListItems.length > 0 && (
          <section className="container mx-auto my-5 mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myListItems.map((item: any) => (
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
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="outlined"
                        color="primary"
                        className="font-poppins rounded-xl normal-case"
                        onClick={() => {
                          app_dispatch(setOpenBackdrop());
                          router.push("/edit-item");
                        }}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="success"
                        className="font-poppins rounded-xl normal-case"
                        onClick={() => {
                          app_dispatch(setOpenBackdrop());
                          router.push("/view-item");
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </div>
                </div>
              </Paper>
            ))}
          </section>
        )}
      </div>
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
                title={title}
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
              <TelegramShareButton url={shareUrl} title={title} className="">
                <TelegramIcon size={32} round />
              </TelegramShareButton>
              <TwitterShareButton url={shareUrl} title={title} className="">
                <XIcon size={32} round />
              </TwitterShareButton>
              <EmailShareButton
                url={shareUrl}
                subject={title}
                body={description}
                className=""
              >
                <EmailIcon size={32} round />
              </EmailShareButton>
              <ThreadsShareButton url={shareUrl} title={title} className="">
                <ThreadsIcon size={32} round />
              </ThreadsShareButton>
              <TumblrShareButton url={shareUrl} title={title} className="">
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
      <Dialog
        open={openDeleteDialog}
        onClose={handleCloseDeleteDialog}
        maxWidth="sm"
        fullWidth
        slotProps={{
          paper: {
            style: {
              borderRadius: 20,
            },
          },
        }}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
      >
        <div className="flex items-center justify-between px-2">
          <DialogTitle className="font-poppins text-xl font-bold">
            Delete this item
          </DialogTitle>
          <IconButton className="" onClick={handleCloseDeleteDialog}>
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
              Are you sure you want to delete {selectedDeleteItem?.name}?
            </p>
          </div>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleCloseDeleteDialog}
            color="primary"
            className="font-poppins rounded-xl normal-case"
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleDeleteItem(selectedDeleteItem)}
            color="error"
            className="font-poppins rounded-xl normal-case"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default MyListPage;
