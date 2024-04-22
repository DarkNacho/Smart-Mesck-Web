import { Button } from "@mui/material";
import { jwtDecode } from "jwt-decode";

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

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    console.log("Username:", username);
    console.log("Password:", password);

    fetch("http://localhost:8000/auth/token", {
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
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("access_token", data.access_token);
        localStorage.setItem("token_type", data.token_type);
        const jwtToken = data.access_token;
        const decodedToken = jwtDecode(jwtToken) as { [key: string]: any };
        console.log("Decoded Token:", decodedToken);
        console.log("userRol:", decodedToken.role);
        console.log("id:", decodedToken.id);

        localStorage.setItem("userRol", decodedToken.role);
        localStorage.setItem("id", decodedToken.id);

        if (decodedToken.role === "Patient")
          window.location.href = `/Patient/${decodedToken.id}`;
        else window.location.href = "/Patient";
        // Continue with your logic using the decoded token
      })
      .catch((error) => {
        console.error("Error:", error);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // Perform login logic here
  };

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

      <form onSubmit={handleLogin}>
        <input name="username" type="text" placeholder="Username" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </>
  );
}

export default LoginPage;
