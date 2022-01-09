package edu.sjsu.cmpe275.vms.service;

import edu.sjsu.cmpe275.vms.model.Appointment;

import java.util.List;

public interface PatientService {
    List<Appointment> getVaccinationHistory(long id);
//    Appointment checkInAppointment(long id);
}
