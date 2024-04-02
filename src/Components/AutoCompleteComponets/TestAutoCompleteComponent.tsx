import { useEffect, useState } from "react";
import Autocomplete from "@mui/material/Autocomplete";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import FhirResourceService from "../../Services/FhirService";
import FhirType from "../../Services/Utils/Fhirtypes";
import { FhirResource } from "fhir/r4";
import { SearchParams } from "fhir-kit-client";

interface TestAutoCompleteComponentProps {
  resourceType: FhirType;
  label: string;
  getDisplay: (value: FhirResource) => string;
  onChange: (value: FhirResource | null) => void;
  defaultResourceId?: string;
  textFieldProps?: TextFieldProps;
  readOnly?: boolean;
  searchParam: string;
  defaultParams?: SearchParams;
}

export default function TestAutoCompleteComponent({
  resourceType,
  label,
  textFieldProps,
  readOnly,
  defaultResourceId,
  getDisplay,
  searchParam,
  defaultParams,
  onChange,
}: TestAutoCompleteComponentProps) {
  const [dataSet, setDataSet] = useState<FhirResource[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [defaultResource, setDefaultResource] = useState<FhirResource>();

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

      if (
        defaultResource &&
        !dataSet.find((option) => option.id === defaultResource.id)
      )
        result.data.push(defaultResource);
      setDataSet(result.data);
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

      setDefaultResource(result.data);
      onChange(result.data);
      console.log("defaultResource", result.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    const fetchDataAndDefaultResource = async () => {
      await fetchDefaultResource();
      fetchData("");
    };

    fetchDataAndDefaultResource();
  }, []);

  console.log("dataSet:", dataSet);

  if (defaultResourceId && !defaultResource) return <div>Loading...</div>;

  return (
    <Autocomplete
      id={`${resourceType}-${label}-Autocomplete`}
      defaultValue={defaultResource}
      options={dataSet}
      loading={loading}
      getOptionLabel={(option) => getDisplay(option)}
      isOptionEqualToValue={(option, value) => option.id === value.id}
      readOnly={readOnly}
      onChange={(_, newValue) => onChange(newValue)}
      renderOption={(props, option) => (
        <li {...props} key={option.id}>
          {getDisplay(option)}
        </li>
      )}
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
