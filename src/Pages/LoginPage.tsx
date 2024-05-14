import { jwtDecode } from "jwt-decode";

function LoginPage() {
  localStorage.clear();

  const handleLogin = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const username = formData.get("username") as string;
    const password = formData.get("password") as string;
    console.log("Username:", username);
    console.log("Password:", password);

    fetch(`${import.meta.env.VITE_SERVER_URL}/auth/token`, {
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
        console.log("name:", decodedToken.name);

        localStorage.setItem("userRol", decodedToken.role);
        localStorage.setItem("id", decodedToken.id);
        localStorage.setItem("name", decodedToken.name);

        if (decodedToken.role === "Patient")
          window.location.href = `/Patient/${decodedToken.id}`;
        else window.location.href = "/Patient";
        // Continue with your logic using the decoded token
      })
      .catch((error) => {
        console.error("Error:", error);
      });
    // Perform login logic here
  };

  return (
    <>
      <form onSubmit={handleLogin}>
        <input name="username" type="text" placeholder="Username" />
        <input name="password" type="password" placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </>
  );
}

export default LoginPage;
