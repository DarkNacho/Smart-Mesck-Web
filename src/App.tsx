import { Button } from "@mui/material";

function setAdmin() {
  localStorage.setItem("userRol", "Admin");
  localStorage.setItem("id", "204");
}

function setPatient() {
  localStorage.setItem("userRol", "Patient");
  localStorage.setItem("id", "4");
}

function setPractitioner() {
  localStorage.setItem("userRol", "Practitioner");
  localStorage.setItem("id", "231");
}

function App() {
  localStorage.clear();
  return (
    <>
      <Button variant="contained" color="primary" onClick={setAdmin}>
        Admin
      </Button>
      <Button variant="contained" color="primary" onClick={setPatient}>
        Patient
      </Button>
      <Button variant="contained" color="primary" onClick={setPractitioner}>
        Practitioner
      </Button>
    </>
  );
}

export default App;
