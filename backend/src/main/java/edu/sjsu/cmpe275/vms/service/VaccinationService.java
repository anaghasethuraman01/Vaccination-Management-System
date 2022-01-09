package edu.sjsu.cmpe275.vms.service;

import edu.sjsu.cmpe275.vms.model.Disease;
import edu.sjsu.cmpe275.vms.model.Vaccination;

import java.util.List;

public interface VaccinationService {
    Vaccination createVaccination(String vaccineName, List<String> diseasesList, String manufacturer,
                                  int numberOfShots,
                                  int shotInternalVal,
                                  int duration);
    List<Vaccination> getAllVaccines();
}
