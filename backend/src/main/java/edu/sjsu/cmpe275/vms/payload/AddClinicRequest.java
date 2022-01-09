package edu.sjsu.cmpe275.vms.payload;

import javax.validation.constraints.NotBlank;

public class AddClinicRequest {
    @NotBlank
    private String clinicName;

    private String streetAndNumber;
    @NotBlank
    private String city;
    @NotBlank
    private String state;
    @NotBlank
    private Integer zipCode = 0;
    @NotBlank
    private String businessHours ;
    @NotBlank
    private Integer numberOfPhysicians = 0;

    public String getClinicName() {
        return clinicName;
    }

    public void setClinicName(String clinicName) {
        this.clinicName = clinicName;
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

    public Integer getZipCode() {
        return zipCode;
    }

    public void setZipCode(Integer zipCode) {
        this.zipCode = zipCode;
    }

    public String getBusinessHours() {
        return businessHours;
    }

    public void setBusinessHours(String businessHours) {
        this.businessHours = businessHours;
    }

    public Integer getNumberOfPhysicians() {
        return numberOfPhysicians;
    }

    public void setNumberOfPhysicians(Integer numberOfPhysicians) {
        this.numberOfPhysicians = numberOfPhysicians;
    }
}
