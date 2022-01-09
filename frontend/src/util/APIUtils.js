import { API_BASE_URL } from "../constants";

import { Authentication } from "../services";

const request = (options) => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (Authentication.token) {
    headers.append("Authorization", Authentication.bearerToken);
  }

  const defaults = { headers: headers };
  options = Object.assign({}, defaults, options);

  return fetch(options.url, options).then((response) =>
    response.json().then((json) => {
      if (!response.ok) {
        return Promise.reject(json);
      }
      return json;
    })
  );
};

export function getCurrentUser() {
  if (!Authentication.token) {
    return Promise.reject("No access token set.");
  }

  return request({
    url: API_BASE_URL + "/user/me",
    method: "GET",
  });
}

export function login(loginRequest) {
  return request({
    url: API_BASE_URL + "/auth/login",
    method: "POST",
    body: JSON.stringify(loginRequest),
  });
}

export function signup(signupRequest) {
  return request({
    url: API_BASE_URL + "/auth/signup",
    method: "POST",
    body: JSON.stringify(signupRequest),
  });
}
export function addDisease(addDiseaseRequest) {
  return request({
    url: API_BASE_URL + "/diseases/addDisease",
    method: "POST",
    body: JSON.stringify(addDiseaseRequest),
  });
}

export function makeAppointment(addAptRequest) {
  console.log("addAptRequest", addAptRequest);
  return request({
    url: API_BASE_URL + "/appointment/makeAppointment",
    method: "POST",
    body: JSON.stringify(addAptRequest),
  });
}

export function getClinics() {
  return request({
    url: API_BASE_URL + "/appointment/allClinic",
    method: "GET",
  });
}

export function getAllAppointments(patientId) {
  console.log("patientId", patientId);
  return request({
    url: API_BASE_URL + `/allAppointments?patientId=${patientId}`,
    method: "GET",
  });
}

export function cancelAppointment(aptId) {
  console.log("aptId to cancel", aptId);
  return request({
    url: API_BASE_URL + `/appointment/cancelAppointment/${aptId}`,
    method: "POST",
  });
}

export function checkInAppointment(aptId) {
  console.log("aptId to checkInAppointment", aptId);
  return request({
    url: API_BASE_URL + `/appointment/checkInAppointment/${aptId}`,
    method: "POST",
  });
}

export function updateAppointment(updateAptRequest) {
  console.log("updateAppointment", updateAptRequest);
  return request({
    url: API_BASE_URL + "/appointment/updateAppointment",
    method: "POST",
    body: JSON.stringify(updateAptRequest),
  });
}

export function getDueVaccines(clinicId) {
  console.log("clinicId in utils", clinicId);
  return request({
    url: API_BASE_URL + `/clinic/${clinicId}`,
    method: "GET",
  });
}
    
export function addClinic(addClinicRequest) {
  return request({
    url: API_BASE_URL + "/clinic",
    method: "POST",
    body: JSON.stringify(addClinicRequest),
  });
}
export function addVaccination(addVaccinationRequest) {
  return request({
    url: API_BASE_URL + "/vaccination/createVaccination",
    method: "POST",
    body: JSON.stringify(addVaccinationRequest),
  });
}

export function addVaccinationToClinic(addVaccinationToClinicRequest) {
  return request({
    url: API_BASE_URL + "/clinic/addVaccine",
    method: "POST",
    body: JSON.stringify(addVaccinationToClinicRequest),
  });
}


// export function makeAppointment(addAptRequest) {
//   console.log("addAptRequest", addAptRequest);
//   return request({
//     url: API_BASE_URL + "/appointment/makeAppointment",
//     method: "POST",
//     body: JSON.stringify(addAptRequest),
//   });
// }

// export function getClinics() {
//   return request({
//     url: API_BASE_URL + "/appointment/allClinic",
//     method: "GET",
//   });
// }

export function getAptsToCheckin(patientId, currentTime) {
  console.log("getAptsToCheckin in utils", patientId + currentTime);
  return request({
    url:
      API_BASE_URL +
      `/availableCheckin/?patientId=${patientId}&currentTime=${currentTime}`,
    method: "GET",
  });
}

// export function getAllAppointments() {
//   return request({
//     url: API_BASE_URL + "/appointment/",
//     method: "GET",
//   });
// }

// export function checkInAppointment(checkIn) {
//   return request({
//     url: API_BASE_URL + "/patient/checkInAppointment",
//     method: "POST",
//     body: JSON.stringify(checkIn),
//   });
// }

export function getAppointment() {
  console.log(Authentication.userId)
  return request({
    url: API_BASE_URL + `/patient/getVaccinationHistory/${Authentication.userId}`,
    method: "GET",
  });
}
    
export function getAllDiseases() {
  return request({
    url: API_BASE_URL + "/diseases/allDiseases",
    method: "GET",
  });
}

export function getAllVaccines() {
  return request({
    url: API_BASE_URL + "/vaccination/allVaccines",
    method: "GET",
  });
}


export function getAllAppointmentsByClinic(ViewReportRequest) {
  return request({
    url: API_BASE_URL + "/allAppointmentsByClinic",
    method: "POST",
    body: JSON.stringify(ViewReportRequest),
  });
}
