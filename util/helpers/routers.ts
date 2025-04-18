import { usePathname, useRouter } from "next/navigation";
import { useCallback } from "react";

export function PushRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const pushRouter = useCallback(
    (path: string) => {
      if (path !== pathname) {
        router.push(path);
      }
    },
    [router, pathname],
  );

  return pushRouter;
}

export function ReplaceRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const replaceRouter = useCallback(
    (path: string) => {
      if (path !== pathname) {
        router.replace(path);
      }
    },
    [router, pathname],
  );

  return replaceRouter;
}

export function BackRouter() {
  const router = useRouter();
  const pathname = usePathname();
  const backRouter = useCallback(() => {
    if (pathname !== "/") {
      router.back();
    }
  }, [router, pathname]);

  return backRouter;
}
