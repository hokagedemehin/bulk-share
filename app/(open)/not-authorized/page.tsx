"use client";
import { useCloseBackdrop } from "@/hooks/backdrop";
import Image from "next/image";
import React from "react";

const NotAuthorizedPage = () => {
  useCloseBackdrop();
  return (
    <div className="px-2">
      <section className="container mx-auto my-5 h-[50vh]">
        <div className="flex flex-col items-center justify-center">
          <Image
            className="h-auto w-1/2 rounded-2xl object-cover md:max-w-[500px]"
            src="/403error1.png"
            alt="403 Error"
            width={2500}
            height={1500}
            priority
          />
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Hold up!
          </h1>
          <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
            You are not authorized to access this page.
          </p>
          <p className="mt-2 text-lg text-gray-700 dark:text-gray-300">
            Please contact the administrator for assistance via email at{" "}
            <a
              href="mailto:sharing.bulk@gmail.com"
              className="text-blue-600 hover:underline dark:text-blue-500"
            >
              sharing.bulk@gmail.com
            </a>
          </p>
        </div>
      </section>
    </div>
  );
};

export default NotAuthorizedPage;
