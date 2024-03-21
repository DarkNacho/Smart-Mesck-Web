import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import PatientListPage from "./Pages/PatientListPage.tsx";
import PatientPage from "./Pages/PatientPage.tsx";
import HeaderComponent from "./Components/HeaderComponent.tsx";
import EncounterListPage from "./Pages/EncounterListPage.tsx";
import EncounterPatientPage from "./Pages/EncounterPatientPage.tsx";
import ObservationPage from "./Pages/ObservationPage.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App></App>,
  },
  {
    path: "/Patient",
    element: <PatientListPage></PatientListPage>,
  },
  {
    path: "/Patient/:patientID",
    element: <PatientPage></PatientPage>,
  },
  {
    path: "/Patient/:patientID/Encounter/:encounterID",
    element: <EncounterPatientPage></EncounterPatientPage>,
  },
  {
    path: "/Patient/:patientID/Observation/:observationID",
    element: <ObservationPage></ObservationPage>,
  },
  {
    path: "/Patient/:patientID/Encounter/:encounterID/Observation/:observationID",
    element: <ObservationPage></ObservationPage>
  },
  {
    path: "/Encounter",
    element: <EncounterListPage></EncounterListPage>,
  },
  {
    path: "/op4",
  },
]);

//<HeaderComponent onTabSelected={handleSelectedTab}></HeaderComponent>
ReactDOM.createRoot(document.getElementById("root")!).render(
  <div>
    <Toaster></Toaster>
    <HeaderComponent></HeaderComponent>
    <RouterProvider router={router}></RouterProvider>
  </div>
);

//<React.StrictMode>
