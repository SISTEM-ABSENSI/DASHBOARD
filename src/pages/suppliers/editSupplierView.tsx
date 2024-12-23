import { useEffect, useState } from "react";
import {
  Button,
  Card,
  Typography,
  Box,
  TextField,
  Stack,
  Grid,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { useHttp } from "../../hooks/http";
import { IUserUpdateRequestModel } from "../../models/userModel";
import { IconMenus } from "../../components/icon";
import BreadCrumberStyle from "../../components/breadcrumb/Index";

export default function EditSupplierView() {
  const { handleUpdateRequest, handleGetRequest } = useHttp();
  const { userId } = useParams();

  const [userContact, setUserContact] = useState("");
  const [userName, setUserName] = useState("");
  const [userPassword, setUserPassword] = useState("");

  const handleSubmit = async () => {
    try {
      const payload: IUserUpdateRequestModel = {
        userId: userId!,
        userName,
        userContact,
        userPassword,
        userRole: "supplier",
      };

      await handleUpdateRequest({
        path: "/users",
        body: payload,
      });

      window.history.back();
    } catch (error: unknown) {
      console.log(error);
    }
  };

  const getDetailUser = async () => {
    const result = await handleGetRequest({
      path: "/users/detail/" + userId,
    });

    console.log(result);
    if (result) {
      setUserContact(result?.userContact || "");
      setUserName(result?.userName);
    }
  };

  useEffect(() => {
    getDetailUser();
  }, []);

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
            label: "Edit",
            link: "/suppliers/edit/" + userId,
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
          Edit Supplier
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
                onChange={(e) => setUserName(e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Kontak"
                id="outlined-start-adornment"
                sx={{ m: 1 }}
                value={userContact}
                type="text"
                fullWidth
                onChange={(e) => setUserContact(e.target.value)}
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
                onChange={(e) => setUserPassword(e.target.value)}
              />
            </Grid>
          </Grid>
          <Stack direction="row" justifyContent="flex-end">
            <Button
              sx={{
                m: 1,
                width: "25ch",
                backgroundColor: "dodgerblue",
                color: "#FFF",
                fontWeight: "bold",
              }}
              variant="contained"
              onClick={handleSubmit}
            >
              Submit
            </Button>
          </Stack>
        </Box>
      </Card>
    </>
  );
}
