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
  ListItemButton,
  ListItemText,
  Typography,
} from "@mui/material";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useOpenBackdrop } from "@/hooks/backdrop";
import { fetchUserAttributes, signOut } from "aws-amplify/auth";
import { Icon } from "@iconify/react";
import { useAppDispatch } from "@/util/store/store";
import { setProfile } from "@/util/store/slice/profileSlice";
import { setOpenBackdrop } from "@/util/store/slice/backdropSlice";

Amplify.configure(outputs);

const AuthHeaderComp = () => {
  const pathname = usePathname();
  const handleOpenBackdrop = useOpenBackdrop();
  const app_dispatch = useAppDispatch();
  const router = useRouter();
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
      await signOut();
      localStorage.removeItem("bulk-share-email");
      app_dispatch(setProfile(null));
      app_dispatch(setOpenBackdrop());
      router.push("/");
    } catch (error) {
      console.error("Error signing out: ", error);
    }
  };

  return (
    <header
      id="back-to-top-anchor"
      className="fixed top-0 z-50 w-full bg-gray-100 py-2 shadow-md md:py-4 dark:bg-gray-900"
    >
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
                href={"/shared-items"}
                className={`font-poppins rounded-xl px-3 py-2 text-gray-900 transition duration-300 ease-in-out hover:bg-gray-200 dark:text-white hover:dark:bg-gray-800 ${
                  pathname === "/shared-items"
                    ? "bg-gray-200 font-medium dark:bg-gray-800"
                    : ""
                }`}
                onClick={() => handleOpenBackdrop("/shared-items")}
              >
                Shared Items
              </Link>
            </li>
            {userDetails ? (
              <>
                <li>
                  <Link
                    href={"/my-list"}
                    className={`font-poppins rounded-xl px-3 py-2 text-gray-900 transition duration-300 ease-in-out hover:bg-gray-200 dark:text-white hover:dark:bg-gray-800 ${
                      pathname === "/my-list"
                        ? "bg-gray-200 font-medium dark:bg-gray-800"
                        : ""
                    }`}
                    onClick={() => handleOpenBackdrop("/my-list")}
                  >
                    My List
                  </Link>
                </li>
                <li>
                  <Link
                    href={"/profile"}
                    className={`font-poppins rounded-xl px-3 py-2 text-gray-900 transition duration-300 ease-in-out hover:bg-gray-200 dark:text-white hover:dark:bg-gray-800 ${
                      pathname === "/profile"
                        ? "bg-gray-200 font-medium dark:bg-gray-800"
                        : ""
                    }`}
                    onClick={() => handleOpenBackdrop("/profile")}
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Button
                    id="menu-list"
                    variant="text"
                    className={`rounded-xl px-3 py-2 text-gray-900 dark:text-white`}
                    onClick={handleSignOut}
                  >
                    <Typography
                      className={`font-poppins font-medium text-gray-900 normal-case dark:text-white`}
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
                  className="font-poppins rounded-xl bg-blue-700 px-4 py-2 text-white transition duration-300 ease-in-out hover:bg-blue-800"
                >
                  Get started
                </Link>
              </li>
            )}
          </ul>
        </nav>
      </div>
      {/* small screen */}
      <div id="back-to-top-anchor" className="container mx-auto md:hidden">
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
              {/* home */}
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
              {/* shared items */}
              <ListItem disablePadding>
                <ListItemButton
                  href="/shared-items"
                  className={`hover:bg-gray-200 hover:dark:bg-gray-800 ${
                    pathname === "/shared-items"
                      ? "bg-gray-200 font-medium dark:bg-gray-800"
                      : ""
                  }`}
                  onClick={() => handleOpenBackdrop("/shared-items")}
                >
                  <ListItemText
                    primary={
                      <Typography
                        className={`font-poppins w-full text-gray-900 dark:text-white`}
                      >
                        Shared Items
                      </Typography>
                    }
                  />
                </ListItemButton>
              </ListItem>
              {userDetails && (
                <>
                  {/* my list */}
                  <ListItem disablePadding>
                    <ListItemButton
                      href="/my-list"
                      className={`hover:bg-gray-200 hover:dark:bg-gray-800 ${
                        pathname === "/my-list"
                          ? "bg-gray-200 font-medium dark:bg-gray-800"
                          : ""
                      }`}
                      onClick={() => handleOpenBackdrop("/my-list")}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            className={`font-poppins w-full text-gray-900 dark:text-white`}
                          >
                            My List
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  {/* profile */}
                  <ListItem disablePadding>
                    <ListItemButton
                      href="/profile"
                      className={`hover:bg-gray-200 hover:dark:bg-gray-800 ${
                        pathname === "/profile"
                          ? "bg-gray-200 font-medium dark:bg-gray-800"
                          : ""
                      }`}
                      onClick={() => handleOpenBackdrop("/profile")}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            className={`font-poppins w-full text-gray-900 dark:text-white`}
                          >
                            Profile
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                  {/* sign out */}
                  <ListItem disablePadding>
                    <ListItemButton
                      className={`hover:bg-gray-200 hover:dark:bg-gray-800`}
                      onClick={handleSignOut}
                    >
                      <ListItemText
                        primary={
                          <Typography
                            className={`font-poppins w-full text-gray-900 dark:text-white`}
                          >
                            Log out
                          </Typography>
                        }
                      />
                    </ListItemButton>
                  </ListItem>
                </>
              )}
            </List>
          </nav>
        </div>
      </Drawer>
    </header>
  );
};

export default AuthHeaderComp;
