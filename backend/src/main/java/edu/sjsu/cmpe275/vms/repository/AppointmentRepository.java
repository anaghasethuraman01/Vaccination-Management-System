package edu.sjsu.cmpe275.vms.repository;


import edu.sjsu.cmpe275.vms.model.Appointment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {

    @Query("SELECT a FROM Appointment a WHERE a.patientId = ?1")
    List<Appointment> findAppointmentsBy(Long patientId);

    @Query("SELECT a FROM Appointment a WHERE a.clinicId = ?1")
    List<Appointment> findAppointmentsByCinic(Long clinicId);

}