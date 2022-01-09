package edu.sjsu.cmpe275.vms.payload;

import javax.validation.constraints.NotBlank;
import java.util.List;

public class AddVaccinationToClinicRequest {

    @NotBlank
    private Long clinic_id;
    @NotBlank
    private List<Long> vaccination_ids ;

    public Long getClinic_id() {
        return clinic_id;
    }

    public void setClinic_id(Long clinic_id) {
        this.clinic_id = clinic_id;
    }

    public List<Long> getVaccination_ids() {
        return vaccination_ids;
    }

    public void setVaccination_ids(List<Long> vaccination_ids) {
        this.vaccination_ids = vaccination_ids;
    }
}
