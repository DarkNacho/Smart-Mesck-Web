import { Coding } from "fhir/r4";

export const category: Coding[] = [
  {
    code: "social-history",
    display: "Historia Social",
    system: "http://terminology.hl7.org/CodeSystem/observation-category",
  },
  {
    code: "vital-signs",
    display: "Signos Vitales",
    system: "http://terminology.hl7.org/CodeSystem/observation-category",
  },
  {
    code: "imaging",
    display: "Imágenes",
    system: "http://terminology.hl7.org/CodeSystem/observation-category",
  },
  {
    code: "laboratory",
    display: "Laboratorio",
    system: "http://terminology.hl7.org/CodeSystem/observation-category",
  },
  {
    code: "procedure",
    display: "Procedimiento",
    system: "http://terminology.hl7.org/CodeSystem/observation-category",
  },
  {
    code: "survey",
    display: "Encuesta",
    system: "http://terminology.hl7.org/CodeSystem/observation-category",
  },
  {
    code: "exam",
    display: "Examen",
    system: "http://terminology.hl7.org/CodeSystem/observation-category",
  },
  {
    code: "therapy",
    display: "Terapia",
    system: "http://terminology.hl7.org/CodeSystem/observation-category",
  },
  {
    code: "activity",
    display: "Actividad",
    system: "http://terminology.hl7.org/CodeSystem/observation-category",
  },
];

export const interpretation: Coding[] = [
  {
    code: "N",
    display: "Normal",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "_GeneticObservationInterpretation icon",
    display: "Interpretación de Observación Genética",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "CAR",
    display: "Portador",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "B",
    display: "Mejor",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "D",
    display: "Cambio significativo hacia abajo",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "U",
    display: "Cambio significativo hacia arriba",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "W",
    display: "Peor",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "<",
    display: "Fuera de escala baja",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: ">",
    display: "Fuera de escala alta",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "IE",
    display: "Evidencia insuficiente",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "A",
    display: "Anormal",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "AA",
    display: "Anormal crítico",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "HH",
    display: "Alto crítico",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "LL",
    display: "Bajo crítico",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "H",
    display: "Alto",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "HU",
    display: "Significativamente alto",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "L",
    display: "Bajo",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "LU",
    display: "Significativamente bajo",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "I",
    display: "Intermedio",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "NCL",
    display: "Sin punto de corte definido por CLSI",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "NS",
    display: "No susceptible",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "R",
    display: "Resistente",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "SYN-R",
    display: "Sinergia - resistente",
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
    display: "Dependiente de la dosis susceptible",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "SYN-S",
    display: "Sinergia - susceptible",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "EX",
    display: "Fuera de umbral",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "HX",
    display: "Por encima del umbral alto",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "LX",
    display: "Por debajo del umbral bajo",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "ObservationInterpretationDetection",
    display: "Detección de interpretación de observación",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "IND",
    display: "Indeterminado",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "E",
    display: "Equívoco",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "NEG",
    display: "Negativo",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "ND",
    display: "No detectado",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "POS",
    display: "Positivo",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "DET",
    display: "Detectado",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "EXP",
    display: "Esperado",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "UNE",
    display: "Inesperado",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "NR",
    display: "No reactivo",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "RR",
    display: "Reactivo",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
  {
    code: "WR",
    display: "Débilmente reactivo",
    system:
      "http://terminology.hl7.org/CodeSystem/v3-ObservationInterpretation",
  },
];
/* Tiene más opciones pero es para futura actualización a R5
export const generoOptions: Coding[] = [
  {
    code: "asked-declined",
    display: "No declarado",
    system: "http://terminology.hl7.org/CodeSystem/data-absent-reason",
  },
  {
    code: "unknown",
    display: "No especificado",
    system: "http://hl7.org/fhir/administrative-gender",
  },
  {
    code: "male",
    display: "Masculino",
    system: "http://hl7.org/fhir/administrative-gender",
  },
  {
    code: "female",
    display: "Femenino",
    system: "http://hl7.org/fhir/administrative-gender",
  },
  {
    code: "446141000124107",
    display: "Identifica como femenino",
    system: "http://snomed.info/sct",
  },
  {
    code: "446151000124109",
    display: "Identifica como masculino",
    system: "http://snomed.info/sct",
  },
  {
    code: "33791000087105",
    display: "Identifica como no-binario",
    system: "http://snomed.info/sct",
  },
  {
    code: "other",
    display: "Otro",
    system: "http://hl7.org/fhir/administrative-gender",
  },
];*/

export const generoOptions: Coding[] = [
  {
    code: "unknown",
    display: "No especificado",
    system: "http://hl7.org/fhir/administrative-gender",
  },
  {
    code: "male",
    display: "Masculino",
    system: "http://hl7.org/fhir/administrative-gender",
  },
  {
    code: "female",
    display: "Femenino",
    system: "http://hl7.org/fhir/administrative-gender",
  },
  {
    code: "other",
    display: "Otro",
    system: "http://hl7.org/fhir/administrative-gender",
  },
];

export const maritalOptions: Coding[] = [
  {
    code: "S",
    display: "Nunca Casado",
    system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
  },
  {
    code: "A",
    display: "Anulado",
    system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
  },
  {
    code: "D",
    display: "Divorciado",
    system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
  },
  {
    code: "I",
    display: "Interlocutorio",
    system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
  },
  {
    code: "L",
    display: "Legalmente Separado",
    system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
  },
  {
    code: "M",
    display: "Casado",
    system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
  },
  {
    code: "C",
    display: "Unión de Hecho",
    system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
  },
  {
    code: "UNK",
    display: "Desconocido",
    system: "http://terminology.hl7.org/CodeSystem/v3-MaritalStatus",
  },
];

export const contactTypes: Coding[] = [
  { code: "C", display: "Contacto de Emergencia" },
  { code: "E", display: "Empleador" },
  { code: "F", display: "Agencia Federal" },
  { code: "I", display: "Compañía de Seguros" },
  { code: "N", display: "Familiar más Cercano" },
  { code: "S", display: "Agencia Estatal" },
  { code: "U", display: "Desconocido" },
];

export const countryCodes: Coding[] = [
  // América
  { code: "+1", display: "Estados Unidos / Canadá" },
  { code: "+52", display: "México" },
  { code: "+55", display: "Brasil" },
  { code: "+54", display: "Argentina" },
  { code: "+57", display: "Colombia" },
  { code: "+56", display: "Chile" },
  { code: "+58", display: "Venezuela" },
  { code: "+51", display: "Perú" },
  { code: "+593", display: "Ecuador" },
  { code: "+53", display: "Cuba" },
  { code: "+591", display: "Bolivia" },
  { code: "+506", display: "Costa Rica" },
  { code: "+507", display: "Panamá" },
  { code: "+598", display: "Uruguay" },
  // Europa
  { code: "+34", display: "España" },
  { code: "+49", display: "Alemania" },
  { code: "+33", display: "Francia" },
  { code: "+39", display: "Italia" },
  { code: "+44", display: "Reino Unido" },
  { code: "+7", display: "Rusia" },
  { code: "+380", display: "Ucrania" },
  { code: "+48", display: "Polonia" },
  { code: "+40", display: "Rumania" },
  { code: "+31", display: "Países Bajos" },
  { code: "+32", display: "Bélgica" },
  { code: "+30", display: "Grecia" },
  { code: "+351", display: "Portugal" },
  { code: "+46", display: "Suecia" },
  { code: "+47", display: "Noruega" },
  // Asia
  { code: "+86", display: "China" },
  { code: "+91", display: "India" },
  { code: "+81", display: "Japón" },
  { code: "+82", display: "Corea del Sur" },
  { code: "+62", display: "Indonesia" },
  { code: "+90", display: "Turquía" },
  { code: "+63", display: "Filipinas" },
  { code: "+66", display: "Tailandia" },
  { code: "+84", display: "Vietnam" },
  { code: "+972", display: "Israel" },
  { code: "+60", display: "Malasia" },
  { code: "+65", display: "Singapur" },
  { code: "+92", display: "Pakistán" },
  { code: "+880", display: "Bangladés" },
  { code: "+966", display: "Arabia Saudita" },
  // África
  { code: "+20", display: "Egipto" },
  { code: "+27", display: "Sudáfrica" },
  { code: "+234", display: "Nigeria" },
  { code: "+254", display: "Kenia" },
  { code: "+212", display: "Marruecos" },
  { code: "+213", display: "Argelia" },
  { code: "+256", display: "Uganda" },
  { code: "+233", display: "Ghana" },
  { code: "+237", display: "Camerún" },
  { code: "+225", display: "Costa de Marfil" },
  { code: "+221", display: "Senegal" },
  { code: "+255", display: "Tanzania" },
  { code: "+249", display: "Sudán" },
  { code: "+218", display: "Libia" },
  { code: "+216", display: "Túnez" },
  // Oceanía
  { code: "+61", display: "Australia" },
  { code: "+64", display: "Nueva Zelanda" },
  { code: "+679", display: "Fiji" },
  { code: "+675", display: "Papúa Nueva Guinea" },
  { code: "+676", display: "Tonga" },
  // Medio Oriente
  { code: "+98", display: "Irán" },
  { code: "+964", display: "Iraq" },
  { code: "+962", display: "Jordania" },
  { code: "+961", display: "Líbano" },
  { code: "+965", display: "Kuwait" },
  { code: "+971", display: "Emiratos Árabes Unidos" },
  { code: "+968", display: "Omán" },
  { code: "+974", display: "Catar" },
  { code: "+973", display: "Bahrein" },
  { code: "+967", display: "Yemen" },
];

export const encounterType: Coding[] = [
  { code: "AMB", display: "Ambulatorio" },
  { code: "VR", display: "Virtual" },
  { code: "EMER", display: "Emergencia" },
  { code: "FLD", display: "Terreno" },
  { code: "HH", display: "Domicilio" },
  { code: "IMP", display: "Hospitalaria" },
  { code: "ACUTE", display: "Hospitalización aguda" },
  { code: "NONAC", display: "Hospitalización no aguda" },
  { code: "UKN", display: "No especificado" },
];

export const clinicalStatus: Coding[] = [
  { code: "active", display: "Activo" },
  { code: "recurrence", display: "Reaparición" },
  { code: "relapse", display: "Recaída" },
  { code: "inactive", display: "Inactivo" },
  { code: "remission", display: "Remisión" },
  { code: "resolved", display: "Resuelto" },
];
