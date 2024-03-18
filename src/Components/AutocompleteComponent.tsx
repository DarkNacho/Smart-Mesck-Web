import React, { useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";

// Definir la interfaz Condition
interface Condition {
  code: string;
  system: string;
  display: string;
}

interface AutocompleteComponentProps {
  name: string;
  table: string;
  searchArguments: string;
}

// Componente AutocompleteComponent
const AutocompleteComponent: React.FC<AutocompleteComponentProps> = ({
  name,
  table,
  searchArguments,
}) => {
  const [conditions, setConditions] = useState<Condition[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (searchTerm: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://clinicaltables.nlm.nih.gov/api/${table}/v3/search?${searchArguments}&terms=${searchTerm}&maxList=10`
      );
      const data = await response.json();
      console.log("data: ", data);

      // Manejar la respuesta y extraer las condiciones
      const total: number = data[0];
      //const conditionsData: any[] = data[3];
      const conditionsData: any[] = data[3].map((item: any) => item.join());
      const code: any[] = data[1];

      if (conditionsData.length !== code.length)
        throw new Error("problema de obtención de datos");

      const newConditions: Condition[] = conditionsData.map(
        (conditionData, index) => ({
          code: code[index],
          system: "systema de prueba",
          display: conditionData,
        })
      );

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
        <TextField {...params} label={name} variant="outlined" />
      )}
    />
  );
};

export default AutocompleteComponent;
