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
// import { getCurrentUser } from "aws-amplify/auth/server";

export default async function EditItemLayout({
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
    console.log("id :>> ", id);
    const { data } = await cookieBasedClient.models.ListItem.get({
      id: id as string,
    });
    console.log("data :>> ", data);
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

  // const router = useRouter();
  // const { id } = useParams();
  // useEffect(() => {
  //   const fetchUser = async () => {
  //     try {
  // const user = await fetchUserAttributes();
  //       client.models.ListItem.get({
  //         id: id as string,
  //       }).then((res) => {
  //         console.log("res :>> ", res);
  //         if (res && res.data) {
  //           const userSub = res?.data.userSub;
  //           if (userSub !== user.sub) {
  //             console.log("you are not the owner of this item");
  //             router.push("/not-authorized");
  //           }
  //         } else {
  //           router.push("/not-authorized");
  //           console.log("res.data is undefined");
  //         }
  //       });
  //     } catch (error) {
  //       console.error("Error fetching user details", error);
  //     }
  //   };
  //   fetchUser();
  // }, [id, router]);
  return (
    <>
      <div className="">{children}</div>
    </>
  );
}
