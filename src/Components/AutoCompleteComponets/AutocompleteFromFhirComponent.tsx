import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { FhirResource } from "fhir/r4";
import FhirResourceService from "../../Services/FhirService";
import FhirType from "../../Services/Utils/Fhirtypes";

interface AutocompleteFromFhirComponentProps {
  label: string;
  onChange: (value: FhirResource | null) => void;
  getDispay: (value: FhirResource) => string;
  value: FhirResource | null;
  resourceType: FhirType;
  textFieldProps?: TextFieldProps;
  readOnly?: boolean;
  searchParam: string;
}

export default function AutocompleteFromFhirComponent({
  label,
  onChange,
  value,
  textFieldProps,
  readOnly,
  resourceType,
  getDispay,
  searchParam,
}: AutocompleteFromFhirComponentProps) {
  const [dataSet, setDataSet] = useState<FhirResource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const fhirService = new FhirResourceService(resourceType);

  const fetchData = async (searchTerm: string) => {
    setLoading(true);
    try {

      const stringJson = `{"${searchParam}": "${searchTerm}"}`;
      const param = JSON.parse(stringJson);

      const result = await fhirService.getResources(param);

      if (!result.success) throw new Error(result.error);

      setDataSet(result.data as FhirResource[]);
      console.log("obtenidos de auto complete: ", result.data)

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
      getOptionLabel={(option) => getDispay(option)}
      onChange={(_, newValue) => onChange(newValue)}
      onInputChange={(_, value) => fetchData(value)}
      value={value}
      readOnly={readOnly}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          variant="outlined"
          {...textFieldProps}
        />
      )}
    />
  );
}
