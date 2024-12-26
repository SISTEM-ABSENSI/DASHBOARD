import { useState } from "react";
import {
  Button,
  Card,
  Typography,
  Box,
  TextField,
  Stack,
  Grid,
} from "@mui/material";

import { useHttp } from "../../hooks/http";
import BreadCrumberStyle from "../../components/breadcrumb/Index";
import { IconMenus } from "../../components/icon";
import { IUserCreateRequestModel } from "../../models/userModel";

export default function CreateSupplierView() {
  const { handlePostRequest } = useHttp();

  const [userContact, setUserContact] = useState("");
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const payload: IUserCreateRequestModel = {
        userName,
        userContact,
        userPassword,
        userRole: "supplier",
      };

      await handlePostRequest({
        path: "/users/register",
        body: payload,
      });
      window.history.back();
    } catch (error: unknown) {
      console.log(error);
    }
  };

  return (
    <>
      <BreadCrumberStyle
        navigation={[
          {
            label: "Supplier",
            link: "/suppliers",
            icon: <IconMenus.supplier fontSize="small" />,
          },
          {
            label: "Create",
            link: "/suppliers/create",
          },
        ]}
      />
      <Card
        sx={{
          mt: 5,
          p: { xs: 3, md: 5 },
        }}
      >
        <Typography
          variant="h4"
          marginBottom={5}
          color="primary"
          fontWeight={"bold"}
        >
          Tambah Supplier
        </Typography>
        <Box
          component="form"
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nama"
                id="outlined-start-adornment"
                sx={{ m: 1 }}
                value={userName}
                type="text"
                fullWidth
                onChange={(e) => {
                  setUserName(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Kontak"
                id="outlined-start-adornment"
                sx={{ m: 1 }}
                type="text"
                value={userContact}
                fullWidth
                onChange={(e) => {
                  setUserContact(e.target.value);
                }}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <TextField
                label="Password"
                id="outlined-start-adornment"
                sx={{ m: 1 }}
                value={userPassword}
                type="password"
                fullWidth
                onChange={(e) => {
                  setUserPassword(e.target.value);
                }}
              />
            </Grid>
          </Grid>
          <Stack direction={"row"} justifyContent="flex-end">
            <Button variant={"contained"} onClick={handleSubmit}>
              Submit
            </Button>
          </Stack>
        </Box>
      </Card>
    </>
  );
}
