import LoginPage from "./LoginPage.tsx";
import { useState } from "react";
import { loadUserRoleFromLocalStorage } from "./RolUser.ts";
import NavBarComponent from "./Components/NavBar/NavBarComponent.tsx";

function App() {
  const [userRol, setUserRol] = useState<string | undefined>(
    loadUserRoleFromLocalStorage()
  );

  const handleLogin = (_userRol: string) => {
    setUserRol(_userRol);
  };

  return (
    <div>
      {userRol ? (
        <NavBarComponent></NavBarComponent>
      ) : (
        <LoginPage onLogin={handleLogin} />
      )}
    </div>
  );
}

export default App;
