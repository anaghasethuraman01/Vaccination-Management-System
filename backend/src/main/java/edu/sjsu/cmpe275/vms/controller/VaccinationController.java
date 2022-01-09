package edu.sjsu.cmpe275.vms.controller;


import edu.sjsu.cmpe275.vms.model.Disease;
import edu.sjsu.cmpe275.vms.model.Vaccination;
import edu.sjsu.cmpe275.vms.payload.AddDiseaseRequest;
import edu.sjsu.cmpe275.vms.payload.AddVaccinationRequest;
import edu.sjsu.cmpe275.vms.security.CurrentUser;
import edu.sjsu.cmpe275.vms.service.DiseaseService;
import edu.sjsu.cmpe275.vms.service.VaccinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/vaccination")
public class VaccinationController {

    @Autowired private VaccinationService vaccinationService;

    @GetMapping("/allVaccines")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Vaccination> getAllVaccines() {
        return this.vaccinationService.getAllVaccines();
    }


    @PostMapping("/createVaccination")
    @PreAuthorize("hasRole('ADMIN')")
    public Vaccination createVaccination(@CurrentUser @RequestBody AddVaccinationRequest request
    ) {
        return this.vaccinationService.createVaccination(request.getVaccineName(),request.getDiseasesList(), request.getManufacturer(), request.getNumberOfShots(), request.getShotInternalVal(), request.getDuration());
    }

}
