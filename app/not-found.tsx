import Image from "next/image";
import Link from "next/link";
import React from "react";

const NotFound = () => {
  return (
    <div className="flex h-screen flex-col items-center justify-center bg-gray-100 dark:bg-gray-900">
      <Image
        className="h-auto w-2/3 rounded-2xl object-cover md:max-w-[500px]"
        src="/404error1.png"
        alt="404 Error"
        width={2500}
        height={1500}
        priority
      />
      <h1 className="mt-10 text-center text-2xl font-bold md:text-4xl">
        404 - Page Not Found
      </h1>
      <p className="mt-4 text-center text-sm md:text-lg">
        Sorry, the page you are looking for does not exist.
      </p>
      <div className="mt-8 flex justify-center">
        <Link href="/" className="rounded bg-blue-500 px-4 py-2 text-white">
          Go to Home
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
