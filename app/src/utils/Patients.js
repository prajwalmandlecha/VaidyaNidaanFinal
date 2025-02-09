import api, { fileApi, fslApi } from "../services/apiService";

export const getPatients = async () => {
  try {
    const response = await api.get("/patients");
    return response.data;
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const addPatient = async (
  name,
  gender,
  age,
  smoker,
  alcoholConsumption,
  neurologicalCondition
) => {
  try {
    const response = await api.post("/patients", {
      name,
      gender,
      age,
      smoker,
      alcoholConsumption,
      neurologicalCondition,
    });
    console.log("Patient added", response.data);
    return response.data;
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const updatePatient = async (
  id,
  name,
  gender,
  age,
  smoker,
  alcoholConsumption,
  neurologicalCondition
) => {
  try {
    const response = await api.put(`/patients/${id}`, {
      name,
      gender,
      age,
      smoker,
      alcoholConsumption,
      neurologicalCondition,
    });
    console.log(response.data.message);
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const deletePatient = async (id) => {
  try {
    const response = await api.delete(`/patients/${id}`);
    console.log(response.data.message);
  } catch (error) {
    alert(error.response.data.message);
  }
};

export const prediction = async (id, formData) => {
  try {
    const response = await fileApi.post(`/patients/${id}/prediction`, formData);
    console.log("Upload successful:", response.data);
    return response.data;
  } catch (error) {
    alert("Error uploading file: " + error);
    return;
  }
};

export const gradcam = async (id, formData) => {
  try {
    const response = await fileApi.post(`/patients/${id}/gradcam`, formData);
    console.log("Upload successful:", response.data);
    return response.data;
  } catch (error) {
    alert("Error uploading file: " + error.response.data.error);
    return;
  }
};

export const fslData = async (formData) => {
  try {
    console.log("lol");
    const response = await fslApi.post("/", formData);
    console.log("kk");
    console.log("Upload successful:", response.data);
    return response.data;
  } catch (error) {
    alert("Error uploading file: ", error);
    return;
  }
};
