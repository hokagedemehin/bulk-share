import {
  Button,
  ButtonProps,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import React from "react";
import { Icon } from "@iconify/react";

const CustomDialog = ({
  title,
  message,
  buttonText = "Delete",
  buttonColor = "error",
  openDialog,
  handleCloseDialog,
  selectedItem,
  handleAction,
}: {
  title: string;
  message: string;
  buttonText?: string;
  buttonColor?: ButtonProps["color"];
  openDialog: boolean;
  handleCloseDialog: () => void;
  selectedItem: any;
  handleAction: (item: any) => void;
}) => {
  return (
    <Dialog
      open={openDialog}
      onClose={handleCloseDialog}
      maxWidth="sm"
      fullWidth
      slotProps={{
        paper: {
          style: {
            borderRadius: 20,
          },
        },
      }}
      aria-labelledby="delete-dialog-title"
      aria-describedby="delete-dialog-description"
    >
      <div className="flex items-center justify-between px-2">
        <DialogTitle className="font-poppins text-xl font-bold">
          {title}
        </DialogTitle>
        <IconButton className="" onClick={handleCloseDialog}>
          <Icon
            className="text-red-600"
            icon="material-symbols:close-rounded"
            width={20}
            height={20}
          />
        </IconButton>
      </div>
      <DialogContent>
        <div className="">
          <p className="text-gray-600 dark:text-gray-200">{message}</p>
        </div>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={handleCloseDialog}
          color="primary"
          className="font-poppins rounded-xl normal-case"
        >
          Cancel
        </Button>
        <Button
          onClick={() => handleAction(selectedItem)}
          color={buttonColor}
          className="font-poppins rounded-xl normal-case"
        >
          {buttonText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default CustomDialog;
