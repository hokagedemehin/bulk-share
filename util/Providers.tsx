"use client";
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ThemeProvider } from "@mui/material/styles";
import { StyledEngineProvider } from "@mui/material/styles";
import { Provider as ReduxProvider } from "react-redux";
import { SnackbarProvider, closeSnackbar } from "notistack";
import { IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { store } from "@/util/store/store";
import theme from "../theme";

const ProjectProviders = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <div>
      <ReduxProvider store={store}>
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <SnackbarProvider
                autoHideDuration={5000}
                maxSnack={5}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                action={(snackbarId) => (
                  <IconButton onClick={() => closeSnackbar(snackbarId)}>
                    <CloseIcon className="text-white" />
                  </IconButton>
                )}
              >
                {children}
              </SnackbarProvider>
            </LocalizationProvider>
          </ThemeProvider>
        </StyledEngineProvider>
      </ReduxProvider>
    </div>
  );
};

export default ProjectProviders;
