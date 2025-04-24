"use client";
import { useCloseBackdrop } from "@/hooks/backdrop";
import {
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  TextField,
} from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";
import { Icon } from "@iconify/react";
import { BackRouter } from "@/util/helpers/routers";
import { generateClient } from "aws-amplify/data";
import { type Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>();

const CreateNewItem = () => {
  useCloseBackdrop();

  /*********************************************
   * REACT HOOK FORM
   * **********************************************/
  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    // setValue,
  } = useForm({
    defaultValues: {
      name: "",
      shortDescription: "",
      longDescription: "",
      price: "",
    },
  });

  const onSubmit = async (data: any) => {
    console.log(data);

    try {
      const { data: listItems, errors } = await client.models.ListItem.create({
        name: data.name,
        description: {
          short: data.shortDescription,
          long: data.longDescription,
        },
        price: parseFloat(data.price),
      });
      console.log("ListItem created", listItems);

      if (errors) {
        console.error("ListItem errors", errors);
        return;
      }
      // Reset the form after successful submission
      reset();
    } catch (error) {
      console.error("Error creating item", error);
    }
  };

  const backRouter = BackRouter();

  return (
    <div>
      <section className="container mx-auto my-5">
        <div className="mb-3">
          <IconButton aria-label="back" onClick={backRouter}>
            <Icon
              icon="famicons:arrow-back"
              className="text-gray-900 dark:text-white"
              width={30}
              height={30}
            />
          </IconButton>
        </div>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Create Item</h1>
        </div>
        <p className="mt-2 text-gray-600">
          Provide clear details about the item you want to create. This will
          help others to understand your intent and collaborate effectively.
        </p>
        <div className="py-4">
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="max-w-screen-sm space-y-5"
          >
            {/* name */}
            <div className="">
              <Controller
                control={control}
                name="name"
                rules={{
                  required: "Name is required",
                }}
                // render={({ field }) => (
                //   <TextField
                //     {...field}
                //     label="Name"
                //     variant="outlined"
                //     fullWidth
                //     error={!!errors.name}
                //     className="bg-transparent dark:text-white"
                //     size="small"
                //   />
                // )}
                render={({ field }) => (
                  <FormControl
                    variant="outlined"
                    fullWidth
                    error={!!errors.name}
                    className="mb-2"
                  >
                    <div
                      className={`rounded-md border ${
                        errors.name
                          ? "border-red-700"
                          : "border-gray-700 focus-within:border-gray-700 hover:border-gray-700"
                      } `}
                    >
                      <TextField
                        {...field}
                        label="Name"
                        variant="filled"
                        fullWidth
                        error={!!errors.name}
                        className="bg-transparent"
                        // InputProps={{
                        //   disableUnderline: true,
                        //   className: "bg-transparent",
                        // }}
                        slotProps={{
                          input: {
                            className: "bg-transparent ",
                            disableUnderline: true,
                          },
                        }}
                        size="small"
                      />
                    </div>
                    <FormHelperText error>
                      {errors.name?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </div>
            {/* price */}
            <div className="">
              <Controller
                control={control}
                name="price"
                rules={{
                  required: "Price is required",
                }}
                render={({ field }) => (
                  <FormControl
                    variant="outlined"
                    fullWidth
                    error={!!errors.price}
                    className="mb-2"
                  >
                    <div
                      className={`rounded-md border ${
                        errors.price
                          ? "border-red-700"
                          : "border-gray-700 focus-within:border-gray-700 hover:border-gray-700"
                      } `}
                    >
                      <TextField
                        {...field}
                        label="Price"
                        variant="filled"
                        fullWidth
                        error={!!errors.price}
                        className="bg-transparent"
                        slotProps={{
                          input: {
                            className: "bg-transparent ",
                            disableUnderline: true,
                          },
                        }}
                        size="small"
                      />
                    </div>
                    <FormHelperText error>
                      {errors.price?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </div>
            {/* short description */}
            <div className="">
              <Controller
                control={control}
                name="shortDescription"
                rules={{
                  required: "Short description is required",
                }}
                render={({ field }) => (
                  <FormControl
                    variant="outlined"
                    fullWidth
                    error={!!errors.shortDescription}
                    className="mb-2"
                  >
                    <div
                      className={`rounded-md border ${
                        errors.shortDescription
                          ? "border-red-700"
                          : "border-gray-700 focus-within:border-gray-700 hover:border-gray-700"
                      } `}
                    >
                      <TextField
                        {...field}
                        label="Short Description"
                        variant="filled"
                        fullWidth
                        error={!!errors.shortDescription}
                        className="bg-transparent"
                        slotProps={{
                          input: {
                            className: "bg-transparent ",
                            disableUnderline: true,
                          },
                        }}
                        size="small"
                      />
                    </div>
                    <FormHelperText error>
                      {errors.shortDescription?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </div>
            {/* long description */}
            <div className="">
              <Controller
                control={control}
                name="longDescription"
                rules={{
                  required: "Long description is required",
                }}
                render={({ field }) => (
                  <FormControl
                    variant="outlined"
                    fullWidth
                    error={!!errors.longDescription}
                    className="mb-2"
                  >
                    <div
                      className={`rounded-md border ${
                        errors.longDescription
                          ? "border-red-700"
                          : "border-gray-700 focus-within:border-gray-700 hover:border-gray-700"
                      } `}
                    >
                      <TextField
                        {...field}
                        multiline
                        rows={4}
                        label="Long Description"
                        variant="filled"
                        fullWidth
                        error={!!errors.longDescription}
                        className="bg-transparent"
                        slotProps={{
                          input: {
                            className: "bg-transparent ",
                            disableUnderline: true,
                          },
                        }}
                        size="small"
                      />
                    </div>
                    <FormHelperText error>
                      {errors.longDescription?.message}
                    </FormHelperText>
                  </FormControl>
                )}
              />
            </div>
            {/* submit button */}
            <div className="flex items-center justify-end">
              <Button
                variant="contained"
                color="primary"
                className="font-poppins rounded-xl normal-case"
                type="submit"
              >
                Create Item
              </Button>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default CreateNewItem;
