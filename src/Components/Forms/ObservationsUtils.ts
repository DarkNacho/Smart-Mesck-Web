import { ValueSetExpansionContains } from "fhir/r4";


export const category: ValueSetExpansionContains[] = [
    {
      code: "social-history",
      display: "Social History",
      system: "http://terminology.hl7.org/CodeSystem/observation-category",
    },
    {
      code: "vital-signs",
      display: "Vital Sings",
      system: "http://terminology.hl7.org/CodeSystem/observation-category",
    },
    {
      code: "imaging",
      display: "Imaging",
      system: "http://terminology.hl7.org/CodeSystem/observation-category",
    },
    {
      code: "laboratory",
      display: "Laboratory",
      system: "http://terminology.hl7.org/CodeSystem/observation-category",
    },
    {
      code: "procedure",
      display: "Procedure",
      system: "http://terminology.hl7.org/CodeSystem/observation-category",
    },
    {
      code: "survey",
      display: "Survery",
      system: "http://terminology.hl7.org/CodeSystem/observation-category",
    },
    {
      code: "exam",
      display: "Exam",
      system: "http://terminology.hl7.org/CodeSystem/observation-category",
    },
    {
      code: "therapy",
      display: "Therapy",
      system: "http://terminology.hl7.org/CodeSystem/observation-category",
    },
    {
      code: "activity",
      display: "Activity",
      system: "http://terminology.hl7.org/CodeSystem/observation-category",
    },
  ];

  export const interpretation: ValueSetExpansionContains[] = [
    {
      code: "N",
      display: "Normal",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "_GeneticObservationInterpretation icon",
      display: "GeneticObservationInterpretation",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "CAR",
      display: "Carrier",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "B",
      display: "Better",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "D",
      display: "Significant change down",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "U",
      display: "Significant change up",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "W",
      display: "Worse",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "<",
      display: "Off scale low",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: ">",
      display: "Off scale high",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "IE",
      display: "Insufficient evidence",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "A",
      display: "Abnormal",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "AA",
      display: "Critical abnormal",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "HH",
      display: "Critical high",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "LL",
      display: "Critical low",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "H",
      display: "High",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "HU",
      display: "Significantly high",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "L",
      display: "Low",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "LU",
      display: "Significantly low",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "I",
      display: "Intermediate",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "NCL",
      display: "No CLSI defined breakpoint",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "NS",
      display: "Non-susceptible",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "R",
      display: "Resistant",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "SYN-R",
      display: "Synergy - resistant",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "S",
      display: "Susceptible",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "SSD",
      display: "Susceptible-dose dependent",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "SYN-S",
      display: "Synergy - susceptibl",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "EX",
      display: "outside threshold",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "HX",
      display: "above high threshold",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "LX",
      display: "below low threshold",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "ObservationInterpretationDetection",
      display: "ObservationInterpretationDetection",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "IND",
      display: "Indeterminate",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "E",
      display: "Equivocal",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "NEG",
      display: "Negative",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "ND",
      display: "Not detected",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "POS",
      display: "Positive",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "DET",
      display: "Detected",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "EXP",
      display: "Expected",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "UNE",
      display: "Unexpected",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "NR",
      display: "Non-reactive",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "RR",
      display: "Reactive",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
    {
      code: "WR",
      display: "Weakly reactive",
      system:
        "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
    },
  ];
