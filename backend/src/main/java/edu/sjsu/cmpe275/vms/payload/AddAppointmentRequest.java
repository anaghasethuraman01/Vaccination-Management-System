package edu.sjsu.cmpe275.vms.payload;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotBlank;
import java.util.List;

public class AddAppointmentRequest {
    @NotBlank
    private String patientId;

    @NotBlank
    private String appointmentTime;

    private String currentTime;

    private List<String> vaccinationIds;

   private String clinicId;

    public String getPatientId() {
        return patientId;
    }

    public void setPatientId(String patientId) {
        this.patientId = patientId;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(String appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public String getCurrentTime() {
        return currentTime;
    }

    public void setCurrentTime(String currentTime) {
        this.currentTime = currentTime;
    }

    public List<String> getVaccinationIds() {
        return vaccinationIds;
    }

    public void setVaccinationIds(List<String> vaccinationIds) {
        this.vaccinationIds = vaccinationIds;
    }

    public String getClinicId() {
        return clinicId;
    }

    public void setClinicId(String clinicId) {
        this.clinicId = clinicId;
    }
}
