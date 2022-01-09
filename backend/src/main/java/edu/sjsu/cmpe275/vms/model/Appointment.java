package edu.sjsu.cmpe275.vms.model;

import com.fasterxml.jackson.annotation.JsonFormat;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;

import java.sql.Timestamp;
import java.util.List;

@Entity
@Table(name = "appointment")
public class Appointment {

    @Id
    @GeneratedValue
    private long id;

//    @ManyToOne(fetch = FetchType.EAGER)
//    @JoinColumn(name = "patient_id", referencedColumnName = "mrn")
//    private User patientId;

    @Column(name = "patientId", nullable = false)
    private long patientId;

    @Column(name = "appointmentTime", nullable = true)
    @JsonFormat(pattern="yyyy-MM-dd-HH-MM")
    private String appointmentTime;

    @ManyToOne(fetch = FetchType.EAGER )
    @JoinColumn(name = "clinic_id", referencedColumnName = "id" ,nullable = false)
    private Clinic clinicId;

    @Fetch(FetchMode.SELECT)
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "appointment_vaccination_map",
            joinColumns = { @JoinColumn(name = "appointment_id", referencedColumnName = "id")},
            inverseJoinColumns = { @JoinColumn(name = "vaccination_id", referencedColumnName = "id")}
    )
    private List<Vaccination> vaccinations;

    @Column
    public String aptStatus;

    @Column
    public String checkedInStatus;

    public String getAptStatus() {
        return aptStatus;
    }

    public void setAptStatus(String aptStatus) {
        this.aptStatus = aptStatus;
    }

    public String getCheckedInStatus() {
        return checkedInStatus;
    }

    public void setCheckedInStatus(String checkedInStatus) {
        this.checkedInStatus = checkedInStatus;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public long getPatientId() {
        return patientId;
    }

    public void setPatientId(long patientId) {
        this.patientId = patientId;
    }

    public String getAppointmentTime() {
        return appointmentTime;
    }

    public void setAppointmentTime(String appointmentTime) {
        this.appointmentTime = appointmentTime;
    }

    public Clinic getClinicId() {
        return clinicId;
    }

    public void setClinicId(Clinic clinicId) {
        this.clinicId = clinicId;
    }

    public List<Vaccination> getVaccinations() {
        return vaccinations;
    }

    public void setVaccinations(List<Vaccination> vaccinations) {
        this.vaccinations = vaccinations;
    }

    public Appointment(long patientId, String appointmentTime, Clinic clinicId, List<Vaccination> vaccinations, String aptStatus, String checkedInStatus) {
        this.patientId = patientId;
        this.appointmentTime = appointmentTime;
        this.clinicId = clinicId;
        this.vaccinations = vaccinations;
        this.aptStatus = aptStatus;
        this.checkedInStatus = checkedInStatus;
    }

    public Appointment() {
    }
}
