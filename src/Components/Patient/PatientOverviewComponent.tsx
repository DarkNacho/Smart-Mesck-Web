import { MedicationStatement, Patient } from "fhir/r4";
import PatientGeneralWidgetComponent from "./PatientGeneralWidgetComponent";
import ObservationService from "../../Services/ObservationService";
import InfoListComponent, { InfoListData } from "../InfoListComponent";
import { useEffect, useState } from "react";
import ConditionService from "../../Services/ConditionService";
import ConditionUtils from "../../Services/Utils/ConditionUtils";
import ObservationUtils from "../../Services/Utils/ObservationUtils";
import FhirResourceService from "../../Services/FhirService";
import MedicationUtils from "../../Services/Utils/MedicationUtils";
import HandleResult from "../HandleResult";

export default function PatientOverviewComponent({
  patient,
}: {
  patient: Patient;
}) {
  const observationService = new ObservationService();
  const conditionService = new ConditionService();
  const medicationService = new FhirResourceService("MedicationStatement");

  const [observationData, setObservationData] = useState<InfoListData[]>([]);
  const [conditionData, setConditionData] = useState<InfoListData[]>([]);
  const [medication, setMedicationData] = useState<InfoListData[]>([]);

  const fetchObservationData = async () => {
    const result = await HandleResult.handleOperation(
      () =>
        observationService.getResources({
          subject: patient.id!,
        }),
      "Observaciones Obtenidas.",
      "Obteniendo Observaciones..."
    );
    //const result = await observationService.getResources({
    //  subject: patient.id!,
    //});

    if (result.success) {
      setObservationData(ObservationUtils.extractObservationInfo(result.data));
      console.log(result.data);
    }
  };

  const fetchConditionData = async () => {
    //const result = await conditionService.getResources({
    //  subject: patient.id!,
    //});

    const result = await HandleResult.handleOperation(
      () =>
        conditionService.getResources({
          subject: patient.id!,
        }),
      "Condiciones Obtenidas.",
      "Obteniendo Condiciones..."
    );

    if (result.success) {
      setConditionData(ConditionUtils.extractConditionNames(result.data));
      console.log(result.data);
    }
  };

  const fetchMedicationData = async () => {
    //const result = await medicationService.getResources({
    //  subject: patient.id!,
    //});

    const result = await HandleResult.handleOperation(
      () =>
        medicationService.getResources({
          subject: patient.id!,
        }),
      "Medicamentos Obtenidos.",
      "Obteniendo Medicamentos..."
    );

    if (result.success) {
      setMedicationData(
        MedicationUtils.extractMedicationInfo(
          result.data as MedicationStatement[]
        )
      );
      //setConditionData(conditionService.extractConditionName(result.data));
      console.log("medication");
      console.log(result.data);
    }
  };

  useEffect(() => {
    setObservationData([]);
    setConditionData([]);
    setMedicationData([]);

    fetchObservationData();
    fetchConditionData();
    fetchMedicationData();
  }, [patient.id]);

  return (
    <div style={{ padding: "50px" }}>
      <div style={{ paddingBottom: "30px" }}>
        <PatientGeneralWidgetComponent
          patient={patient}
        ></PatientGeneralWidgetComponent>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
        <div style={{ flex: 1 }}>
          <InfoListComponent
            data={observationData}
            title={"Observaciones"}
            icon={"/hearth.svg"}
            resourceType="Observation"
            patientId={patient.id!}
          ></InfoListComponent>
        </div>
        <div style={{ flex: 1 }}>
          <InfoListComponent
            data={conditionData}
            title={"Condiciones"}
            icon={"/inercial.svg"}
            resourceType="Condition"
            patientId={patient.id!}
          ></InfoListComponent>
        </div>
        <div style={{ flex: 1 }}>
          <InfoListComponent
            data={medication}
            title={"Medicamentos"}
            icon={"/medication.svg"}
            resourceType="MedicationStatement"
            patientId={patient.id!}
          ></InfoListComponent>
        </div>
      </div>
    </div>
  );
}
