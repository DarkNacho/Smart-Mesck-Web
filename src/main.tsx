import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Toaster } from "react-hot-toast";
import PatientPage from "./Pages/PatientPage.tsx";
import EncounterListPage from "./Pages/ListPages/EncounterListPage.tsx";
import EncounterPatientPage from "./Pages/EncounterPatientPage.tsx";
import ObservationPage from "./Pages/ObservationPage.tsx";
import PatientListPage from "./Pages/ListPages/PatientListPage.tsx";
import PractitionerListPage from "./Pages/ListPages/PractitionerListPage.tsx";
import PatientMyPractitionerListPage from "./Pages/ListPages/PatientMyPractitionerListPage.tsx";
import NavBarComponent from "./Components/NavBar/NavBarComponent.tsx";
import SensorChartDashboardPage from "./Pages/SensorChartDashboardPage.tsx";
import SensorChartDashboardPage2 from "./Pages/SensorChartDashboardPage2.tsx";
import { loadUserRoleFromLocalStorage } from "./RolUser.ts";

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
    path: "/MyPractitioner",
    element: <PatientMyPractitionerListPage></PatientMyPractitionerListPage>,
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
    element: <ObservationPage></ObservationPage>,
  },
  {
    path: "/Encounter",
    element: <EncounterListPage></EncounterListPage>,
  },
  {
    path: "/Encounter/:encounterID",
    element: <EncounterPatientPage></EncounterPatientPage>,
  },
  {
    path: "/Practitioner",
    element: <PractitionerListPage></PractitionerListPage>,
  },
  {
    path: "/SensorChartDashboard",
    element: <SensorChartDashboardPage></SensorChartDashboardPage>,
  },
  {
    path: "/SensorChartDashboard2",
    element: <SensorChartDashboardPage2></SensorChartDashboardPage2>,
  },
]);

//<HeaderComponent onTabSelected={handleSelectedTab}></HeaderComponent>
ReactDOM.createRoot(document.getElementById("root")!).render(
  <div>
    {loadUserRoleFromLocalStorage() && <NavBarComponent></NavBarComponent>}

    <Toaster></Toaster>
    <RouterProvider router={router}></RouterProvider>
  </div>
);

//<React.StrictMode>
