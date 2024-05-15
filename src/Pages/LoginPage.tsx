import { jwtDecode } from "jwt-decode";
import HandleResult from "../Components/HandleResult";
import { Stack } from "@mui/material";

function LoginPage() {
  localStorage.clear();

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    console.log("Username:", username);
    console.log("Password:", password);

    const response = await HandleResult.handleOperation(
      () => login(username, password),
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
    // Continue with your logic using the decoded token
  };

  const login = async (
    username: string,
    password: string
  ): Promise<Result<any>> => {
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
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <Stack spacing={2}>
          <input name="username" type="text" placeholder="Username" />
          <input name="password" type="password" placeholder="Password" />
          <a>Recuperar Contraseña</a>
          <button type="submit">Login</button>
        </Stack>
      </form>
    </>
  );
}

export default LoginPage;
