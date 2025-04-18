"use client";
import { useCloseBackdrop } from "@/hooks/backdrop";
import React from "react";

const SharedGroupsPage = () => {
  useCloseBackdrop();

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
