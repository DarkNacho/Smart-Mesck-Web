import { Encounter, Period, Reference} from "fhir/r4";
import FhirResourceService from "./FhirService";

export default class EncounterService extends FhirResourceService<Encounter> {
  constructor() {
    super("Encounter");
  }

  private padZero(number : Number) {
    return number.toString().padStart(2, '0');
  }

  public getFormatPeriod(period: Period) {
    if (!period || !period.start) return "N/A";
  
    const startDate = new Date(period.start);
    
    const formattedStartDate = `${startDate.getFullYear()}-${this.padZero(startDate.getMonth() + 1)}-${this.padZero(startDate.getDate())} ${this.padZero(startDate.getHours())}:${this.padZero(startDate.getMinutes())}`;
    
    if(!period.end) return formattedStartDate;
    
    const endDate = new Date(period.end);
    const formattedEndDate = `${this.padZero(endDate.getHours())}:${this.padZero(endDate.getMinutes())}`;
  
    return `${formattedStartDate} - ${formattedEndDate}`;
  }

  public getSubjectDisplayOrID(subject: Reference) {
    if(!subject) return "N/A";
    if(subject.display) return subject.display;
  
    if (subject.reference) {
      // Extrayendo el ID del reference (por ejemplo, "Patient/123")
      const id = subject.reference.split('/')[1]; 
      return id ? id : subject.reference;

    }
  }

  public getSubjectID(subject: Reference) { //Se asume que el subject y la referencia existe...  
    if (subject.reference) {
      // Extrayendo el ID del reference (por ejemplo, "Patient/123")
      const id = subject.reference.split('/')[1]; 
      return id ? id : subject.reference;
    }
  }

  /*
  public async getSubjectName(subject: Reference) {
    if (subject && subject.display) return subject.display;
    if (!subject.reference)  return "N/A"
    
    
      // Extrayendo el ID del reference (por ejemplo, "Patient/123")
      const id = subject.reference.split('/')[1];
      var p = new PatientService();
      var res = await p.getById(id)
      if(res.success) return p.parsePatientName(res.data);
      else return res.error;
  }
  */
  

}
