import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import { Practitioner } from "fhir/r4";
import FhirResourceService from "../../Services/FhirService";
import PersonUtil from "../../Services/Utils/PersonUtils";

interface PractitionerAutocompleteFromServerComponentProps {
  label: string;
  onChange: (value: Practitioner | null) => void;
  value: Practitioner | null;
  textFieldProps?: TextFieldProps;
  readOnly?: boolean;
}

export default function PractitionerAutocompleteFromServerComponent({
  label,
  onChange,
  value,
  textFieldProps,
  readOnly,
}: PractitionerAutocompleteFromServerComponentProps) {
  const [dataSet, setDataSet] = useState<Practitioner[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fhirService = new FhirResourceService("Practitioner");

  const fetchData = async (searchTerm: string) => {
    setLoading(true);
    try {
      const result = await fhirService.getResources({ name: searchTerm });

      if (!result.success) throw new Error(result.error);

      setDataSet(result.data as Practitioner[]);
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
