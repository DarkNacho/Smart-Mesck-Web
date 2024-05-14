import LoginPage from "./Pages/LoginPage.tsx";
import { useEffect, useState } from "react";
import { loadUserRoleFromLocalStorage } from "./RolUser.ts";
import NavBarComponent from "./Components/NavBar/NavBarComponent.tsx";
import { useLocation } from "react-router-dom";
import PersonConfirmPasswordComponent from "./Components/Person/PersonConfirmPasswordComponent.tsx";

function App() {
  const [userRol] = useState<string | undefined>(
    loadUserRoleFromLocalStorage()
  );

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const token = queryParams.get("token");

  const [openDialog, setOpenDialog] = useState(false);

  useEffect(() => {
    console.log("token:", token);
    setOpenDialog(Boolean(token));
  }, [token]);

  const handleIsOpen = (isOpen: boolean) => {
    setOpenDialog(isOpen);
  };

  return (
    <div>
      {userRol ? <NavBarComponent></NavBarComponent> : <LoginPage />}

      <PersonConfirmPasswordComponent
        onOpen={handleIsOpen}
        isOpen={openDialog}
        token={token!}
      ></PersonConfirmPasswordComponent>
    </div>
  );
}

export default App;
