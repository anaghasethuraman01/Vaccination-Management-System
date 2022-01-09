package edu.sjsu.cmpe275.vms.payload;

import javax.validation.constraints.NotBlank;

public class AppointmentsByClinicRequest {
    @NotBlank
    private String clinicId;

    public String getClinicId() {
        return clinicId;
    }

    public void setClinicId(String clinicId) {
        this.clinicId = clinicId;
    }
}
