import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
  useNavigate,
} from "react-router-dom";

import PatientListPage from "./Pages/PatientListPage.tsx";
import PatientPage from "./Pages/PatientPage.tsx";
import QuestionnaireListComponent from "./Components/Questionnaire/QuestionnaireListDialogComponent.tsx";
import PatientCreateComponent from "./Components/Patient/PatientCreateComponent.tsx";
import HeaderComponent from "./Components/HeaderComponent.tsx";
import ResponsiveAppBar from "./Components/NavBar.tsx";

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
    path: "/add",
    element: <PatientCreateComponent></PatientCreateComponent>
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

const handleSelectedTab = (tab: string) =>
{
  console.log(tab);
}
//<HeaderComponent onTabSelected={handleSelectedTab}></HeaderComponent>
ReactDOM.createRoot(document.getElementById("root")!).render(
  <div>
    <HeaderComponent></HeaderComponent>
    <RouterProvider router={router}></RouterProvider>
  </div>
);

//<React.StrictMode>