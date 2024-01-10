import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";

import PatientListPage from "./Pages/PatientListPage.tsx";
import PatientPage from "./Pages/PatientPage.tsx";
import QuestionnaireListComponent from "./Components/Questionnaire/QuestionnaireListComponent.tsx";


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
    path: "/ques",
    element: <QuestionnaireListComponent></QuestionnaireListComponent>
  }
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <h1>Header aqui</h1>
    <RouterProvider router={router}></RouterProvider>
  </React.StrictMode>
);
