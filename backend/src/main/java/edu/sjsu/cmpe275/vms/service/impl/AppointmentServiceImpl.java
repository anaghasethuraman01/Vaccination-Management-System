package edu.sjsu.cmpe275.vms.service.impl;

import com.nimbusds.jose.shaded.json.JSONObject;
import edu.sjsu.cmpe275.vms.exception.BadRequestException;
import edu.sjsu.cmpe275.vms.model.*;
import edu.sjsu.cmpe275.vms.repository.*;
import edu.sjsu.cmpe275.vms.service.AppointmentService;
import edu.sjsu.cmpe275.vms.util.DateUtils;
import edu.sjsu.cmpe275.vms.util.EmailUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.ArrayList;
import java.util.List;


@Service
public class AppointmentServiceImpl implements AppointmentService {
    @Autowired
    AppointmentRepository appointmentRepository;
    @Autowired
    VaccinationRepository vaccinationRepository;
    @Autowired
    UserRepository userRepository;
    @Autowired
    ClinicRepository clinicRepository;
    @Autowired
    SlotRepository slotRepository;

    @Override
    public Appointment makeAppointment(long patientId, String appointmentTime, String currentTime, List<Long> vaccinationIds, long clinicId) {
        System.out.println("appointmentTime" +appointmentTime);
        User patient = null;
        Clinic clinic = null;
        Vaccination vaccine = null;
        long slotIdToBook = 0;
        List<Long> slotIds = new ArrayList<>();

        if(this.userRepository.existsById(patientId)){
            patient = userRepository.findById(patientId).get();
        } else {
            throw new BadRequestException("Patient with id " + patientId + " does not exist in the database.");
        }
        if(this.clinicRepository.existsById(clinicId)){
            clinic = clinicRepository.findById(clinicId).get();
        } else {
            throw new BadRequestException("Clinic with id " + clinicId + " does not exist in the database.");
        }
        List<Vaccination> vaccinationList = new ArrayList<>();
        for( int i=0 ; i< vaccinationIds.size();i++){
            vaccine = vaccinationRepository.findById(vaccinationIds.get(i)).get();
            vaccinationList.add(vaccine);
        }

        String appointmentDate = appointmentTime.substring(0,10);
        String currentDate = currentTime.substring(0,10);
        int aptHr = Integer.parseInt(appointmentTime.substring(11,13));
        int aptMin = Integer.parseInt(appointmentTime.substring(14));

        long months = ChronoUnit.MONTHS.between(LocalDate.parse(currentDate),LocalDate.parse(appointmentDate));
        long days = ChronoUnit.DAYS.between(LocalDate.parse(currentDate),LocalDate.parse(appointmentDate));

        if(months >= 0 && months <= 12 && days >=0) { //check dates if month is 0 or 12
            String businessHours =  clinic.getBusinessHours();
            String[] split = businessHours.split("to");
            int starthour = Integer.parseInt(split[0].substring(0,2)); // get start hr
            int endhour = Integer.parseInt(split[1].substring(0,2)); // get end hr
            int startTime = Integer.parseInt(split[0].substring(3));// get start min
            int endTime = Integer.parseInt(split[1].substring(3));// get end min

            if(aptHr >= starthour && aptHr < endhour && aptMin >= startTime){

                int differenceInHrs =  aptHr - starthour; //for finding the slot

                // fetch all the slot ids for this clinic
                slotIds = this.slotRepository.findByClinicId(clinicId);
                if(slotIds.size() > 0) {
                    for( int  i=0 ; i<slotIds.size(); i++){
                        int a = 0;
                        a = (a + differenceInHrs*4) -1;

                        switch (aptMin){
                            case 0 : slotIdToBook = slotIds.get(a);
                                break;
                            case 15 : slotIdToBook = slotIds.get(a + 1);
                                break;
                            case 30 : slotIdToBook = slotIds.get(a + 2);
                                break;
                            case 45 : slotIdToBook = slotIds.get(a + 3);
                                break;
                        }
                        // break;

                    }
                    System.out.println("slotIdToBook" + slotIdToBook);
                    System.out.println("NumberOfPhysicians()"+clinic.getNumberOfPhysicians());
                    Slot s = this.slotRepository.findById(slotIdToBook).get();
                    //check if slots are available
                    int numberOfAptsInThisSlot = s.getNoOfApt();
                    if (numberOfAptsInThisSlot < clinic.getNumberOfPhysicians()) {
                        numberOfAptsInThisSlot++;
                        Appointment appointment = new Appointment(patientId, appointmentTime, clinic, vaccinationList,"Booked","Ready for Checkin");
                        s.setNoOfApt(numberOfAptsInThisSlot);
                        this.slotRepository.save(s);
                        Appointment a = this.appointmentRepository.save(appointment);
                        EmailUtils.sendNotificationEmail(patient, "confirmed");
                        return a;
                    }
                    else{
                        throw new BadRequestException(" Sorry physicians are not available.");
                    }
                } else{
                    throw new BadRequestException("No slots entry present in the slot table.");
                }
            } else {
                throw new BadRequestException("The appointment time is not within the business hours.");
            }
        }   else {
            throw new BadRequestException("The appointment time should be before within 12 monts of the current time.");
        }
    }

    @Override
    public Appointment getAppointment(long id) {
        Appointment appointment = this.appointmentRepository.findById(id)
                .orElseThrow(() -> new BadRequestException("Sorry, Appointment with this ID does not exist!"));
        return appointment;
    }

    @Override
    public List<Clinic> getAllClinics() {
        List<Clinic> allClinics = this.clinicRepository.findAll();

//        List<JSONObject> clinicList = new ArrayList<JSONObject>();
//        for (Clinic n : allClinics) {
//            JSONObject entity = new JSONObject();
//            entity.put("id", n.getId());
//            entity.put("name", n.getClinicName());
//            clinicList.add(entity);
//        }
        return allClinics;

    }

    @Override
    public List<Vaccination> getAllDueVaccines() {
        return this.vaccinationRepository.findAll();

    }

    @Override
    public Appointment cancelAppointment(long id) {
        Appointment appointment = this.appointmentRepository.findById(id).orElse(null);
        if(appointment != null){
            appointment.setAptStatus("Cancelled");
        }
        Appointment saved = this.appointmentRepository.save(appointment);
        User patient = userRepository.findById(appointment.getPatientId()).get();
        EmailUtils.sendNotificationEmail(patient, "cancelled");
        return saved;
    }

    @Override
    public Appointment checkinAppointment(long id) {
        Appointment appointment = this.appointmentRepository.findById(id).orElse(null);
        if(appointment != null){
            appointment.setCheckedInStatus("Checked-In");
        }
        Appointment saved = this.appointmentRepository.save(appointment);
        User patient = userRepository.findById(appointment.getPatientId()).get();
        EmailUtils.sendNotificationEmail(patient, "checked in");
        return saved;
    }

    @Override
    public Appointment updateAppointment(long appointmentId, String appointmentTime, String currentTime, long clinicId) {
        System.out.println("inside update appointment");
        Appointment appointment = this.appointmentRepository.findById(appointmentId).get();
        String previousAptTime = appointment.getAppointmentTime();
        System.out.println("previousAptTime" + previousAptTime);
        long slotIdToBook = 0;
        long slotIdToUpdate = 0;
        Clinic clinic = this.clinicRepository.findById(clinicId).get();
        List<Long> slotIds = new ArrayList<>();


        String appointmentDate = appointmentTime.substring(0,10);
        String currentDate = currentTime.substring(0,10);
        int aptHr = Integer.parseInt(appointmentTime.substring(11,13));
        int aptMin = Integer.parseInt(appointmentTime.substring(14));

        int prevAptHr = Integer.parseInt(previousAptTime.substring(11,13));
        int prevAptMin = Integer.parseInt(previousAptTime.substring(14, 16));

        long months = ChronoUnit.MONTHS.between(LocalDate.parse(currentDate),LocalDate.parse(appointmentDate));
        long days = ChronoUnit.DAYS.between(LocalDate.parse(currentDate),LocalDate.parse(appointmentDate));

        if(months >= 0 && months <= 12 && days>=0) { //check dates if month is 0 or 12
            // System.out.println("apt time is within 12 months of current time");
            String businessHours =  clinic.getBusinessHours();
            String[] split = businessHours.split("to");
            int starthour = Integer.parseInt(split[0].substring(0,2)); // get start hr
            int endhour = Integer.parseInt(split[1].substring(0,2)); // get end hr
            int startTime = Integer.parseInt(split[0].substring(3));// get start min
            int endTime = Integer.parseInt(split[1].substring(3));// get end min

            if(aptHr >= starthour && aptHr < endhour && aptMin >= startTime) {
                int differenceInHrs =  aptHr - starthour;

                int differenceInPrevAptHrs = prevAptHr - starthour;

                // fetch all the slot ids for this clinic
                slotIds = this.slotRepository.findByClinicId(clinicId);

//                if(slotIds.size() > 0){
//
//                }else{
//                    throw new BadRequestException("No slots entry present in the slot table.");
//                }
                //for removing the old slot
                for( int  i=0 ; i<slotIds.size(); i++){
                    int a = 0;
                    a = (a + differenceInPrevAptHrs*4) -1;

                    switch (prevAptMin){
                        case 0 : slotIdToUpdate = slotIds.get(a);
                            break;
                        case 15 : slotIdToUpdate = slotIds.get(a + 1);
                            break;
                        case 30 : slotIdToUpdate = slotIds.get(a + 2);
                            break;
                        case 45 : slotIdToUpdate = slotIds.get(a + 3);
                            break;
                    }
                    break;

                }
                System.out.println("slotIdToUpdate" + slotIdToUpdate);
                Slot updateSlot = this.slotRepository.findById(slotIdToUpdate).get();
                int aptCount = updateSlot.getNoOfApt();
                aptCount -= 1;
                updateSlot.setNoOfApt(aptCount);
                this.slotRepository.save(updateSlot);


                //for new slot booking
                for( int  i=0 ; i<slotIds.size(); i++){
                    int a = 0;
                    a = (a + differenceInHrs*4)-1;

                    switch (aptMin){
                        case 0 : slotIdToBook = slotIds.get(a);
                            break;
                        case 15 : slotIdToBook = slotIds.get(a + 1);
                            break;
                        case 30 : slotIdToBook = slotIds.get(a + 2);
                            break;
                        case 45 : slotIdToBook = slotIds.get(a + 3);
                            break;
                    }
                    break;

                }
                System.out.println("slotIdToBook" + slotIdToBook);
                Slot s = this.slotRepository.findById(slotIdToBook).get();
                //check if slots are available
                int numberOfAptsInThisSlot = s.getNoOfApt();
                if (numberOfAptsInThisSlot < clinic.getNumberOfPhysicians()) {
                    numberOfAptsInThisSlot++;

                    s.setNoOfApt(numberOfAptsInThisSlot);
                    this.slotRepository.save(s);
                    appointment.setAppointmentTime(appointmentTime);
                    Appointment saved = this.appointmentRepository.saveAndFlush(appointment);
                    User patient = userRepository.findById(appointment.getPatientId()).get();
                    EmailUtils.sendNotificationEmail(patient, "modified");
                    return saved;
                }
                else{
                    throw new BadRequestException(" Sorry physicians are not available.");
                }
            } else{
                throw new BadRequestException("The appointment time is not within the business hours.");
            }
        }   else {
            throw new BadRequestException("The appointment time should be before within 12 monts of the current time.");
        }
    }

    @Override
    public List<Appointment> allCheckin(long patientId, String currentTime) {
        User patient = null;
        if(this.userRepository.existsById(patientId)){
            patient = userRepository.findById(patientId).get();
        } else {
            throw new BadRequestException("Patient with id " + patientId + " does not exist in the database.");
        }

        String currentDate = currentTime.substring(0,10);
        String currentHr = currentTime.substring(11,13);
        String currentMin = currentTime.substring(14);
        Appointment appointment = new Appointment();
        appointment.setPatientId(patientId);
        List<Appointment> checkinList = new ArrayList<>();
        List<Appointment> aptList = this.appointmentRepository.findAppointmentsBy(patientId);
        for(Appointment apt : aptList){
            String aptDate = apt.getAppointmentTime().substring(0,10);

            String aptHr =  apt.getAppointmentTime().substring(11,13);
            String aptMin = apt.getAppointmentTime().substring(14);
            long days = ChronoUnit.DAYS.between(LocalDate.parse(currentDate),LocalDate.parse(aptDate));
//            if(days >=0 && days<=1 ){
//                checkinList.add(apt); //days has been checked, need to check for time
//
//
//                if((Integer.parseInt(aptHr) < Integer.parseInt(currentHr) && apt.getCheckedInStatus().equals("Ready for Checkin"))
//                        || (Integer.parseInt(aptHr) == Integer.parseInt(currentHr) && Integer.parseInt(aptMin) < Integer.parseInt(currentMin) && apt.getCheckedInStatus().equals("Ready for Checkin"))){
//                    //if(Integer.parseInt(aptHr) < Integer.parseInt(currentHr) && Integer.parseInt(aptMin) < Integer.parseInt(60 - currentMin)){
//                    apt.setCheckedInStatus("No Show");
//                     this.appointmentRepository.save(apt);
//                }
//            }
            if(days == 0){
                checkinList.add(apt); //days has been checked, need to check for time
                if((Integer.parseInt(aptHr) < Integer.parseInt(currentHr) && apt.getCheckedInStatus().equals("Ready for Checkin"))
                        || (Integer.parseInt(aptHr) == Integer.parseInt(currentHr) && Integer.parseInt(aptMin) < Integer.parseInt(currentMin) && apt.getCheckedInStatus().equals("Ready for Checkin"))){
                    //if(Integer.parseInt(aptHr) < Integer.parseInt(currentHr) && Integer.parseInt(aptMin) < Integer.parseInt(60 - currentMin)){
                    apt.setCheckedInStatus("No Show");
                    this.appointmentRepository.save(apt);
                }
            }
            if(days == 1 && Integer.parseInt(currentHr) > Integer.parseInt(aptHr)){
                checkinList.add(apt); //days has been checked, need to check for time
                if((Integer.parseInt(currentHr) < Integer.parseInt(aptHr) && apt.getCheckedInStatus().equals("Ready for Checkin"))
                        || (Integer.parseInt(aptHr) == Integer.parseInt(currentHr) && Integer.parseInt(aptMin) < Integer.parseInt(currentMin) && apt.getCheckedInStatus().equals("Ready for Checkin"))){
                    //if(Integer.parseInt(aptHr) < Integer.parseInt(currentHr) && Integer.parseInt(aptMin) < Integer.parseInt(60 - currentMin)){
                    apt.setCheckedInStatus("No Show");
                    this.appointmentRepository.save(apt);
                }
            }
        }
        return checkinList;
    }

    @Override
    public List<Appointment> allAppointments(long patientId) {
        List<Appointment> aptList = this.appointmentRepository.findAppointmentsBy(patientId);
        System.out.println(aptList);
        return aptList;
    }

    @Override
    public List<Appointment> getAllAppointmentsByClinic(String clinicId){
        return this.appointmentRepository.findAppointmentsByCinic(Long.parseLong(clinicId));
    }

}