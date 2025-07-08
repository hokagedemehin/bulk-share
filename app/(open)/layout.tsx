"use client";
import {
  Button,
  IconButton,
  List,
  ListItem,
  Toolbar,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { Icon } from "@iconify/react";
import { useEffect, useState } from "react";
import Drawer from "@mui/material/Drawer";
import CustomBackdrop from "@/components/layout/CustomBackdrop";
import { usePathname } from "next/navigation";
import { useOpenBackdrop } from "@/hooks/backdrop";
import { signOut } from "aws-amplify/auth";
import { useAppDispatch } from "@/util/store/store";
import { setProfile } from "@/util/store/slice/profileSlice";
// import { PushRouter } from "@/util/helpers/routers";

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const handleOpenBackdrop = useOpenBackdrop();
  const [authenticated, setAuthenticated] = useState(false);
  const app_dispatch = useAppDispatch();
  // Removed unnecessary debug logging statement.

  useEffect(() => {
    const user = localStorage.getItem("bulk-share-email");
    setAuthenticated(!!user);

    return () => {};
  }, []);

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

  /********************************************************
   * SIGN OUT
   ********************************************************/
  // const pushRouter = PushRouter();

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("bulk-share-email");
      await signOut();
      app_dispatch(setProfile(null));
      setAuthenticated(false);
      // handleOpenBackdrop("/");
      // pushRouter("/");
      window.location.href = "/";
      // window.location.reload();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <>
      <main className="flex min-h-screen flex-col justify-between">
        <div className="">
          <header
            id="back-to-top-anchor"
            className="fixed top-0 z-50 w-full bg-gradient-to-l from-[#1B2746] to-[#101729] py-4"
          >
            {/* large screen */}
            <div className="container mx-auto hidden md:block">
              <nav className="flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    src="/logo/bulklogo2.png"
                    alt="Bulk Share Logo"
                    width={50}
                    height={50}
                    className="mr-2"
                  />
                  <Typography
                    variant="h6"
                    className="font-poppins text-xl font-bold text-white"
                  >
                    Bulk Share
                  </Typography>
                </div>
                <ul className="flex items-center space-x-4">
                  <li>
                    <Link
                      href={"/"}
                      className={`font-poppins rounded-xl px-3 py-2 transition duration-300 ease-in-out hover:bg-[#10172950] ${
                        pathname === "/"
                          ? "font-semibold text-white"
                          : "font-medium text-gray-500"
                      }`}
                      onClick={() => handleOpenBackdrop("/")}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href={"/shared-items"}
                      className={`font-poppins rounded-xl px-3 py-2 transition duration-300 ease-in-out hover:bg-[#10172950] ${
                        pathname === "/shared-items"
                          ? "font-semibold text-white"
                          : "font-medium text-gray-500"
                      }`}
                      onClick={() => handleOpenBackdrop("/shared-items")}
                    >
                      Browse Items
                    </Link>
                  </li>
                  {authenticated && (
                    <>
                      <li>
                        <Link
                          href={"/my-list"}
                          className={`font-poppins rounded-xl px-3 py-2 transition duration-300 ease-in-out hover:bg-[#10172950] ${
                            pathname === "/my-list"
                              ? "font-semibold text-white"
                              : "font-medium text-gray-500"
                          }`}
                          // onClick={() => handleOpenBackdrop("/my-list")}
                        >
                          My List
                        </Link>
                      </li>
                      <li>
                        <Link
                          href={"/profile"}
                          className={`font-poppins rounded-xl px-3 py-2 transition duration-300 ease-in-out hover:bg-[#10172950] ${
                            pathname === "/profile"
                              ? "font-semibold text-white"
                              : "font-medium text-gray-500"
                          }`}
                          // onClick={() => handleOpenBackdrop("/profile")}
                        >
                          Profile
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
                <ul className="flex items-center space-x-4">
                  {authenticated ? (
                    <>
                      <li>
                        <Button
                          id="menu-list"
                          variant="text"
                          className={`rounded-xl px-3 py-2`}
                          onClick={handleSignOut}
                        >
                          <Typography
                            className={`font-poppins font-medium text-gray-500 normal-case`}
                          >
                            Log out
                          </Typography>
                        </Button>
                      </li>
                    </>
                  ) : (
                    <li>
                      <Link
                        href={"/my-list"}
                        className="font-poppins rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-700 transition duration-300 ease-in-out hover:bg-gray-100"
                      >
                        Get started
                      </Link>
                    </li>
                  )}
                </ul>
              </nav>
            </div>
            {/* small screen */}
            <div className="container mx-auto block md:hidden">
              <div className="mx-2 flex items-center justify-between">
                <div className="flex items-center">
                  <Image
                    src="/logo/bulklogo2.png"
                    alt="Bulk Share Logo"
                    width={30}
                    height={30}
                    className="mr-2"
                  />
                  <Typography
                    variant="h6"
                    className="font-poppins text-lg font-bold text-white"
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
                    className="text-white"
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
              className=""
            >
              <div
                className="flex h-full w-64 flex-col items-start justify-start bg-gradient-to-bl from-[#1B2746] to-[#101729] p-4"
                role="presentation"
                onClick={toggleDrawerHandler(false)}
                onKeyDown={toggleDrawerHandler(false)}
              >
                <div className="mb-4 flex items-center">
                  <Image
                    src="/logo/bulklogo2.png"
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
                    {/* home */}
                    <ListItem disablePadding>
                      <Link
                        href="/"
                        className={`font-poppins w-full rounded-lg px-3 py-2 transition duration-300 ease-in-out hover:bg-[#10172950] ${
                          pathname === "/"
                            ? "font-semibold text-white"
                            : "font-medium text-gray-500"
                        }`}
                        onClick={() => handleOpenBackdrop("/")}
                      >
                        Home
                      </Link>
                    </ListItem>
                    {/* shared items */}
                    <ListItem disablePadding>
                      <Link
                        href="/shared-items"
                        className={`font-poppins w-full rounded-lg px-3 py-2 transition duration-300 ease-in-out hover:bg-[#10172950] ${
                          pathname === "/shared-items"
                            ? "font-semibold text-white"
                            : "font-medium text-gray-500"
                        }`}
                        onClick={() => handleOpenBackdrop("/")}
                      >
                        Shared Items
                      </Link>
                    </ListItem>
                    {authenticated ? (
                      <>
                        {/* my list */}
                        <ListItem disablePadding>
                          <Link
                            href="/my-list"
                            className={`font-poppins w-full rounded-lg px-3 py-2 transition duration-300 ease-in-out hover:bg-[#10172950] ${
                              pathname === "/my-list"
                                ? "font-semibold text-white"
                                : "font-medium text-gray-500"
                            }`}
                          >
                            My List
                          </Link>
                        </ListItem>
                        {/* profile */}
                        <ListItem disablePadding>
                          <Link
                            href="/profile"
                            className={`font-poppins w-full rounded-lg px-3 py-2 transition duration-300 ease-in-out hover:bg-[#10172950] ${
                              pathname === "/profile"
                                ? "font-semibold text-white"
                                : "font-medium text-gray-500"
                            }`}
                          >
                            Profile
                          </Link>
                        </ListItem>
                        {/* log out */}
                        <ListItem disablePadding>
                          <Link
                            href="#"
                            className={`font-poppins w-full rounded-lg px-3 py-2 font-medium text-gray-500 transition duration-300 ease-in-out hover:bg-[#10172950]`}
                            onClick={handleSignOut}
                          >
                            Log out
                          </Link>
                        </ListItem>
                      </>
                    ) : (
                      <ListItem disablePadding>
                        <Link
                          href="/my-list"
                          className={`font-poppins w-full rounded-lg px-3 py-2 font-medium text-gray-500 transition duration-300 ease-in-out hover:bg-[#10172950]`}
                        >
                          Get started
                        </Link>
                      </ListItem>
                    )}

                    {/* get started */}
                    {/* {!authenticated && (
                      <ListItem disablePadding>
                        <Link
                          href="/my-list"
                          className={`font-poppins w-full rounded-lg px-3 py-2 font-medium text-gray-500 transition duration-300 ease-in-out hover:bg-[#10172950]`}
                        >
                          Get started
                        </Link>
                      </ListItem>
                    )} */}
                  </List>
                </nav>
              </div>
            </Drawer>
          </header>
          <Toolbar className="" />
          <div className="">{children}</div>
        </div>
        <footer className="bg-gradient-to-l from-[#1B2746] to-[#101729]">
          <section className="relative container mx-auto overflow-hidden px-3 pt-10 pb-4">
            <div className="absolute inset-x-0 -bottom-5 z-0 h-[10vh] w-full bg-[url('https://res.cloudinary.com/luvely/image/upload/v1751821456/footer1_ibyi0x.png')] bg-contain bg-center bg-no-repeat opacity-90 md:-bottom-9 md:h-[19vh] lg:-bottom-5"></div>

            <div className="relative z-10 flex flex-col md:flex-row md:justify-between">
              <div className="w-full space-y-4">
                <div className="flex items-center space-x-2">
                  <Image
                    src={"/bulklogo2.png"}
                    alt="Bulk Share Logo"
                    width={50}
                    height={50}
                    className="h-8 w-8 rounded-full object-cover"
                  />
                  <Typography className="font-bricolage-grotesque text-xl font-semibold text-white">
                    Bulk Share
                  </Typography>
                </div>
                <Typography className="font-poppins text-sm text-white/60 md:w-[50%]">
                  Group Buying Made Easy. Start your journey today!
                </Typography>
                <div className="flex items-center space-x-3">
                  <Link
                    href="/create-new-item"
                    onClick={() => {
                      // handleOpenBackdrop("/create-new-item");
                    }}
                    className="font-poppins rounded-lg bg-white px-2 py-2 text-xs font-medium text-black normal-case transition duration-300 hover:bg-gray-100 md:px-4"
                  >
                    Create an Item
                  </Link>
                  <Link
                    href="/shared-items"
                    onClick={() => {
                      handleOpenBackdrop("/shared-items");
                    }}
                    className="font-poppins rounded-lg bg-white/10 px-2 py-2 text-xs font-medium text-white normal-case transition duration-300 hover:bg-gray-700 md:px-4"
                  >
                    Browse Shared Items
                  </Link>
                </div>
              </div>
              <div className="my-3 grid w-full grid-cols-2 gap-4 md:my-0">
                {/* company */}
                <div className="">
                  <Typography className="font-poppins text-base font-semibold text-white">
                    Company
                  </Typography>
                  <ul className="mt-2 space-y-1">
                    <li>
                      <Link
                        href="/"
                        className="font-poppins text-sm text-white/60 hover:text-white"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#how"
                        className="font-poppins text-sm text-white/60 hover:text-white"
                      >
                        How it works
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="#shared-items"
                        className="font-poppins text-sm text-white/60 hover:text-white"
                      >
                        Browse Items
                      </Link>
                    </li>
                  </ul>
                </div>
                {/* contact */}
                <div className="">
                  <Typography className="font-poppins text-base font-semibold text-white">
                    Contact
                  </Typography>
                  <ul className="mt-2 space-y-1">
                    <Typography className="font-poppins text-sm text-white/60">
                      Have questions or need support? Reach out to us!
                    </Typography>
                    <li>
                      <Link
                        href={`mailto:sharing.bulk@gmail.com`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => {
                          window.open(
                            "mailto:sharing.bulk@gmail.com?subject=Bulk Share Inquiry",
                            "_blank",
                          );
                        }}
                        className="font-poppins text-sm text-white/60 hover:text-white"
                      >
                        Email: sharing.bulk@gmail.com
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
            {/* copyright */}
            <div className="relative mt-14 grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="">
                <Typography className="font-poppins text-sm text-white/60">
                  © {new Date().getFullYear()} Bulk Share. All rights reserved.
                </Typography>
              </div>
              <div className="flex space-x-4 md:justify-end">
                <Link
                  href="/privacy-policy"
                  className="font-poppins text-sm text-white/60 hover:text-white"
                >
                  Privacy Policy
                </Link>
                <Link
                  href="/terms-of-service"
                  className="font-poppins text-sm text-white/60 hover:text-white"
                >
                  Terms of Service
                </Link>
              </div>
            </div>
          </section>
        </footer>
      </main>
      {/* backdrop */}
      <CustomBackdrop />
    </>
  );
}
