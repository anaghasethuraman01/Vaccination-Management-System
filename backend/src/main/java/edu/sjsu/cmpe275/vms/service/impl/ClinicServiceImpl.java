package edu.sjsu.cmpe275.vms.service.impl;

import edu.sjsu.cmpe275.vms.exception.BadRequestException;
import edu.sjsu.cmpe275.vms.exception.ResourceNotFoundException;
import edu.sjsu.cmpe275.vms.model.Address;
import edu.sjsu.cmpe275.vms.model.Clinic;
import edu.sjsu.cmpe275.vms.model.Slot;
import edu.sjsu.cmpe275.vms.model.Vaccination;
import edu.sjsu.cmpe275.vms.repository.ClinicRepository;
import edu.sjsu.cmpe275.vms.repository.SlotRepository;
import edu.sjsu.cmpe275.vms.repository.VaccinationRepository;
import edu.sjsu.cmpe275.vms.service.ClinicService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.DateFormat;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.time.Duration;
import java.time.LocalTime;
import java.time.format.DateTimeFormatter;
import java.util.*;

@Service
public class ClinicServiceImpl implements ClinicService {

    @Autowired ClinicRepository clinicRepository;
    @Autowired
    VaccinationRepository vaccinationRepository;
    @Autowired
    SlotRepository slotRepository;


    @Override
    @Transactional(readOnly = true)
    public List<Vaccination> getVaccinations(long id) {
        Clinic clinic =  this.clinicRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Sorry, clinic does not exist!"));
        return clinic.getVaccinations();
    }

//    @Override
//    public Clinic createClinic(String clinicName, String streetAndNumber,String city,String state,int zipCode, String businessHours, int numberOfPhysicians) {
//
//
//        String[] split = businessHours.split("to");
////        int starthour = Integer.parseInt(split[0].substring(0,2));
////        int endhour = Integer.parseInt(split[1].substring(0,2));
////        int startMin = Integer.parseInt(split[0].substring(3));// get start min
////        int endMin = Integer.parseInt(split[1].substring(3));// get end min
//
//        LocalTime startTime = LocalTime.parse(split[0]);
//        LocalTime endTime = LocalTime.parse(split[1]);
//        double totalhrs = Duration.between(startTime, endTime).getSeconds() * 1.00 / 60 * 60;
//
//        ArrayList<Slot> slots = new ArrayList<>();
//
//        Clinic clinic = new Clinic(clinicName,streetAndNumber,city,state,zipCode,businessHours, numberOfPhysicians);
//        Clinic clinicValue = this.clinicRepository.saveAndFlush(clinic); // trying to save the clinic entity first
//        long clinicId = clinic.getId();
//        System.out.println("clinicId"+clinicId);
//
//        //int totalhrs =  endhour - starthour;
//        if(totalhrs > 8){
//            throw new BadRequestException("Business hours range should be 8 hrs");
//        }
//        if(totalhrs <= 8){
//            int allowedSlots = totalhrs * 4;
//            for(int i =0 ; i< allowedSlots ; i++)
//            {
//              Slot slot = new Slot("Unbooked",0,clinicValue);
//              slots.add(slot);
//            }
//        }
//        this.slotRepository.saveAll(slots);
//        return clinic;
//    }
@Override
public Clinic createClinic(String clinicName, String streetAndNumber,String city,String state,int zipCode, String businessHours, int numberOfPhysicians) {
        if(clinicRepository.findByClinicName(clinicName).isPresent()) {
            throw new BadRequestException("Clinic name already exists.");
        }
    int totalhrs = 0;
    int difInMin = 0;

    ArrayList<Slot> slots = new ArrayList<>();

    String[] split = businessHours.split("to");
    int starthour = Integer.parseInt(split[0].substring(0,2)); // get start hr
    int endhour = Integer.parseInt(split[1].substring(0,2)); // get end hr
    int startTime = Integer.parseInt(split[0].substring(3));// get start min
    int endTime = Integer.parseInt(split[1].substring(3));// get end min
    if(startTime > endTime) {
        totalhrs =  endhour - starthour - 1;
        difInMin = 60 - startTime;
    } else if(startTime < endTime) {
        totalhrs = endhour - starthour ;
        difInMin = endTime - startTime;
    } else {
        totalhrs = endhour - starthour;
    }
    if(totalhrs > 8 ){
        System.out.println("totalhrs: " + totalhrs);
        throw new BadRequestException("Business hours range should be 8 hrs");
    }
    Clinic clinic = new Clinic(clinicName, streetAndNumber,city,state,zipCode, businessHours, numberOfPhysicians);
    Clinic clinicValue = this.clinicRepository.saveAndFlush(clinic); // trying to save the clinic entity first
    long clinicId = clinic.getId();

    //calculating the total business hours

    //adding slots only if business hours is <=8

        int allowedSlots = 0;
        switch (difInMin){
            case 0: allowedSlots = totalhrs * 4;
                break;
            case 15: allowedSlots = (totalhrs * 4) + 1;
                break;
            case 30: allowedSlots = (totalhrs * 4) + 2;
                break;
            case 45: allowedSlots = (totalhrs  * 4) + 3;
                break;
        }
        for(int i =0 ; i< allowedSlots ; i++)
        {
            Slot slot = new Slot("Unbooked",0,clinicValue);
            slots.add(slot);
        }
    System.out.println("Outside if: totalhrs: " + totalhrs);
    this.slotRepository.saveAll(slots);
    return clinic;
}
    @Override
    public Clinic addVaccinations(long clinic_id, List<Long> vaccination_ids) {
        Clinic clinic = this.clinicRepository.findById(clinic_id)
                .orElseThrow(() -> new BadRequestException("Sorry, clinic does not exist"));
        List<Vaccination> newVaccinations = new ArrayList<>();
        for(Long vaccination_id  : vaccination_ids) {
            Vaccination vaccination = this.vaccinationRepository.findById(vaccination_id)
                    .orElseThrow(() -> new BadRequestException("Sorry, vaccine does not exist"));
            newVaccinations.add(vaccination);
        }

        List<Vaccination> existingVaccinations = clinic.getVaccinations();
        if (existingVaccinations == null) {
            existingVaccinations = new ArrayList<>();
        }
        existingVaccinations.addAll(newVaccinations);
        clinic.setVaccinations(existingVaccinations);
        return this.clinicRepository.save(clinic);
    }
}
