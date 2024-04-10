import {
  AppBar,
  Box,
  Button,
  Dialog,
  Hidden,
  IconButton,
  Toolbar,
  useMediaQuery,
  useTheme,
} from "@mui/material";

import logo from "../../assets/smart-mesck-logo.png";
import backgroundImageSmartMesck from "../../assets/background-smart-mesck.png";
import { Close, Menu } from "@mui/icons-material";
import { useState } from "react";

const navigationItems = [
  {
    value: "Pacientes",
    to: "/Patient",
  },
  {
    value: "Mis médicos",
    to: "/MyPractitioner",
  },
  {
    value: "Encuentros",
    to: "/Encounter",
  },
  {
    value: "Médicos",
    to: "/Practitioner",
  },
];

export default function NavBarComponent() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const mappedNavigationItems = navigationItems.map((item) => {
    return (
      <Button
        key={item.to}
        color="inherit"
        size="large"
        fullWidth={isSmall}
        onClick={handleClose}
        href={item.to}
      >
        {item.value}
      </Button>
    );
  });

  return (
    <>
      <AppBar position="fixed" sx={{ background: "#2c376e" }}>
        <Toolbar>
          <Box display="flex" alignItems="center">
            <a href="/">
              <img height="54px" src={logo} alt="smart-mesck logo"></img>
            </a>
          </Box>
          <Hidden smDown>
            <Box>{mappedNavigationItems}</Box>
            <Box marginLeft="auto">Usuario aquí</Box>
          </Hidden>
          <Hidden smUp>
            <Box marginLeft="auto">
              <IconButton color="inherit" onClick={handleOpen}>
                <Menu></Menu>
              </IconButton>
            </Box>
            <Dialog
              open={open}
              fullScreen
              fullWidth
              hideBackdrop
              PaperProps={{
                sx: {
                  backgroundColor: "#7e94ff",
                  backgroundImage: `url(${backgroundImageSmartMesck})`,
                },
              }}
            >
              <AppBar position="static" sx={{ background: "#2c376e" }}>
                {/* Sobre escribe y cambia color*/}
                <Toolbar>
                  <img height="54px" src={logo} alt="smart-mesck logo"></img>
                  <Box marginLeft="auto">
                    <IconButton color="inherit" onClick={handleClose}>
                      <Close></Close>
                    </IconButton>
                  </Box>
                </Toolbar>
              </AppBar>
              <Box
                display="flex"
                flexDirection="column"
                py={3}
                px={2}
                width="100%"
              >
                {mappedNavigationItems}
              </Box>
              <Box display="flex" flexDirection="column" alignItems="center">
                <h1>Usuario aquí</h1>
                <h1>extra 1</h1>
                <h1>extra 2</h1>
              </Box>
            </Dialog>
          </Hidden>
        </Toolbar>
      </AppBar>
      <main style={{ marginTop: "64px" }}>
        {/* Contenido principal de la aplicación */}
      </main>{" "}
    </>
  );
}
