import LoginPage from "./LoginPage.tsx";
import { useState } from "react";
import { loadUserRoleFromLocalStorage } from "./RolUser.ts";
import HeaderPatientComponent from "./Components/Header/HeaderPatientComponent.tsx";
import NavBarComponent from "./Components/NavBar/NavBarComponent.tsx";

function App() {
  const [userRol, setUserRol] = useState<string | undefined>(
    loadUserRoleFromLocalStorage()
  );

  const handleLogin = (_userRol: string) => {
    setUserRol(_userRol);
  };

  const renderHeaderComponent = (_userRol: string) => {
    if (_userRol === "Admin" || _userRol === "Practitioner")
      return <NavBarComponent />;
    if (_userRol === "Patient") return <HeaderPatientComponent />;

    return <> </>;
  };

  return (
    <div>
      {userRol ? (
        renderHeaderComponent(userRol)
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
