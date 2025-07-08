"use client";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";
import {
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useOpenBackdrop } from "@/hooks/backdrop";
import { fetchUserAttributes, signOut } from "aws-amplify/auth";
import { Icon } from "@iconify/react";
import { useAppDispatch } from "@/util/store/store";
import { setProfile } from "@/util/store/slice/profileSlice";
// import { setOpenBackdrop } from "@/util/store/slice/backdropSlice";

Amplify.configure(outputs);

const AuthHeaderComp = () => {
  const pathname = usePathname();
  const handleOpenBackdrop = useOpenBackdrop();
  const app_dispatch = useAppDispatch();
  // const router = useRouter();
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
   * AMPLIFY PROJECT INITIALIZATION
   ********************************************************/
  const [userDetails, setUserDetails] = useState(null as any);

  useEffect(() => {
    (async () => {
      const user = await fetchUserAttributes();
      setUserDetails(user);
      app_dispatch(setProfile(user));
      localStorage.setItem("bulk-share-email", user.email!);
    })();

    return () => {};
  }, [app_dispatch]);

  // console.log("userDetails :>> ", userDetails);

  /********************************************************
   * SIGN OUT
   ********************************************************/

  const handleSignOut = async () => {
    try {
      localStorage.removeItem("bulk-share-email");
      app_dispatch(setProfile(null));
      // app_dispatch(setOpenBackdrop());
      await signOut();
      window.location.href = "/";
      // router.push("/");
      // window.location.reload();
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header
      id="back-to-top-anchor"
      className="fixed top-0 z-50 w-full bg-gradient-to-l from-[#1B2746] to-[#101729] py-4 shadow-md"
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
            {userDetails && (
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
            {userDetails ? (
              <>
                <li>
                  <Button
                    id="menu-list"
                    variant="text"
                    className={`rounded-xl px-3 py-2 text-gray-900 dark:text-white`}
                    onClick={handleSignOut}
                  >
                    <Typography
                      className={`font-poppins font-medium text-gray-400 normal-case dark:text-gray-500`}
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
                  className="font-poppins rounded-xl bg-white px-4 py-2 text-sm font-medium text-gray-700 transition duration-300 ease-in-out hover:bg-gray-200"
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
              className="font-poppins text-xl font-bold text-white"
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
              {userDetails ? (
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
            </List>
          </nav>
        </div>
      </Drawer>
    </header>
  );
};

export default AuthHeaderComp;
