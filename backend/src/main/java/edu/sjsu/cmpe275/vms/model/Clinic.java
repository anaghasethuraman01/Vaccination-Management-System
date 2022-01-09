package edu.sjsu.cmpe275.vms.model;


import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import org.aspectj.weaver.patterns.ConcreteCflowPointcut;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import javax.persistence.*;
import java.util.List;

@Entity
@Table(name = "clinic")
public class Clinic {

    @Id
    @GeneratedValue
    private long id;

    @Column(name = "name", nullable = false, unique = true)
    private String clinicName;
    @Column(name = "streetNo", nullable = false)
    private String streetAndNumber;
    @Column(name = "city", nullable = false)
    private String city;
    @Column(name = "state", nullable = false)
    private String state;
    @Column(name = "zipcode", nullable = false)
    private int zipCode;
//    @Embedded
//    private Address address;

    @Column(name = "businessHours", nullable = false)
    private String businessHours;

    @Column(name = "numberOfPhysicians", nullable = false)
    private int numberOfPhysicians;

    public List<Vaccination> getVaccinations() {
        return vaccinations;
    }

    public void setVaccinations(List<Vaccination> vaccinations) {
        this.vaccinations = vaccinations;
    }

    @Fetch(FetchMode.SELECT)
    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "clinic_vaccination_map",
            joinColumns = { @JoinColumn(name = "clinic_id", referencedColumnName = "id")},
            inverseJoinColumns = { @JoinColumn(name = "vaccination_id", referencedColumnName = "id")}
    )
    private List<Vaccination> vaccinations;

    @OneToMany(mappedBy = "clinic", fetch = FetchType.EAGER, cascade=CascadeType.ALL)
    @JsonIgnoreProperties({"clinic"})
    List<Slot> slot;

//    public Clinic(String name, Address address, String businessHours, int numberOfPhysicians) {
//        this.name = name;
//        this.address = address;
//        this.businessHours = businessHours;
//        this.numberOfPhysicians = numberOfPhysicians;
//    }


    public Clinic(String clinicName, String streetAndNumber, String city, String state, int zipCode, String businessHours, int numberOfPhysicians) {
        this.clinicName = clinicName;
        this.streetAndNumber = streetAndNumber;
        this.city = city;
        this.state = state;
        this.zipCode = zipCode;
        this.businessHours = businessHours;
        this.numberOfPhysicians = numberOfPhysicians;
    }

    public String getStreetAndNumber() {
        return streetAndNumber;
    }

    public void setStreetAndNumber(String streetAndNumber) {
        this.streetAndNumber = streetAndNumber;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public int getZipCode() {
        return zipCode;
    }

    public void setZipCode(int zipCode) {
        this.zipCode = zipCode;
    }

    public Clinic() {

    }

    public String getClinicName() {
        return clinicName;
    }

    public void setClinicName(String clinicName) {
        this.clinicName = clinicName;
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

//    public String getName() {
//        return clinicName;
//    }
//
//    public void setName(String name) {
//        this.name = name;
//    }

//    public Address getAddress() {
//        return address;
//    }
//
//    public void setAddress(Address address) {
//        this.address = address;
//    }

    public String getBusinessHours() {
        return businessHours;
    }

    public void setBusinessHours(String businessHours) {
        this.businessHours = businessHours;
    }

    public int getNumberOfPhysicians() {
        return numberOfPhysicians;
    }

    public void setNumberOfPhysicians(int numberOfPhysicians) {
        this.numberOfPhysicians = numberOfPhysicians;
    }
}
