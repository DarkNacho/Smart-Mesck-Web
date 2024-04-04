import { useNavigate } from "react-router-dom";
import { Button } from "@mui/material";

function setAdmin(navigate: any) {
  localStorage.setItem("userRol", "Admin");
  localStorage.setItem("id", "204");
  navigate("/Patient");
}

function setPatient(navigate: any) {
  localStorage.setItem("userRol", "Patient");
  localStorage.setItem("id", "4");
  navigate("/Patient/4");
}

function setPractitioner(navigate: any) {
  localStorage.setItem("userRol", "Practitioner");
  localStorage.setItem("id", "231");
  navigate("/Patient");
}

function App() {
  const navigate = useNavigate();
  localStorage.clear();

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setAdmin(navigate)}
      >
        Admin
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setPatient(navigate)}
      >
        Patient
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setPractitioner(navigate)}
      >
        Practitioner
      </Button>
    </>
  );
}

export default App;
