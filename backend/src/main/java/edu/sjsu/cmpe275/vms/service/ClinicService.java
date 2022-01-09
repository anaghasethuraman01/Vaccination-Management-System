package edu.sjsu.cmpe275.vms.service;

import edu.sjsu.cmpe275.vms.model.Address;
import edu.sjsu.cmpe275.vms.model.Clinic;

import edu.sjsu.cmpe275.vms.model.Vaccination;
import edu.sjsu.cmpe275.vms.payload.SignUpRequest;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface ClinicService {
    List<Vaccination> getVaccinations(long id);
    Clinic createClinic(String clinicName,
                       String streetAndNumber,
                        String city,
                        String state,
                        int zipCode,
                        String businessHours,
                        int NumberOfPhysicians);
    Clinic addVaccinations(long clinic_id, List<Long> vaccination_ids);

}
