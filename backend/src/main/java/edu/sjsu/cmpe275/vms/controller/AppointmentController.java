package edu.sjsu.cmpe275.vms.controller;



import com.nimbusds.jose.shaded.json.JSONObject;
import edu.sjsu.cmpe275.vms.model.Appointment;

import edu.sjsu.cmpe275.vms.model.Clinic;
import edu.sjsu.cmpe275.vms.model.Vaccination;
import edu.sjsu.cmpe275.vms.payload.AddAppointmentRequest;
import edu.sjsu.cmpe275.vms.payload.AddDiseaseRequest;
import edu.sjsu.cmpe275.vms.payload.AppointmentsByClinicRequest;
import edu.sjsu.cmpe275.vms.payload.UpdateAppointmentRequest;
import edu.sjsu.cmpe275.vms.security.CurrentUser;
import edu.sjsu.cmpe275.vms.service.AppointmentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;

@RestController
public class AppointmentController {

    @Autowired private AppointmentService appointmentService;

    @PostMapping(path = "/api/appointment/makeAppointment")
    @PreAuthorize("hasRole('PATIENT')")
//    public Appointment makeAppointment(@RequestBody String patientId,
//                                       @RequestBody String appointmentTime,
//                                       @RequestBody String currentTime,
//                                       @RequestBody (required = false) List<Long> vaccinationIds, //
//                                       @RequestBody  String clinicId) { // long
//        //long patientId = Long.parseLong(patientID);
//        System.out.println("type:" + patientId.getClass().getSimpleName());
//        return this.appointmentService.makeAppointment(Long.valueOf(patientId),appointmentTime,currentTime,vaccinationIds,Long.valueOf(clinicId));
//    }

    public Appointment makeAppointment(@RequestBody AddAppointmentRequest addAppointmentRequest) {

        List<Long> vaccinationIds = new ArrayList<>();
        long patientId = Long.parseLong(addAppointmentRequest.getPatientId());
        String appointmentTime = addAppointmentRequest.getAppointmentTime();
        String currentTime = addAppointmentRequest.getCurrentTime();
        List<String> vaccineIds = addAppointmentRequest.getVaccinationIds();
        for(String s : vaccineIds){
            vaccinationIds.add(Long.valueOf(s));
        }
        long clinicId = Long.parseLong(addAppointmentRequest.getClinicId());

        System.out.println(patientId + appointmentTime + currentTime  +vaccinationIds+ clinicId );
        return this.appointmentService.makeAppointment(patientId,appointmentTime,currentTime,vaccinationIds,clinicId);
    }

    @GetMapping(path = "/api/appointment/{id}")
    public Appointment getAppointments(@PathVariable(value = "id") long id) {
        return this.appointmentService.getAppointment(id);
    }

    @PostMapping(path = "/api/appointment/cancelAppointment/{id}")
    @PreAuthorize("hasRole('PATIENT')")
    public Appointment cancelAppointment(@PathVariable(value = "id") long id) {
        return this.appointmentService.cancelAppointment(id);
    }

    @PostMapping(path = "/api/appointment/checkInAppointment/{id}")
    @PreAuthorize("hasRole('PATIENT')")
    public Appointment checkinAppointment(@PathVariable(value = "id") long id) {
        return this.appointmentService.checkinAppointment(id);
    }

//    @PostMapping(path = "/api/appointment/updateAppointment")
//    @PreAuthorize("hasRole('PATIENT')")
//    public Appointment updateAppointment(@RequestParam long appointmentId,
//                                       @RequestParam String appointmentTime,
//                                       @RequestParam String currentTime,
//                                         @RequestParam String clinicId) {
//        return this.appointmentService.updateAppointment(appointmentId,appointmentTime,currentTime,Long.valueOf(clinicId));
//    }

    @PostMapping(path = "/api/appointment/updateAppointment")
    @PreAuthorize("hasRole('PATIENT')")
    public Appointment updateAppointment(@RequestBody UpdateAppointmentRequest updateAppointmentRequest) {

        String appointmentTime = updateAppointmentRequest.getAppointmentTime();
        String currentTime = updateAppointmentRequest.getCurrentTime();
        long appointmentId = Long.parseLong(updateAppointmentRequest.getAppointmentId());
        long clinicId = Long.parseLong(updateAppointmentRequest.getClinicId());
        return this.appointmentService.updateAppointment(appointmentId,appointmentTime,currentTime,clinicId);
    }

//    @PostMapping(path = "/api/appointment/checkIn/{id}")
//    @PreAuthorize("hasRole('PATIENT')")
//    public Appointment checkIn(@PathVariable(value = "id") long id,
//                               @RequestParam String currentTime) {
//
//
//        return this.appointmentService.updateAppointment(appointmentId,appointmentTime,currentTime,clinicId);
//    }

    @GetMapping(path = "/api/appointment/allClinic")
    public List<Clinic> getAllClinic() {
        return this.appointmentService.getAllClinics();
    }
    @GetMapping(path = "/api/appointment/allDueVaccines")
    public List<Vaccination>  getAllDueVaccines() {
        return this.appointmentService.getAllDueVaccines();
    }

    @GetMapping(path = "/api/availableCheckin")
    @PreAuthorize("hasRole('PATIENT')")
    public List<Appointment> getAllCheckin(@RequestParam String patientId, String currentTime){
        long patientID = Long.valueOf(patientId);
        return this.appointmentService.allCheckin(patientID, currentTime);
    }

    @GetMapping(path = "/api/allAppointments")
    @PreAuthorize("hasRole('PATIENT')")
    public List<Appointment> getAllAppointments(@RequestParam String patientId){
        long patientID = Long.valueOf(patientId);
        return this.appointmentService.allAppointments(patientID);
    }

    @PostMapping ("/api/allAppointmentsByClinic")
    @PreAuthorize("hasRole('ADMIN')")
    public List<Appointment> getAllAppointmentsByClinic(@RequestBody AppointmentsByClinicRequest request){
        return this.appointmentService.getAllAppointmentsByClinic(request.getClinicId());
    }


}
