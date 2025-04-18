"use client";
import { useCloseBackdrop, useOpenBackdrop } from "@/hooks/backdrop";
import { Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
export default function Home() {
  useCloseBackdrop();
  const handleOpenBackdrop = useOpenBackdrop();

  return (
    <div className="">
      {/* hero */}
      <section className="container mx-auto my-16">
        <div className="mx-2 flex flex-col items-center justify-between rounded-2xl bg-gray-100 px-8 py-16 md:mx-0 lg:flex-row dark:bg-gray-900">
          <div className="mb-10 w-full lg:mb-0">
            <h1 className="font-poppins mb-4 text-center text-3xl font-bold text-gray-900 lg:text-left lg:text-4xl dark:text-white">
              Welcome to Bulk Share
            </h1>
            <div className="mb-6 flex flex-col items-center gap-2 lg:items-start">
              <p className="font-poppins text-center text-gray-700 lg:w-[90%] lg:text-left lg:text-lg dark:text-gray-300">
                Team up with people to buy in bulk and save money.
              </p>
              <Typography className="font-poppins text-center text-sm text-gray-700 sm:w-[80%] lg:w-[60%] lg:text-left lg:text-lg dark:text-gray-300">
                Join a shared group or create your own to start saving on your
                next purchase.
              </Typography>
            </div>
            <div className="flex justify-center lg:justify-start">
              <Link
                href={"/shared-groups"}
                onClick={() => {
                  handleOpenBackdrop("/shared-groups");
                }}
                className="font-poppins rounded-lg bg-blue-600 px-6 py-2 font-medium text-white normal-case hover:bg-blue-700"
              >
                Get Started
              </Link>
            </div>
          </div>
          <div className="flex w-full justify-center">
            <Image
              className="h-auto w-full rounded-2xl object-cover md:w-[90%]"
              src="/hero1.jpg"
              alt="Bulk Share"
              width={2500}
              height={1500}
              priority
            />
          </div>
        </div>
      </section>
    </div>
  );
}
