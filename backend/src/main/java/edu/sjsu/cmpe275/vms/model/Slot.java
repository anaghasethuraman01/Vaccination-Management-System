package edu.sjsu.cmpe275.vms.model;

import javax.persistence.*;
import java.util.ArrayList;


@Entity
@Table(name = "slot")
public  class Slot {

    @Id
    @GeneratedValue
    private long id;

    @Column(name = "status", nullable = true)
    private String status;

    @Column(name = "noOfApt", nullable = true)
    private int noOfApt;

    public int getNoOfApt() {
        return noOfApt;
    }



    public void setNoOfApt(int noOfApt) {
        this.noOfApt = noOfApt;
    }

    @ManyToOne
    @JoinColumn(name = "clinic_id", referencedColumnName = "id")
    private Clinic clinic;

    public Slot() {

    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Clinic getClinic() {
        return clinic;
    }

    public void setClinic(Clinic clinic) {
        this.clinic = clinic;
    }

//    public Slot(String status, Clinic clinic) {
//        this.status = status;
//        this.clinic = clinic;
//    }
public Slot(String status, int noOfApt, Clinic clinic) {
    this.status = status;
    this.noOfApt = noOfApt;
    this.clinic = clinic;
}
}
