import React, { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { ValueSet, ValueSetExpansionContains } from "fhir/r4";

interface AutocompleteComponentProps {
  name: string;
  table: string;
}

// Componente AutocompleteComponent
const AutocompleteComponent: React.FC<AutocompleteComponentProps> = ({
  name,
  table,
}) => {
  const [dataSet, setDataSet] = useState<ValueSetExpansionContains[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchData = async (searchTerm: string) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://clinicaltables.nlm.nih.gov/fhir/R4/ValueSet/${table}/$expand?_format=json&count=10&filter=${searchTerm}`
      );
      const result = (await response.json()) as ValueSet;
      console.log(result);
      const data = result.expansion?.contains || [];
      //console.log("conditions as dataset: ", data);
      setDataSet(data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectCondition = (
    condition: ValueSetExpansionContains | null
  ) => {
    if (condition) {
      console.log("selected:", condition);
    }
  };

  useEffect(() => {
    fetchData("");
  }, []);

  return (
    <Autocomplete
      options={dataSet}
      loading={loading}
      getOptionLabel={(option) => option.display!}
      onChange={(_, value) => handleSelectCondition(value)}
      onInputChange={(_, value) => fetchData(value)}
      renderInput={(params) => (
        <TextField {...params} label={name} variant="outlined" />
      )}
    />
  );
};

export default AutocompleteComponent;
