import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { Patient } from "fhir/r4";
import FhirResourceService from "../../Services/FhirService";
import PersonUtil from "../../Services/Utils/PersonUtil";

interface PatientAutocompleteFromServerComponentProps {
  label: string;
  onChange: (value: Patient | null) => void;
  value: Patient | null;
  textFieldProps?: TextFieldProps;
  readOnly?: boolean;
}

export default function PatientAutocompleteFromServerComponent({
  label,
  onChange,
  value,
  textFieldProps,
  readOnly,
}: PatientAutocompleteFromServerComponentProps) {
  const [dataSet, setDataSet] = useState<Patient[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fhirService = new FhirResourceService('Patient');

  const fetchData = async (searchTerm: string) => {
    setLoading(true);
    try {

      const result = await fhirService.getResources({ name: searchTerm });

      if (!result.success) throw new Error(result.error);

      setDataSet(result.data as Patient[]);

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
      getOptionLabel={(option) => `${PersonUtil.parsePersonName(option)}`}
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
