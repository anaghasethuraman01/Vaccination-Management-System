package edu.sjsu.cmpe275.vms.controller;

import edu.sjsu.cmpe275.vms.model.Appointment;
import edu.sjsu.cmpe275.vms.service.PatientService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@RestController
@RequestMapping("/api")
public class PatientDashboardController {

    @Autowired private PatientService patientService;

    @GetMapping(path = "/patient/getVaccinationHistory/{id}")
    public List<Appointment> getVaccinationHistory(@PathVariable(value = "id") long id){
        return this.patientService.getVaccinationHistory(id);
    }

//    @PostMapping(path = "/patient/checkInAppointment")
//    public Appointment checkInAppointment(@RequestParam long id){
//        return this.patientService.checkInAppointment(id);
//    }
}
