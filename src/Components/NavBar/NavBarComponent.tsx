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
  Menu,
  MenuItem,
} from "@mui/material";

import logo from "../../assets/smart-mesck-logo.png";
import backgroundImageSmartMesck from "../../assets/background-smart-mesck.png";
import { Close, Menu as MenuIcon } from "@mui/icons-material";
import { useState } from "react";
import { loadUserRoleFromLocalStorage } from "../../RolUser";

const navigationAdminItems = [
  {
    value: "Pacientes",
    to: "/Patient",
  },
  {
    value: "Profesionales",
    to: "/Practitioner",
  },
  {
    value: "Encuentros",
    to: "/Encounter",
  },
  {
    value: "Sensores",
    to: "/SensorChartDashboard",
  },
];

const navigationPractitionerItems = [
  {
    value: "Mis Pacientes",
    to: "/Patient",
  },
  {
    value: "Mis Encuentros",
    to: "/Encounter",
  },
  {
    value: "Sensores",
    to: "/SensorChartDashboard",
  },
];

const navigationPatientItems = [
  {
    value: "Mi Perfil",
    to: `/Patient/${localStorage.getItem("id")!}`,
  },
  {
    value: "Mis Encuentros",
    to: "/Encounter",
  },
  {
    value: "Mis Profesionales",
    to: "/MyPractitioner",
  },
  {
    value: "Todos los  Profesionales",
    to: "/Practitioner",
  },
];

const getNavigationItems = () => {
  const role = loadUserRoleFromLocalStorage();
  if (role === "Admin") {
    return navigationAdminItems;
  } else if (role === "Practitioner") {
    return navigationPractitionerItems;
  } else if (role === "Patient") {
    return navigationPatientItems;
  }
  return [];
};

const userName = localStorage.getItem("name");

export default function NavBarComponent() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const handleClickAnchor = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAnchor = () => {
    setAnchorEl(null);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLogOut = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const mappedNavigationItems = getNavigationItems().map((item) => {
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
            <Box marginLeft="auto"></Box>
            <Button variant="text" onClick={handleClickAnchor}>
              {userName}
            </Button>
            <Menu
              anchorEl={anchorEl}
              keepMounted
              open={Boolean(anchorEl)}
              onClose={handleCloseAnchor}
            >
              <MenuItem onClick={() => alert("abrir perfil aquí")}>
                Mi Perfil
              </MenuItem>
              <MenuItem onClick={handleLogOut}>Cerrar Sesión</MenuItem>
            </Menu>
          </Hidden>
          <Hidden smUp>
            <Box marginLeft="auto">
              <IconButton color="inherit" onClick={handleOpen}>
                <MenuIcon></MenuIcon>
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
                  <a href="/">
                    <img height="54px" src={logo} alt="smart-mesck logo"></img>
                  </a>
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
                <h1>{userName}</h1>
                <h1>extra 1</h1>
                <h1>extra 2</h1>
                <Button variant="contained" onClick={handleLogOut}>
                  Cerrar Sesión
                </Button>
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
