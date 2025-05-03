"use client";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";

import { useCloseBackdrop } from "@/hooks/backdrop";
import { setOpenBackdrop } from "@/util/store/slice/backdropSlice";
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
  TextField,
  // useScrollTrigger,
} from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
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

import { getAllISOCodes } from "iso-country-currency";
import Link from "next/link";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

Amplify.configure(outputs);

const SharedListPage = () => {
  useCloseBackdrop();
  const { allListItems } = useSharedItems();
  const currencyList = useMemo(() => getAllISOCodes(), []);
  const app_dispatch = useAppDispatch();

  /********************************************
   * LIST ITMES
   ********************************************/
  const [listItems, setListItems] = useState([] as any);
  const [defaultListItems, setDefaultListItems] = useState([] as any);
  console.log("defaultListItems", defaultListItems);

  useEffect(() => {
    if (allListItems) {
      const filterItems = allListItems.filter(
        (item: any) => item.visibleTo === "everyone",
      );
      setListItems(filterItems);
      setDefaultListItems(filterItems);
    }

    return () => {};
  }, [allListItems]);

  /********************************************
   * BACK TO TOP BUTTON
   ********************************************/
  // function ScrollTop() {
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

  const shareUrl = `https://bulk-share.vercel.app/item/${selectedShareItem}`;
  const shareTitle = `Join this item group on Bulk Share and save money by buying in bulk!`;
  const description = `Join this item group on Bulk Share and save money by buying in bulk!`;

  return (
    <div className="mt-4 px-2">
      <section className="container mx-auto">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Shared Items</h1>
          <TextField
            placeholder="Search"
            variant="outlined"
            size="small"
            className="w-full max-w-[300px]"
            // onChange={(e) => {
            //   const value = e.target.value.toLowerCase();
            //   const filteredItems = defaultListItems.filter((item: any) =>
            //     item?.name?.toLowerCase().includes(value) ||
            //     item?.description?.short?.toLowerCase().includes(value),
            //   );
            //   setListItems(filteredItems);
            // }}
            // InputProps={{
            //   endAdornment: (
            //     <IconButton>
            //       <Icon
            //         icon="material-symbols:search-rounded"
            //         width={20}
            //         height={20}
            //       />
            //     </IconButton>
            //   ),
            // }}
          />
        </div>
        <p className="mt-2 text-gray-600">
          This is the shared items page. Find all the items you can share with
          your friends and family.
        </p>
      </section>
      <section className="">
        {listItems.length === 0 && (
          <section className="container mx-auto flex h-[50vh] flex-col items-center justify-center">
            <Image
              src="/emptylist1.png"
              alt="empty list"
              width={1000}
              height={1000}
              className="h-auto w-full max-w-[400px] rounded-2xl object-cover"
            />
            <h1 className="text-2xl font-bold text-gray-500">
              No active items available for now. Please check back later.
            </h1>
          </section>
        )}
        {listItems.length > 0 && (
          <section className="container mx-auto my-5 mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {listItems.map((item: any) => (
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
                  <div className="flex items-center">
                    <p className="font-poppins mt-2 text-lg text-gray-600 dark:text-white">
                      {
                        currencyList.find(
                          (currency: any) =>
                            currency.currency === item?.currency,
                        )?.symbol
                      }
                      {new Intl.NumberFormat("en-US").format(item?.price)}{" "}
                      {item?.price > 0 && (
                        <span className="text-sm text-gray-500 dark:text-gray-300">
                          (
                          {
                            currencyList.find(
                              (currency: any) =>
                                currency.currency === item?.currency,
                            )?.symbol
                          }
                          {item?.peopleRequired > 1 &&
                            new Intl.NumberFormat("en-US", {
                              maximumFractionDigits: 2,
                            }).format(item?.price / item?.peopleRequired)}{" "}
                          per person)
                        </span>
                      )}
                    </p>

                    <p className="text-xs text-gray-400 md:text-sm dark:text-gray-700"></p>
                  </div>
                  <div className="mt-4 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
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
                      <Link
                        href={`/item/${item?.id}`}
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
      {/* <ScrollTop /> */}
    </div>
  );
};

export default SharedListPage;
