"use client";
import { useCloseBackdrop } from "@/hooks/backdrop";
import { useSharedItems } from "@/hooks/items";
import React from "react";
import { Amplify } from "aws-amplify";
import "@aws-amplify/ui-react/styles.css";
import outputs from "@/amplify_outputs.json";

Amplify.configure(outputs);

const SharedGroupsPage = () => {
  useCloseBackdrop();
  const { allListItems } = useSharedItems();

  console.log("allListItems", allListItems);
  return (
    <div className="">
      <section className="container mx-auto my-10">
        <h1 className="text-2xl font-bold">Shared Groups</h1>
        <p className="mt-2 text-gray-600">
          This is the shared groups page. You can manage your shared groups
          here.
        </p>
      </section>
    </div>
  );
};

export default SharedGroupsPage;
