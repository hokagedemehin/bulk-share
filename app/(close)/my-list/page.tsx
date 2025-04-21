"use client";
import { useCloseBackdrop } from "@/hooks/backdrop";
import { setOpenBackdrop } from "@/util/store/slice/backdropSlice";
import { useAppDispatch } from "@/util/store/store";
import { Button } from "@mui/material";
import React from "react";
import { useRouter } from "next/navigation";

const MyListPage = () => {
  useCloseBackdrop();
  const app_dispatch = useAppDispatch();
  const router = useRouter();

  return (
    <div className="">
      <section className="container mx-auto my-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My List</h1>
          <Button
            variant="contained"
            color="primary"
            className="rounded-xl"
            onClick={() => {
              app_dispatch(setOpenBackdrop());
              router.push("/create-new-item");
            }}
          >
            Add New Item
          </Button>
        </div>
        <p className="mt-2 text-gray-600">
          This is the my list page. You can manage your list here.
        </p>
      </section>
    </div>
  );
};

export default MyListPage;
