"use client";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";

import { useCloseBackdrop, useOpenBackdrop } from "@/hooks/backdrop";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
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
import CountUp from "react-countup";

Amplify.configure(outputs);

const SharedItemsComp = () => {
  useCloseBackdrop();
  const { allListItems } = useSharedItems();
  const currencyList = useMemo(() => getAllISOCodes(), []);
  const handleOpenBackdrop = useOpenBackdrop();

  /********************************************
   * LIST ITMES
   ********************************************/
  const [listItems, setListItems] = useState([] as any);

  // console.log("listItems", listItems);
  // console.log("defaultListItems", defaultListItems);

  useEffect(() => {
    if (allListItems) {
      const filterItems = allListItems.filter(
        (item: any) => item.visibleTo === "everyone",
      );
      const firstFewItems = filterItems.slice(0, 6);
      const temp = [] as any;
      if (firstFewItems.length > 0) {
        firstFewItems.forEach((item: any) => {
          temp.push({
            id: item.id,
            name: item.name,
            firstName: item.contactName?.split(" ")[0] || "Unknown",
            lastName: item.contactName?.split(" ")[1] || "User",
            coverImage: item.coverImage || "/itemImage1.png",
            price: item.price,
            currency: item.currency,
            country: item.country,
            flag: item.flag,
            peopleRequired: item.peopleRequired,
            members:
              item.members?.filter(
                (member: any) => member.status === "confirmed",
              ).length || 0,
          });
        });
        setListItems(temp);
      } else {
        setListItems([]);
      }
      // if (selectedCountry === "world") {
      //   const firstFewItems = filterItems.slice(0, 6);
      //   setListItems(firstFewItems);
      //   setDefaultListItems(filterItems);
      // } else {
      //   const countryFilteredItems = filterItems.filter(
      //     (item: any) => item.country === selectedCountry,
      //   );
      //   if (countryFilteredItems.length === 0) {
      //     setListItems([]);
      //     setDefaultListItems([]);
      //     return;
      //   }
      //   const firstFewItems = countryFilteredItems.slice(0, 3);
      //   setListItems(firstFewItems);
      //   setDefaultListItems(countryFilteredItems);
      // }
    }

    return () => {};
  }, [allListItems]);

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

  const shareUrl = `https://bulk-share.com/shared-items/${selectedShareItem}`;
  const shareTitle = `Join this item group on Bulk Share and save money by buying in bulk!`;
  const description = `Join this item group on Bulk Share and save money by buying in bulk!`;

  return (
    <section className="">
      {listItems.length > 0 && (
        <>
          <div className="flex flex-col items-center justify-center">
            <div className="flex w-fit items-center rounded-full border border-[#1BADFF50] p-1.5">
              <div className="rounded-full bg-[#F6F9FA] p-1">
                <Icon
                  icon="hugeicons:share-02"
                  className="text-sm text-[#1BADFF] md:text-xl"
                  // width={20}
                  // height={20}
                />
              </div>
              <Typography className="font-poppins ml-2 text-sm text-[#1A1A1AB2] md:text-base dark:text-white">
                Shared Items
              </Typography>
            </div>
            <h2 className="font-bricolage-grotesque mt-4 text-center text-lg font-normal text-gray-900 md:w-[40%] md:text-2xl dark:text-white">
              See what items others are sharing. You just might be interested!
            </h2>
          </div>
          <div className="pt-8 pb-5">
            <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {listItems.map((item: any) => (
                <Paper
                  elevation={0}
                  key={item?.id}
                  className="rounded-xl border border-gray-200 bg-white p-3 dark:border-slate-700 dark:bg-slate-900"
                >
                  <Image
                    src={item?.coverImage || "/itemImage1.png"}
                    alt={item?.name}
                    width={500}
                    height={500}
                    className="h-[250px] w-full rounded-xl object-cover"
                  />
                  <div className="flex h-[44%] flex-col justify-end">
                    <div className="mt-6 flex items-center justify-between space-x-2">
                      <Typography
                        sx={{
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                        className="font-poppins w-[90%] text-sm font-medium text-gray-900 md:text-base dark:text-white"
                      >
                        {item?.name}
                      </Typography>
                      <div className="flex items-center space-x-1">
                        <Icon
                          icon="hugeicons:user-multiple"
                          className="text-sm text-[#909EB0] dark:text-gray-300"
                        />
                        <Typography className="font-poppins text-sm font-medium text-gray-900 md:text-sm dark:text-white">
                          <CountUp end={item?.members} duration={2} />
                          <span className="text-sm text-[#909EB0]">
                            /{item?.peopleRequired}
                          </span>
                        </Typography>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center space-x-4">
                      <Typography className="font-poppins max-w-[80%] truncate font-medium text-gray-900/60 md:text-base dark:text-gray-300">
                        {item?.firstName} {item?.lastName[0]?.toUpperCase()}.
                      </Typography>
                      <div className="h-6 border-l border-[#E0E6EE]"></div>
                      <div className="flex items-center space-x-2">
                        <Typography className="font-poppins font-medium text-gray-900/60 md:text-base dark:text-white">
                          {item?.country}
                        </Typography>
                        <div className="">
                          {item?.flag ? (
                            <span className="text-lg">{item?.flag}</span>
                          ) : (
                            <span className="text-lg">🌍</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex items-center space-x-1">
                      <Typography className="font-poppins max-w-[70%] truncate text-sm font-medium text-gray-900 md:text-base dark:text-white">
                        {
                          currencyList.find(
                            (currency: any) =>
                              currency.currency === item?.currency,
                          )?.symbol
                        }
                        {new Intl.NumberFormat("en-US").format(item?.price)}
                      </Typography>
                      <Typography className="font-poppins text-xs font-medium text-gray-900/60 md:text-sm dark:text-gray-300">
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
                          }).format(item?.price / item?.peopleRequired)}
                        /person )
                      </Typography>
                    </div>
                    <div className="mt-5 mb-2 flex items-center space-x-2">
                      <Button
                        variant="contained"
                        disableElevation
                        startIcon={
                          <Icon
                            icon="system-uicons:share"
                            className="text-sm text-black md:text-base dark:text-white"
                          />
                        }
                        className="font-poppins w-full rounded-lg bg-[#1A1A1A10] px-2 py-1 text-center font-medium text-black normal-case transition duration-300 hover:bg-[#1A1A1A20] md:px-4 dark:bg-slate-700 dark:text-white dark:hover:bg-slate-600"
                        onClick={() => {
                          handleOpenShareDialog(item?.id);
                        }}
                      >
                        Share
                      </Button>
                      <Link
                        href={`/shared-items/${item?.id}`}
                        onClick={() => {
                          handleOpenBackdrop(`/shared-items/${item?.id}`);
                        }}
                        className="font-poppins w-full rounded-lg border border-[#E0E6EE] bg-white px-2 py-1 text-center font-medium text-black normal-case transition duration-300 hover:bg-[#00000010] md:px-4 dark:hover:bg-slate-200"
                      >
                        View
                      </Link>
                    </div>
                  </div>
                </Paper>
              ))}
            </div>
            <div className="my-8 flex justify-center">
              <Link
                href="/shared-items"
                onClick={() => {
                  handleOpenBackdrop("/shared-items");
                }}
                className="font-poppins flex items-center rounded-lg bg-[#1A1A1A10] px-2 py-2 text-sm font-medium text-black normal-case transition duration-300 hover:bg-gray-200 md:px-6 dark:bg-slate-900 dark:text-white dark:hover:bg-slate-900/50"
              >
                See more items
                <Icon
                  icon="hugeicons:link-square-01"
                  className="ml-2 text-sm text-[#141B34] md:text-base dark:text-white"
                />
              </Link>
            </div>
          </div>
        </>
      )}
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
    </section>
  );
};

export default SharedItemsComp;
