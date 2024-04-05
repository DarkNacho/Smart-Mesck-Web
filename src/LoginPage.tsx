import { Button } from "@mui/material";

function setAdmin(onLogin: (userRol: string) => void) {
  localStorage.setItem("userRol", "Admin");
  localStorage.setItem("id", "231");
  onLogin("Admin");
}

function setPatient(onLogin: (userRol: string) => void) {
  localStorage.setItem("userRol", "Patient");
  localStorage.setItem("id", "4");
  onLogin("Patient");
}

function setPractitioner(onLogin: (userRol: string) => void) {
  localStorage.setItem("userRol", "Practitioner");
  localStorage.setItem("id", "231");
  onLogin("Practitioner");
}

function LoginPage({ onLogin }: { onLogin: (userRol: string) => void }) {
  localStorage.clear();

  return (
    <>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setAdmin(onLogin)}
        href="/Patient"
      >
        Admin
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setPatient(onLogin)}
        href="/Patient/4"
      >
        Patient
      </Button>
      <Button
        variant="contained"
        color="primary"
        onClick={() => setPractitioner(onLogin)}
        href="/Patient"
      >
        Practitioner
      </Button>
    </>
  );
}

export default LoginPage;
