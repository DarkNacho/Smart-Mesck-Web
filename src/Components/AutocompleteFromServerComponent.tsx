import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { ValueSet, ValueSetExpansionContains } from "fhir/r4";

interface AutocompleteComponentProps {
  name: string;
  table: string;
  onChange: (value: ValueSetExpansionContains | null) => void;
  value: ValueSetExpansionContains | null;
  textFieldProps?: TextFieldProps;
  readOnly?: boolean;
}

export default function AutocompleteFromServerComponent({
  name,
  table,
  onChange,
  value,
  textFieldProps,
  readOnly,
}: AutocompleteComponentProps) {
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

  useEffect(() => {
    fetchData("");
  }, []);

  return (
    <Autocomplete
      options={dataSet}
      loading={loading}
      getOptionLabel={(option) => `${option.code} - ${option.display}`}
      onChange={(_, newValue) => onChange(newValue)}
      onInputChange={(_, value) => fetchData(value)}
      value={value}
      readOnly={readOnly}
      renderInput={(params) => (
        <TextField
          {...params}
          label={name}
          variant="outlined"
          {...textFieldProps}
        />
      )}
    />
  );
}
