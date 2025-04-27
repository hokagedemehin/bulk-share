"use client";
import { useCloseBackdrop } from "@/hooks/backdrop";
import { BackRouter } from "@/util/helpers/routers";
import { IconButton } from "@mui/material";
import React from "react";
import { Icon } from "@iconify/react";

const MyItemDetailsPage = () => {
  useCloseBackdrop();
  const backRouter = BackRouter();

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
    </div>
  );
};

export default MyItemDetailsPage;
