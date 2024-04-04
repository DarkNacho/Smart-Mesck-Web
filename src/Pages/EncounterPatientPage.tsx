import ObservationService from "../Services/ObservationService";
import InfoListComponent, {
  InfoListData,
} from "../Components/InfoListComponent";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import ConditionService from "../Services/ConditionService";
import PatientQuestionnaireComponent from "../Components/Patient/PatientQuestionnaireComponent";

import ObservationUtil from "../Services/Utils/ObservationUtils";
import ConditionUtils from "../Services/Utils/ConditionUtils";

const observationService = new ObservationService();
const conditionService = new ConditionService();

export default function EncounterPatientPage() {
  const { patientID } = useParams();
  const { encounterID } = useParams();

  const [observationData, setObservationData] = useState<InfoListData[]>([]);

  const [conditionData, setConditionData] = useState<InfoListData[]>([]);

  const fetchData = async () => {
    const result = await observationService.getResources({
      subject: patientID!,
      encounter: encounterID!,
    });

    console.log("patientID ", patientID);
    console.log("encounterID ", encounterID);
    if (result.success) {
      setObservationData(ObservationUtil.extractObservationInfo(result.data));
      console.log("observation:", result.data);
    }

    const resultCon = await conditionService.getResources({
      subject: patientID!,
      encounter: encounterID!,
    });
    if (resultCon.success) {
      console.log("conditions: ", resultCon.data);
      setConditionData(ConditionUtils.extractConditionName(resultCon.data));
      //console.log(conditionService.extractConditionName(resultCon.data));
    }
  };

  useEffect(() => {
    setObservationData([]);
    fetchData();
  }, [patientID]);

  return (
    <div style={{ padding: "50px" }}>
      <div style={{ paddingBottom: "30px" }}>
        <h1>info encuentro</h1>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "30px" }}>
        <div style={{ flex: 1 }}>
          <InfoListComponent
            data={observationData}
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