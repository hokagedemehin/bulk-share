"use client";
import {
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useState } from "react";
import Drawer from "@mui/material/Drawer";
import CustomBackdrop from "@/components/layout/CustomBackdrop";
import { usePathname } from "next/navigation";
import { useOpenBackdrop } from "@/hooks/backdrop";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const handleOpenBackdrop = useOpenBackdrop();

  /********************************************************
   * DRAWER
   ********************************************************/
  const [toggleDrawer, setToggleDrawer] = useState(false);

  const toggleDrawerHandler =
    (open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
      if (
        event &&
        event.type === "keydown" &&
        (event as React.KeyboardEvent).key === "Tab"
      ) {
        return;
      }
      setToggleDrawer(open);
    };
  return (
    <main>
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
                  className={`font-poppins rounded-xl px-3 py-2 text-gray-900 transition duration-300 ease-in-out hover:bg-gray-200 dark:text-white hover:dark:bg-gray-800 ${
                    pathname === "/"
                      ? "bg-gray-200 font-medium dark:bg-gray-800"
                      : ""
                  }`}
                  onClick={() => handleOpenBackdrop("/")}
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href={"/shared-groups"}
                  className={`font-poppins rounded-xl px-3 py-2 text-gray-900 transition duration-300 ease-in-out hover:bg-gray-200 dark:text-white hover:dark:bg-gray-800 ${
                    pathname === "/shared-groups"
                      ? "bg-gray-200 font-medium dark:bg-gray-800"
                      : ""
                  }`}
                  onClick={() => handleOpenBackdrop("/shared-groups")}
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
            <IconButton
              className="ml-auto"
              aria-label="menu"
              onClick={toggleDrawerHandler(true)}
            >
              <Icon
                icon="heroicons-outline:menu-alt-3"
                className="text-gray-900 dark:text-white"
                width={30}
                height={30}
              />
            </IconButton>
          </div>
        </div>
        {/* mobile drawer */}
        <Drawer
          anchor="right"
          open={toggleDrawer}
          onClose={toggleDrawerHandler(false)}
          className="bg-gray-100 dark:bg-gray-900"
        >
          <div
            className="flex h-full w-64 flex-col items-start justify-start bg-gray-100 p-4 dark:bg-gray-900"
            role="presentation"
            onClick={toggleDrawerHandler(false)}
            onKeyDown={toggleDrawerHandler(false)}
          >
            <div className="mb-4 flex items-center">
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
            <nav className="mt-2 w-full">
              <List className="space-y-4">
                <ListItem disablePadding>
                  <ListItemButton
                    href="/"
                    className={`hover:bg-gray-200 hover:dark:bg-gray-800 ${
                      pathname === "/"
                        ? "bg-gray-200 font-medium dark:bg-gray-800"
                        : ""
                    }`}
                    onClick={() => handleOpenBackdrop("/")}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          className={`font-poppins w-full text-gray-900 dark:text-white`}
                        >
                          Home
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
                <ListItem disablePadding>
                  <ListItemButton
                    href="/shared-groups"
                    className={`hover:bg-gray-200 hover:dark:bg-gray-800 ${
                      pathname === "/shared-groups"
                        ? "bg-gray-200 font-medium dark:bg-gray-800"
                        : ""
                    }`}
                    onClick={() => handleOpenBackdrop("/shared-groups")}
                  >
                    <ListItemText
                      primary={
                        <Typography
                          className={`font-poppins w-full text-gray-900 dark:text-white`}
                        >
                          Shared groups
                        </Typography>
                      }
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </nav>
          </div>
        </Drawer>
      </header>
      {children}
      <CustomBackdrop />
    </main>
  );
}
