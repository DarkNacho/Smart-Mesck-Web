import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";
import PatientListPage from "./Pages/PatientListPage.tsx";
import PatientPage from "./Pages/PatientPage.tsx";
import HeaderComponent from "./Components/HeaderComponent.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>
  },
  {
    path: "/Patient",
    element: <PatientListPage></PatientListPage>
  },
  {
    path: "/Patient/:patientID",
    element: <PatientPage></PatientPage>
  },
  {
    path: "/op2",
  },
  {
    path: "/op3",
  },
  {
    path: "/op4",
  }
]);


//<HeaderComponent onTabSelected={handleSelectedTab}></HeaderComponent>
ReactDOM.createRoot(document.getElementById("root")!).render(
  <div>
    <Toaster></Toaster>
    <HeaderComponent></HeaderComponent>
    <RouterProvider router={router} ></RouterProvider>
  </div>
);

//<React.StrictMode>