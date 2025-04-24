"use client";
import { useCloseBackdrop } from "@/hooks/backdrop";
import { setOpenBackdrop } from "@/util/store/slice/backdropSlice";
import { useAppDispatch } from "@/util/store/store";
import { Button, Paper } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSharedItems } from "@/hooks/items";
import Image from "next/image";

const MyListPage = () => {
  useCloseBackdrop();
  const app_dispatch = useAppDispatch();
  const router = useRouter();

  const { getListItems } = useSharedItems();

  const [myListItems, setMyListItems] = useState([] as any);

  useEffect(() => {
    const listSub1 = getListItems(setMyListItems);

    return () => {
      listSub1.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="px-2">
      <section className="container mx-auto my-5">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">My List</h1>
          <Button
            variant="contained"
            color="primary"
            className="font-poppins rounded-xl"
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
      <div className="">
        {myListItems.length === 0 && (
          <section className="container mx-auto flex h-[50vh] flex-col items-center justify-center">
            <Image
              src="/emptylist1.png"
              alt="empty list"
              width={1000}
              height={1000}
              className="h-auto w-full max-w-[400px] rounded-2xl object-cover"
            />
            <h1 className="text-2xl font-bold text-gray-500">
              No items found. Please add an item.
            </h1>
          </section>
        )}
        {myListItems.length > 0 && (
          <section className="container mx-auto my-5 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {myListItems.map((item: any) => (
              <Paper key={item?.id} elevation={3} className="rounded-lg p-4">
                <h2 className="text-xl font-bold">{item?.name}</h2>
                <p className="mt-2 text-gray-500 dark:text-gray-400">
                  {item?.description?.short}
                </p>
                <p className="font-poppins mt-2 text-lg text-gray-600 dark:text-white">
                  {new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                  }).format(item?.price)}
                </p>
                <div className="mt-4 flex items-center justify-end gap-2">
                  <Button
                    variant="outlined"
                    color="primary"
                    className="font-poppins rounded-xl normal-case"
                    onClick={() => {
                      app_dispatch(setOpenBackdrop());
                      router.push("/edit-item");
                    }}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    className="font-poppins rounded-xl normal-case"
                    onClick={() => {
                      app_dispatch(setOpenBackdrop());
                      router.push("/delete-item");
                    }}
                  >
                    Delete
                  </Button>
                </div>
              </Paper>
            ))}
          </section>
        )}
      </div>
    </div>
  );
};

export default MyListPage;
