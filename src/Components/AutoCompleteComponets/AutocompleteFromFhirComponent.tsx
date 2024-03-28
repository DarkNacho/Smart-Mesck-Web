import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import FhirResourceService from "../../Services/FhirService";
import FhirType from "../../Services/Utils/Fhirtypes";
import { FhirResource, SearchParameter } from "fhir/r4";

interface AutocompleteFromFhirComponentProps<T extends FhirResource> {
  resourceType: FhirType;
  label: string;
  onChange: (value: T | null) => void;
  getDispay: (value: T) => string;
  defaultResourceId?: string;
  value?: T;
  textFieldProps?: TextFieldProps;
  readOnly?: boolean;
  searchParam: string;
  defaultParams?: SearchParameter;
}

export default function AutocompleteFromFhirComponent<T extends FhirResource>({
  resourceType,
  label,
  onChange,
  value,
  textFieldProps,
  readOnly,
  defaultResourceId,
  getDispay,
  searchParam,
  defaultParams,
}: AutocompleteFromFhirComponentProps<T>) {
  const [dataSet, setDataSet] = useState<T[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [defaultResource, setDefaultResource] = useState<T | null>(null);

  const fhirService = new FhirResourceService(resourceType);

  const fetchData = async (searchTerm: string) => {
    setLoading(true);
    try {
      const stringJson = `{"${searchParam}": "${searchTerm}"}`;
      const param = JSON.parse(stringJson);

      const result = await fhirService.getResources({
        ...defaultParams,
        ...param,
      });

      if (!result.success) throw new Error(result.error);

      setDataSet(result.data as T[]);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchDefaultResource = async () => {
    if (!defaultResourceId) return;
    try {
      const result = await fhirService.getById(defaultResourceId);

      if (!result.success) throw new Error(result.error);

      setDefaultResource(result.data as T);
      onChange(result.data as T);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchData("");
    fetchDefaultResource();
  }, []);

  useEffect(() => {
    // Actualiza el valor solo si defaultResource tiene un valor
    if (defaultResource) {
      onChange(defaultResource);
    }
  }, [defaultResource]);

  return (
    <Autocomplete
      options={dataSet}
      loading={loading}
      getOptionLabel={(option) => getDispay(option)}
      onChange={(_, newValue) => setDefaultResource(newValue)}
      onInputChange={(_, value) => fetchData(value)}
      value={value || defaultResource}
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
