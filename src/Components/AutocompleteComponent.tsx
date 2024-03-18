import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// Definir la interfaz Condition
interface Condition {
  code: string;
  system: string;
  display: string;
}

// Componente AutocompleteComponent
const AutocompleteComponent: React.FC = () => {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (searchTerm: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://clinicaltables.nlm.nih.gov/api/icd9cm_dx/v3/search?df=code_dotted,long_name&terms=${searchTerm}&maxList=10`
      );
      const data = await response.json();
      console.log("data: ", data);

      // Manejar la respuesta y extraer las condiciones
      const total: number = data[0];
      console.log("total: ", total);
      const conditionsData: any[] = data[3];
      const code: any[] = data[1];

      console.log("conditionsData: ", conditionsData);
      console.log("codeCondition: ", code);

      if (conditionsData.length != code.length)
        throw new Error("problama de obtención de datos");

      var newConditions: Condition[] = new Array(conditionsData.length);

      for (let i = 0; i < newConditions.length; ++i) {
        newConditions[i] = {
          code: code[i],
          system: "systema de prueba",
          display: conditionsData[i][1],
        };
      }

      setConditions(newConditions);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCondition = (condition: Condition | null) => {
    if (condition) {
      console.log("Condition selected:", condition);
    }
  };

  return (
    <Autocomplete
      options={conditions}
      loading={loading}
      getOptionLabel={(option) => option.display}
      onChange={(event, value) => handleSelectCondition(value)}
      onInputChange={(event, value) => fetchData(value)}
      renderInput={(params) => (
        <TextField {...params} label="Conditions" variant="outlined" />
      )}
    />
  );
};

export default AutocompleteComponent;
