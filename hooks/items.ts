import type { Schema } from "@/amplify/data/resource";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

export const useSharedItems = () => {
  const [allListItems, setAllListItems] = useState<
    Schema["ListItem"]["type"][]
  >([]);

  function getListItems(setItems: any) {
    const listSub = client.models.ListItem.observeQuery().subscribe({
      next: ({ items, isSynced }) => {
        console.log("ListItem data", items);
        console.log("ListItem isSynced", isSynced);
        if (isSynced) {
          setItems([...items]);
        }
      },
      error: (error) => {
        console.error("Error fetching ListItem data", error);
      },
      complete: () => {
        console.log("ListItem subscription completed");
      },
    });
    return listSub;
  }

  useEffect(() => {
    const listSub = client.models.ListItem.observeQuery().subscribe({
      next: ({ items, isSynced }) => {
        console.log("ListItem data", items);
        console.log("ListItem isSynced", isSynced);
        if (isSynced) {
          setAllListItems(items);
        }
      },
      error: (error) => {
        console.error("Error fetching ListItem data", error);
      },
      complete: () => {
        console.log("ListItem subscription completed");
      },
    });
    // const onCreateSub = client.models.ListItem.onCreate().subscribe({
    //   next: (data) => {
    //     setAllListItems((prev) => [...prev, data]);
    //   }
    // })
    // const onUpdateSub = client.models.ListItem.onUpdate().subscribe({
    //   next: (data) => {
    //     setAllListItems((prev) => {
    //       const index = prev.findIndex(item => item.id === data.id);
    //       if (index !== -1) {
    //         const newList = [...prev];
    //         newList[index] = data;
    //         return newList;
    //       }
    //       return prev;
    //     });
    //   }
    // })
    // const onDeleteSub = client.models.ListItem.onDelete().subscribe({
    //   next: (data) => {
    //     setAllListItems((prev) => {
    //       const index = prev.findIndex(item => item.id === data.id);
    //       if (index !== -1) {
    //         const newList = [...prev];
    //         newList.splice(index, 1);
    //         return newList;
    //       }
    //       return prev;
    //     });
    //   }
    // })
    return () => {
      listSub.unsubscribe();
    };
  }, []);

  return {
    allListItems,
    getListItems,
    // listSub,
  };
};
