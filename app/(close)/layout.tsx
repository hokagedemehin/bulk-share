"use client";
import CustomBackdrop from "@/components/layout/CustomBackdrop";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";
import { Toolbar, Typography } from "@mui/material";
import AuthHeaderComp from "@/components/AuthHeader";
import Image from "next/image";
import Link from "next/link";
import { useOpenBackdrop } from "@/hooks/backdrop";

Amplify.configure(outputs, {
  ssr: true,
});

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const handleOpenBackdrop = useOpenBackdrop();
  return (
    <>
      <main className="flex min-h-screen flex-col justify-between">
        <Authenticator className="min-h-screen">
          <div className="">
            <AuthHeaderComp />
            <Toolbar className="mt-2 md:mt-5" />
            {children}
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
                    © {new Date().getFullYear()} Bulk Share. All rights
                    reserved.
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
        </Authenticator>
      </main>
      <CustomBackdrop />
    </>
  );
}
