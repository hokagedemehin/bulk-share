"use client";
import { useCloseBackdrop, useOpenBackdrop } from "@/hooks/backdrop";
import { Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import SharedItemsComp from "@/components/home/SharedItemsComp";

export default function Home() {
  useCloseBackdrop();
  const handleOpenBackdrop = useOpenBackdrop();

  return (
    <div className="bg-[#FBFCFE] dark:bg-[#0A0A0A]">
      {/* hero */}
      <div className="flex h-[85vh] flex-col items-center justify-center bg-gradient-to-l from-[#1B2746] to-[#101729]">
        <section className="container mx-auto flex flex-col items-center justify-center px-3">
          <div className="flex items-center space-x-3">
            <h1 className="font-bricolage-grotesque text-3xl font-semibold text-white md:text-5xl">
              Group Up.
            </h1>
            <h1 className="font-bricolage-grotesque text-3xl font-semibold text-[#1BADFF] md:text-5xl">
              <span className="mr-2 text-white">Buy</span>
              Smater.
            </h1>
          </div>
          <p className="font-poppins mt-4 text-center text-sm font-medium text-white md:text-xl lg:w-[50%]">
            With Bulk Share, you can easily join forces with others to purchase
            items in bulk. Share the cost and get value together!
          </p>
          <div className="mt-[40px] mb-10">
            <Link
              href="/create-new-item"
              onClick={() => {
                // handleOpenBackdrop("/create-new-item");
              }}
              className="font-poppins rounded-lg bg-white px-2 py-2 font-medium text-black normal-case transition duration-300 hover:bg-gray-100 md:px-6"
            >
              Create an Item
            </Link>
            <Link
              href="/shared-items"
              onClick={() => {
                handleOpenBackdrop("/shared-items");
              }}
              className="font-poppins ml-4 rounded-lg bg-white/10 px-2 py-2 font-medium text-white normal-case transition duration-300 hover:bg-gray-700 md:px-6"
            >
              Browse Shared Items
            </Link>
          </div>
          <div className="mt-8">
            <Image
              className="h-auto w-full rounded-2xl object-contain xl:h-[30vh]"
              src="/bulkhero1.png"
              alt="Bulk Share"
              width={2500}
              height={1500}
              priority
            />
          </div>
        </section>
      </div>
      {/* how it works */}
      <div id="how" className="px-3">
        <section className="container mx-auto my-10">
          <div className="flex flex-col items-center justify-center">
            <div className="flex w-fit items-center rounded-full border border-[#1BADFF50] p-1.5">
              <div className="rounded-full bg-[#F6F9FA] p-1">
                <Icon
                  icon="hugeicons:flash"
                  className="text-sm text-[#1BADFF] md:text-xl"
                  // width={20}
                  // height={20}
                />
              </div>
              <Typography className="font-poppins ml-2 text-sm text-[#1A1A1AB2] md:text-base dark:text-white">
                How it works!
              </Typography>
            </div>
            <h2 className="font-bricolage-grotesque mt-4 text-center text-lg font-normal text-gray-900 md:w-[40%] md:text-2xl dark:text-white">
              Learn how Bulk Share can make your life easy in 5 simple steps.
            </h2>
          </div>
          <div className="my-6 grid grid-cols-1 gap-5 lg:grid-cols-3">
            {/* step 1 | step 2 */}
            <div className="flex flex-col justify-between space-y-5">
              {/* step 1 */}
              <div className="h-[48%] rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex justify-end">
                  <div className="rounded-full bg-blue-50 p-2">
                    <Icon
                      icon="hugeicons:task-edit-02"
                      className="text-lg text-blue-600 md:text-2xl"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-end lg:h-[80%]">
                  <div className="flex w-fit items-center rounded-full border border-[#1BADFF50] px-2 py-0.5">
                    <Typography className="font-poppins text-xs text-[#1BADFF] dark:text-white">
                      Step 1
                    </Typography>
                  </div>
                  <Typography className="font-poppins mt-3 mb-1 text-lg font-medium text-gray-900 dark:text-white">
                    Create a Shared Item
                  </Typography>
                  <Typography className="font-poppins w-[80%] text-sm text-gray-600 dark:text-gray-300">
                    Start a campaign for a bulk item you want to buy.
                  </Typography>
                </div>
              </div>
              {/* step 2 */}
              <div className="h-[48%] rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex justify-end">
                  <div className="rounded-full bg-green-50 p-2">
                    <Icon
                      icon="hugeicons:target-02"
                      className="text-lg text-green-600 md:text-2xl"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-end lg:h-[80%]">
                  <div className="flex w-fit items-center rounded-full border border-[#1BADFF50] px-2 py-0.5">
                    <Typography className="font-poppins text-xs text-[#1BADFF] dark:text-white">
                      Step 2
                    </Typography>
                  </div>
                  <Typography className="font-poppins mt-3 mb-1 text-lg font-medium text-gray-900 dark:text-white">
                    Set your target
                  </Typography>
                  <Typography className="font-poppins w-[80%] text-sm text-gray-600 dark:text-gray-300">
                    Define how much is needed and how many people can join.
                  </Typography>
                </div>
              </div>
            </div>
            {/* step 3 */}
            <div className="rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
              <Image
                src={"/step32.png"}
                alt="Step 3"
                width={1500}
                height={1500}
                className="h-[40vh] w-full rounded-lg object-contain"
              />
              <div className="">
                <div className="flex w-fit items-center rounded-full border border-[#1BADFF50] px-2 py-0.5">
                  <Typography className="font-poppins text-xs text-[#1BADFF] dark:text-white">
                    Step 3
                  </Typography>
                </div>
                <Typography className="font-poppins mt-3 mb-1 text-lg font-medium text-gray-900 dark:text-white">
                  Share with Your Group
                </Typography>
                <Typography className="font-poppins w-[90%] text-sm text-gray-600 dark:text-gray-300">
                  After setting up your shared item, invite friends, family, or
                  community members interested in the deal using Bulk Share.
                </Typography>
              </div>
            </div>
            {/* step 4 | step 5 */}
            <div className="flex flex-col justify-between space-y-5">
              {/* step 5 */}
              <div className="h-[48%] rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex justify-end">
                  <div className="rounded-full bg-indigo-50 p-2">
                    <Icon
                      icon="hugeicons:chart-up"
                      className="text-lg text-indigo-600 md:text-2xl"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-end lg:h-[80%]">
                  <div className="flex w-fit items-center rounded-full border border-[#1BADFF50] px-2 py-0.5">
                    <Typography className="font-poppins text-xs text-[#1BADFF] dark:text-white">
                      Step 4
                    </Typography>
                  </div>
                  <Typography className="font-poppins mt-3 mb-1 text-lg font-medium text-gray-900 dark:text-white">
                    Contribute & Track
                  </Typography>
                  <Typography className="font-poppins w-[80%] text-sm text-gray-600 dark:text-gray-300">
                    Everyone Accepted to a group can contribute towards the
                    target amount.
                  </Typography>
                </div>
              </div>
              {/* step 5 */}
              <div className="h-[48%] rounded-lg border border-gray-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                <div className="flex justify-end">
                  <div className="rounded-full bg-pink-50 p-2">
                    <Icon
                      icon="hugeicons:square-unlock-01"
                      className="text-lg text-pink-600 md:text-2xl"
                    />
                  </div>
                </div>
                <div className="flex flex-col justify-end lg:h-[80%]">
                  <div className="flex w-fit items-center rounded-full border border-[#1BADFF50] px-2 py-0.5">
                    <Typography className="font-poppins text-xs text-[#1BADFF] dark:text-white">
                      Step 5
                    </Typography>
                  </div>
                  <Typography className="font-poppins mt-3 mb-1 text-lg font-medium text-gray-900 dark:text-white">
                    Unlock & Buy
                  </Typography>
                  <Typography className="font-poppins w-[80%] text-sm text-gray-600 dark:text-gray-300">
                    Get your Item on the agreed date and enjoy the savings
                    together.
                  </Typography>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
      {/* latest shared items available */}
      <div id="shared-items" className="px-3">
        <section className="container mx-auto my-10">
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
          <SharedItemsComp />
        </section>
      </div>
    </div>
  );
}
