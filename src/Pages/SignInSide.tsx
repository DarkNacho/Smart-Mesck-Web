//import * as React from "react";
import { useState } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import HandleResult from "../Components/HandleResult";
import { jwtDecode } from "jwt-decode";
import PersonForgotPasswordComponent from "../Components/Person/PersonForgotPasswordComponent";

function Copyright(props: any) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

// TODO remove, this demo shouldn't need to reset the theme.
const defaultTheme = createTheme();

async function login(username: string, password: string): Promise<Result<any>> {
  const response = await fetch(
    `${import.meta.env.VITE_SERVER_URL}/auth/token`,
    {
      method: "POST",
      headers: {
        accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body:
        "grant_type=&username=" +
        encodeURIComponent(username) +
        "&password=" +
        encodeURIComponent(password) +
        "&scope=&client_id=&client_secret=",
    }
  );
  if (response.status === 200)
    return { success: true, data: await response.json() };

  const responseText = await response.json();
  console.error(responseText);
  return { success: false, error: responseText.detail };
}

export default function SignInSide() {
  const [openDialog, setOpenDialog] = useState(false);

  const handleIsOpen = (isOpen: boolean) => {
    setOpenDialog(isOpen);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    const { rut, password } = {
      rut: data.get("rut") as string,
      password: data.get("password") as string,
    };
    if (!rut || !password) return;
    console.log({ rut, password });
    const response = await HandleResult.handleOperation(
      () => login(rut, password),
      "Sesión Iniciada",
      "Iniciando Sesión"
    );

    if (!response.success) return;

    console.log(response.data);
    localStorage.setItem("access_token", response.data.access_token);
    localStorage.setItem("token_type", response.data.token_type);
    const jwtToken = response.data.access_token;
    const decodedToken = jwtDecode(jwtToken) as { [key: string]: any };
    console.log("Decoded Token:", decodedToken);
    console.log("userRol:", decodedToken.role);
    console.log("id:", decodedToken.id);
    console.log("name:", decodedToken.name);

    localStorage.setItem("userRol", decodedToken.role);
    localStorage.setItem("id", decodedToken.id);
    localStorage.setItem("name", decodedToken.name);

    if (decodedToken.role === "Patient")
      window.location.href = `/Patient/${decodedToken.id}`;
    else window.location.href = "/Patient";
  };

  return (
    <ThemeProvider theme={defaultTheme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage:
              "url(https://source.unsplash.com/random?wallpapers)",
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar sx={{ m: 1, bgcolor: "secondary.main" }}>
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
            </Typography>
            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit}
              sx={{ mt: 1 }}
            >
              <TextField
                margin="normal"
                required
                fullWidth
                id="rut"
                label="Rut"
                name="rut"
                autoComplete="rut"
                autoFocus
              />
              <TextField
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign In
              </Button>
              <Grid container>
                <Grid item xs></Grid>
                <Grid item>
                  <Link
                    href="#"
                    variant="body2"
                    onClick={() => handleIsOpen(true)}
                  >
                    {"Forgot Password?"}
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
      <PersonForgotPasswordComponent
        onOpen={handleIsOpen}
        isOpen={openDialog}
      ></PersonForgotPasswordComponent>
    </ThemeProvider>
  );
}
