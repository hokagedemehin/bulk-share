"use client";
import { IconButton, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";

export default function Home() {
  const [activeLink, setActiveLink] = useState("home");

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };
  const [activeLink, setActiveLink] = useState("home");

  const handleLinkClick = (link: string) => {
    setActiveLink(link);
  };
  return (
    <main className="">
      <header className="bg-gray-100 py-4 shadow-md dark:bg-gray-900">
        {/* large screen */}
        <div className="container mx-auto hidden items-center justify-between md:flex">
          <div className="flex items-center">
            <Image
              src="/logo/bulk-logo.png"
              alt="Bulk Share Logo"
              width={50}
              height={50}
              className="mr-2"
            />
            <Typography
              variant="h6"
              className="font-poppins text-xl font-bold text-gray-900 dark:text-white"
            >
              Bulk Share
            </Typography>
          </div>
          <nav>
            <ul className="flex items-center space-x-4">
              <li>
                <Link
                  href={"/"}
                  className="font-poppins rounded-xl px-3 py-2 text-gray-900 transition duration-300 ease-in-out dark:text-white hover:dark:bg-gray-800"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href={"/shared-groups"}
                  className="font-poppins px-3 py-2 text-gray-900 dark:text-white"
                >
                  Shared groups
                </Link>
              </li>
              <li>
                <Link
                  href={"/my-lists"}
                  className="font-poppins rounded-xl bg-blue-700 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-blue-800"
                >
                  Get started
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        {/* small screen */}
        <div className="container mx-auto md:hidden">
          <div className="mx-2 flex items-center justify-between">
            <div className="flex items-center">
              <Image
                src="/logo/bulk-logo.png"
                alt="Bulk Share Logo"
                width={30}
                height={30}
                className="mr-2"
              />
              <Typography
                variant="h6"
                className="font-poppins text-lg font-bold text-gray-900 dark:text-white"
              >
                Bulk Share
              </Typography>
            </div>
            <IconButton className="ml-auto" aria-label="menu">
              <Icon
                icon="heroicons-outline:menu-alt-3"
                className="text-gray-900 dark:text-white"
                width={30}
                height={30}
              />
            </IconButton>
          </div>
        </div>
      </header>
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
    </main>
  );
}
