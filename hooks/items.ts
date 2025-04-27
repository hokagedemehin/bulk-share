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
        if (isSynced) {
          const parsedItems = items.map((item) => {
            return {
              ...item,
              members: JSON.parse(item.members as string),
              otherImages: JSON.parse(item.otherImages as string),
            };
          });
          console.log("parsedItems :>> ", parsedItems);

          const sortItems = parsedItems.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
          setItems([...sortItems]);
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
        if (isSynced) {
          const parsedItems = items.map((item) => {
            return {
              ...item,
              members: JSON.parse(item.members as string),
              // members: item.members,
              otherImages: JSON.parse(item.otherImages as string),
            };
          });

          const sortItems = parsedItems.sort((a, b) => {
            const dateA = new Date(a.createdAt);
            const dateB = new Date(b.createdAt);
            return dateB.getTime() - dateA.getTime();
          });
          setAllListItems([...sortItems]);
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
