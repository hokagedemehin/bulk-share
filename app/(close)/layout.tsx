"use client";
import CustomBackdrop from "@/components/layout/CustomBackdrop";
import { Authenticator } from "@aws-amplify/ui-react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";
import { Toolbar, Typography } from "@mui/material";
import AuthHeaderComp from "@/components/AuthHeader";

Amplify.configure(outputs, {
  ssr: true,
});

export default function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className="flex min-h-screen flex-col justify-between">
        <Authenticator className="min-h-screen">
          <div className="">
            <AuthHeaderComp />
            <Toolbar className="mt-2 md:mt-5" />
            {children}
          </div>
          <footer className="bg-gray-100 py-4 shadow-md dark:bg-gray-900">
            <div className="container mx-auto text-center">
              <Typography
                variant="body2"
                className="font-poppins text-gray-900 dark:text-white"
              >
                &copy; {new Date().getFullYear()} Bulk Share. All rights
                reserved.
              </Typography>
            </div>
          </footer>
        </Authenticator>
      </main>
      <CustomBackdrop />
    </>
  );
}
