"use client";
import { useCloseBackdrop } from "@/hooks/backdrop";
import { FormControl, FormHelperText, TextField } from "@mui/material";
import React from "react";
import { Controller, useForm } from "react-hook-form";

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
    reset();
  };

  return (
    <div>
      <section className="container mx-auto my-5">
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
                        label="First name"
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
          </form>
        </div>
      </section>
    </div>
  );
};

export default CreateNewItem;
