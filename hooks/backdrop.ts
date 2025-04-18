"use client";
import {
  setCloseBackdrop,
  setOpenBackdrop,
} from "@/util/store/slice/backdropSlice";
import { useAppDispatch } from "@/util/store/store";
import { usePathname } from "next/navigation";
import { useCallback, useEffect } from "react";

export const useCloseBackdrop = () => {
  const app_dispatch = useAppDispatch();
  useEffect(() => {
    app_dispatch(setCloseBackdrop());
  }, [app_dispatch]);
};

export const useOpenBackdrop = () => {
  const pathname = usePathname();
  const app_dispatch = useAppDispatch();
  const handleOpenBackdrop = useCallback(
    (link: string) => {
      if (pathname !== link) {
        app_dispatch(setOpenBackdrop());
      }
    },
    [app_dispatch, pathname],
  );
  return handleOpenBackdrop;
};
