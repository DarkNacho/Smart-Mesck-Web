import React, { useState } from "react";

interface ConditionFormProps {
  onSubmit: (condition: any) => void;
}

const ConditionFormComponent: React.FC<ConditionFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    code: "",
    clinicalStatus: "active",
    verificationStatus: "confirmed",
    recordedDate: "",
    onsetDateTime: "",
    abatementDateTime: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label htmlFor="code">Código de la condición:</label>
        <input
          type="text"
          id="code"
          name="code"
          value={formData.code}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="clinicalStatus">Estado clínico:</label>
        <select
          id="clinicalStatus"
          name="clinicalStatus"
          value={formData.clinicalStatus}
          onChange={handleChange}
        >
          <option value="active">Activo</option>
          <option value="resolved">Resuelto</option>
          <option value="remission">Remisión</option>
        </select>
      </div>
      <div>
        <label htmlFor="verificationStatus">Estado de verificación:</label>
        <select
          id="verificationStatus"
          name="verificationStatus"
          value={formData.verificationStatus}
          onChange={handleChange}
        >
          <option value="confirmed">Confirmado</option>
          <option value="provisional">Provisional</option>
          <option value="differential">Diferencial</option>
        </select>
      </div>
      <div>
        <label htmlFor="recordedDate">Fecha registrada:</label>
        <input
          type="date"
          id="recordedDate"
          name="recordedDate"
          value={formData.recordedDate}
          onChange={handleChange}
          disabled={formData.clinicalStatus !== "active"}
        />
      </div>
      <div>
        <label htmlFor="onsetDateTime">Fecha de inicio:</label>
        <input
          type="date"
          id="onsetDateTime"
          name="onsetDateTime"
          value={formData.onsetDateTime}
          onChange={handleChange}
        />
      </div>
      <div>
        <label htmlFor="abatementDateTime">Fecha de alta:</label>
        <input
          type="date"
          id="abatementDateTime"
          name="abatementDateTime"
          value={formData.abatementDateTime}
          onChange={handleChange}
          disabled={formData.clinicalStatus === "active"}
        />
      </div>
      <button type="submit">Enviar</button>
    </form>
  );
};

export default ConditionFormComponent;
