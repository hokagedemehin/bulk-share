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
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
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
import { useDebounce } from "use-debounce";
import { getAllISOCodes } from "iso-country-currency";
import Link from "next/link";
import { country_states } from "@/util/helpers/country_state";
// import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

Amplify.configure(outputs);

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

const SharedListPage = () => {
  useCloseBackdrop();
  const { allListItems } = useSharedItems();
  const currencyList = useMemo(() => getAllISOCodes(), []);
  const app_dispatch = useAppDispatch();

  /*********************************************
   *  COUNTRY LIST
   * **********************************************/
  const [selectedCountry, setSelectedCountry] = useState("world" as string);
  const [countryList, setCountryList] = useState([] as any);

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

  /********************************************
   * LIST ITMES
   ********************************************/
  const [listItems, setListItems] = useState([] as any);
  const [defaultListItems, setDefaultListItems] = useState([] as any);

  console.log("listItems", listItems);
  console.log("defaultListItems", defaultListItems);

  useEffect(() => {
    if (allListItems) {
      const filterItems = allListItems.filter(
        (item: any) => item.visibleTo === "everyone",
      );
      const temp = [] as any;
      filterItems.forEach((item: any) => {
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
            item.members?.filter((member: any) => member.status === "confirmed")
              .length || 0,
        });
      });
      if (selectedCountry === "world") {
        const firstFewItems = temp.slice(0, 6);
        setListItems(firstFewItems);
        setDefaultListItems(temp);
      } else {
        const countryFilteredItems = filterItems.filter(
          (item: any) => item.country === selectedCountry,
        );
        const temp = [] as any;
        countryFilteredItems.forEach((item: any) => {
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
        if (countryFilteredItems.length === 0) {
          setListItems([]);
          setDefaultListItems([]);
          return;
        }
        const firstFewItems = temp.slice(0, 3);
        setListItems(firstFewItems);
        setDefaultListItems(temp);
      }
    }

    return () => {};
  }, [allListItems, selectedCountry]);

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

  const shareUrl = `https://bulk-share.com/shared-items/${selectedShareItem}`;
  const shareTitle = `Join this item group on Bulk Share and save money by buying in bulk!`;
  const description = `Join this item group on Bulk Share and save money by buying in bulk!`;

  /********************************************
   * LOAD MORE BUTTON
   ********************************************/
  const [endIndex, setEndIndex] = useState(6);
  const handleLoadMore = () => {
    setEndIndex((prev) => prev + 6);
    if (defaultListItems.length > endIndex) {
      const nextItems = defaultListItems.slice(0, endIndex + 3);
      setListItems(nextItems);
    } else {
      setListItems(defaultListItems);
    }
  };

  /********************************************
   * SEARCH FUNCTIONALITY
   ********************************************/
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm] = useDebounce(searchTerm, 500);

  // const handleSearchChange = useCallback(
  //   () => {
  //         if (debouncedSearchTerm) {
  //     const filteredItems = defaultListItems.filter(
  //       (item: any) =>
  //         item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
  //         item.description?.short
  //           .toLowerCase()
  //           .includes(debouncedSearchTerm.toLowerCase()),
  //     );
  //     const firstFewItems = filteredItems.slice(0, endIndex);
  //     setListItems(firstFewItems);
  //   } else {
  //     setListItems(defaultListItems.slice(0, endIndex));
  //   }
  //   },
  //   [debouncedSearchTerm, defaultListItems, endIndex],
  // )

  useEffect(() => {
    if (debouncedSearchTerm) {
      const filteredItems = defaultListItems.filter(
        (item: any) =>
          item.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          item.firstName
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          item.lastName
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          item.country
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()),
      );
      setListItems(filteredItems);
    } else {
      setListItems(defaultListItems.slice(0, endIndex));
    }
  }, [debouncedSearchTerm, defaultListItems, endIndex]);

  return (
    <div className="px-2 pt-5">
      <section className="container mx-auto my-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
          <h1 className="text-2xl font-bold">Shared Items</h1>
          <div className="flex space-x-2">
            <TextField
              placeholder="Search items..."
              variant="outlined"
              size="small"
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "8px",
                },
                // "& .MuiInputBase-input": {
                //   padding: "10px 12px",
                // },
              }}
              className="w-full max-w-[300px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Select
              value={selectedCountry}
              onChange={(event) => {
                console.log("Selected country:", defaultListItems);
                setSelectedCountry(event.target.value as string);
                // if (event.target.value === "world") {
                //   setListItems(defaultListItems);
                // } else {
                //   const countryFilteredItems = defaultListItems.filter(
                //     (item: any) => item.country === event.target.value,
                //   );
                //   setListItems(countryFilteredItems);
                // }
              }}
              fullWidth
              size="small"
              MenuProps={MenuProps}
              className="rounded-lg text-black dark:text-white"
            >
              <MenuItem
                value="world"
                onClick={() => {
                  setSelectedCountry("world");
                  setListItems(defaultListItems);
                }}
              >
                <span className="text-gray-600 dark:text-gray-400">
                  Worldwide
                </span>
              </MenuItem>
              {countryList.map((item: any) => (
                <MenuItem key={item.id} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </Select>
          </div>
        </div>
        <p className="mt-2 text-gray-600">
          This is the shared items page. Find all the items you can share with
          others.
        </p>
      </section>
      <section className="">
        {listItems.length === 0 && (
          <section className="container mx-auto mb-10 flex h-[50vh] flex-col items-center justify-center">
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
          <section className="container mx-auto my-5 mt-14 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {listItems.map((item: any) => (
              <Paper
                elevation={2}
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
                        <span className="text-sm">{item?.members}</span>
                        <span className="text-sm text-[#909EB0]">
                          /{item?.peopleRequired}
                        </span>
                      </Typography>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center space-x-4">
                    <Typography className="font-poppins max-w-[80%] truncate font-medium text-gray-900/60 md:text-base dark:text-gray-300">
                      {item?.firstName}{" "}
                      {item?.lastName && item?.lastName[0]?.toUpperCase()}.
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
                        app_dispatch(setOpenBackdrop());
                      }}
                      className="font-poppins w-full rounded-lg border border-[#E0E6EE] bg-white px-2 py-1 text-center font-medium text-black normal-case transition duration-300 hover:bg-[#00000010] md:px-4 dark:hover:bg-slate-200"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </Paper>
            ))}
          </section>
        )}
        {listItems.length > 0 && searchTerm === "" && (
          <div className="mb-4 flex justify-center">
            <Button
              variant="outlined"
              color="primary"
              className="font-poppins rounded-xl normal-case"
              onClick={() => {
                handleLoadMore();
              }}
              disabled={
                listItems.length >= defaultListItems.length ||
                defaultListItems.length === 0 ||
                (searchTerm !== "" && listItems.length <= 6)
              }
            >
              {listItems.length >= defaultListItems.length ||
              (searchTerm !== "" && listItems.length <= 6)
                ? "No more items"
                : "Load More"}
            </Button>
          </div>
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
