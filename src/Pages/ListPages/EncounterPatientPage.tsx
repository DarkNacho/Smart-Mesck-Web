import ObservationService from "../../Services/ObservationService";
import InfoListComponent, {
  InfoListData,
} from "../../Components/InfoListComponent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ConditionService from "../../Services/ConditionService";
import PatientQuestionnaireComponent from "../../Components/Patient/PatientQuestionnaireComponent";

export default function EncounterPatientPage() {
  const observationService = new ObservationService();
  const conditionService = new ConditionService();

  const { patientID } = useParams();
  const { encounterID } = useParams();

  const [obvservationData, setObvservationData] = useState<InfoListData[]>([]);

  const [conditionData, setConditionData] = useState<InfoListData[]>([]);

  const fetchData = async () => {
    const result = await observationService.getResources({
      subject: patientID!,
      encounter: encounterID!,
    });

    console.log("patientID ", patientID);
    console.log("encounterID ", encounterID);
    if (result.success) {
      setObvservationData(
        observationService.extractObservationInfo(result.data)
      );
      console.log("observation:", result.data);
    }

    const resultCon = await conditionService.getResources({
      subject: patientID!,
      encounter: encounterID!,
    });
    if (resultCon.success) {
      console.log("conditions: ", resultCon.data);
      setConditionData(conditionService.extractConditionName(resultCon.data));
      //console.log(conditionService.extractConditionName(resultCon.data));
    }
  };

  useEffect(() => {
    setObvservationData([]);
    fetchData();
  }, [patientID]);

  return (
    <div style={{ padding: "50px" }}>
      <div style={{ paddingBottom: "30px" }}>
        <h1>info encountro</h1>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
        <div style={{ flex: 1 }}>
          <InfoListComponent
            data={obvservationData}
            title={"Observaciones"}
            icon={"/hearth.svg"}
            resourceType="Observation"
            patientId={patientID}
          ></InfoListComponent>
        </div>
        <div style={{ flex: 1 }}>
          <InfoListComponent
            data={conditionData}
            title={"Condiciones"}
            icon={"/inercial.svg"}
            resourceType="Condition"
          ></InfoListComponent>
        </div>
        <div style={{ flex: 1 }}>
          <InfoListComponent
            data={[]}
            title={"Medicamentos"}
            icon={"/medication.svg"}
            resourceType="Medica"
          ></InfoListComponent>
        </div>
      </div>
      <div>
        <PatientQuestionnaireComponent
          patientID={patientID!}
          encounterID={encounterID!}
        ></PatientQuestionnaireComponent>
      </div>
    </div>
  );
}
