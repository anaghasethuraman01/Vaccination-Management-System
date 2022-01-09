package edu.sjsu.cmpe275.vms.payload;

import javax.validation.constraints.NotBlank;

public class AddDiseaseRequest {
    @NotBlank
    private String diseaseName;

    private String description;

    public String getDiseaseName() {
        return diseaseName;
    }

    public void setDiseaseName(String diseaseName) {
        this.diseaseName = diseaseName;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }



}
