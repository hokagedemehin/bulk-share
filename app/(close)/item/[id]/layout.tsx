// "use client";
// import { fetchUserAttributes } from "aws-amplify/auth";
// import { useEffect } from "react";
// import { useParams, useRouter } from "next/navigation";
import { type Schema } from "@/amplify/data/resource";
import { generateServerClientUsingCookies } from "@aws-amplify/adapter-nextjs/data";
import outputs from "@/amplify_outputs.json";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { runWithAmplifyServerContext } from "@/util/helpers/amplifyServerUtils";
import { fetchUserAttributes } from "aws-amplify/auth/server";
import type { Metadata, ResolvingMetadata } from "next";
/******************************************************
 * GENERATE METADATA
 ******************************************************/

export async function generateMetadata(
  {
    params,
  }: {
    params: Promise<{ id: string }>;
  },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  try {
    const { id } = await params;
    const cookieBasedClient = generateServerClientUsingCookies<Schema>({
      config: outputs,
      cookies,
    });
    const { data } = await cookieBasedClient.models.ListItem.get({
      id: id as string,
    });

    const prevData = await parent;

    return {
      title: `${data?.name} || ${prevData.title}`,
      description: `${data?.description?.short} || Join the community and save on your next purchase!`,
      openGraph: {
        title: `${data?.name} || ${prevData.title}`,
        description: `${data?.description?.short} || Join the community and save on your next purchase!`,
        url: `https://bulk-share.vercel.app/item/${data?.id}`,
        siteName: "Bulk Share",
        images: [
          {
            url:
              data?.coverImage ||
              "https://res.cloudinary.com/luvely/image/upload/v1745797156/bulk-logo_eftgk3.png",
            width: 1200,
            height: 630,
            alt: `${data?.name} || ${prevData.title}`,
          },
          {
            url:
              data?.coverImage ||
              "https://res.cloudinary.com/luvely/image/upload/v1745797156/bulk-logo_eftgk3.png",
            width: 800,
            height: 600,
            alt: `${data?.name} || ${prevData.title}`,
          },
          {
            url:
              data?.coverImage ||
              "https://res.cloudinary.com/luvely/image/upload/v1745797156/bulk-logo_eftgk3.png",
            width: 1800,
            height: 1600,
            alt: `${data?.name} || ${prevData.title}`,
          },
        ],
        locale: "en-US",
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: `${data?.name} || ${prevData.title}`,
        description: `${data?.description?.short} || Join the community and save on your next purchase!`,
        images: [
          data?.coverImage ||
            "https://res.cloudinary.com/luvely/image/upload/v1745797156/bulk-logo_eftgk3.png",
        ],
        site: "@bulkshare",
        creator: "@hokage_demehin",
        creatorId: "@hokage_demehin",
        siteId: "@bulkshare",
      },
    };
  } catch (error) {
    console.error("Error in EditItemLayout", error);
    redirect("/not-authorized");
  }
}

export default async function MyItemDetailsLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}>) {
  try {
    const { id } = await params;
    const currentUser = await runWithAmplifyServerContext({
      nextServerContext: { cookies },
      operation: async (contextSpec) => fetchUserAttributes(contextSpec),
    });
    console.log("currentUser :>> ", currentUser);
    const cookieBasedClient = generateServerClientUsingCookies<Schema>({
      config: outputs,
      cookies,
    });
    console.log("item details id :>> ", id);
    const { data } = await cookieBasedClient.models.ListItem.get({
      id: id as string,
    });
    console.log("item details data :>> ", data);
    if (!data) {
      throw new Error("Item not found");
    }
    const userSub = data?.userSub;
    const userId = currentUser?.sub;

    if (userSub !== userId) {
      throw new Error("Not authorized");
    }
  } catch (error) {
    console.error("Error in EditItemLayout", error);
    redirect("/not-authorized");
  }
  return (
    <>
      <div className="">{children}</div>
    </>
  );
}
