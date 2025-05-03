import type { Schema } from "@/amplify/data/resource";
import { useState, useEffect } from "react";
import { generateClient } from "aws-amplify/data";
import { fetchUserAttributes } from "aws-amplify/auth";
import { redirect } from "next/navigation";

const client = generateClient<Schema>();

export const useSharedItems = () => {
  const [allListItems, setAllListItems] = useState<
    Schema["ListItem"]["type"][]
  >([]);

  function getListItems(setItems: any) {
    const listSub = client.models.ListItem.observeQuery().subscribe({
      next: ({ items, isSynced }) => {
        if (isSynced) {
          const filterItems = items.filter((item) => item.visible);
          const parsedItems = filterItems.map((item) => {
            return {
              ...item,
              members: JSON.parse(item.members as string),
              otherImages: JSON.parse(item.otherImages as string),
              removedMembers: JSON.parse(item.removedMembers as string),
            };
          });
          // console.log("parsedItems :>> ", parsedItems);

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

  async function getMyItems(setItems: any) {
    const user = await fetchUserAttributes();

    const listSub = client.models.ListItem.observeQuery().subscribe({
      next: ({ items, isSynced }) => {
        if (isSynced) {
          const filteredItems = items.filter(
            (item) => item.userSub === user?.sub && item.visible,
          );

          if (filteredItems.length === 0) {
            setItems([]);
            return;
          }

          const parsedItems = filteredItems.map((item) => {
            return {
              ...item,
              members: JSON.parse(item.members as string),
              otherImages: JSON.parse(item.otherImages as string),
              removedMembers: JSON.parse(item.removedMembers as string),
            };
          });

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

  const getSingleItem = async (id: string) => {
    try {
      const user = await fetchUserAttributes();

      const getItem = await client.models.ListItem.get({
        id: id,
      });
      if (!getItem) {
        throw new Error("Item not found");
      }
      if (getItem && getItem.data) {
        const userSub = getItem?.data.userSub;
        const userId = user?.sub;
        if (userSub !== userId) {
          throw new Error("Not authorized");
        }

        const parsedItem = {
          ...getItem.data,
          members: JSON.parse(getItem.data.members as string),
          otherImages: JSON.parse(getItem.data.otherImages as string),
          removedMembers: JSON.parse(getItem.data.removedMembers as string),
        };

        return parsedItem;
      }
    } catch (error) {
      console.error("Error fetching single item", error);
      redirect("/not-authorized");
    }
  };

  useEffect(() => {
    const listSub = client.models.ListItem.observeQuery().subscribe({
      next: ({ items, isSynced }) => {
        if (isSynced) {
          const filterItems = items.filter((item) => item.visible);

          const parsedItems = filterItems.map((item) => {
            return {
              ...item,
              members: JSON.parse(item.members as string),
              // members: item.members,
              otherImages: JSON.parse(item.otherImages as string),
              removedMembers: JSON.parse(item.removedMembers as string),
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
    getMyItems,
    getSingleItem,
  };
};
