package edu.sjsu.cmpe275.vms.service.impl;

import edu.sjsu.cmpe275.vms.model.Disease;
import edu.sjsu.cmpe275.vms.model.Vaccination;
import edu.sjsu.cmpe275.vms.repository.DiseaseRepository;
import edu.sjsu.cmpe275.vms.repository.VaccinationRepository;
import edu.sjsu.cmpe275.vms.service.VaccinationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.ArrayList;
import java.util.List;

@Service
public class VaccinationServiceImpl implements VaccinationService {
    @Autowired
    VaccinationRepository vaccinationRepository;
    @Autowired
    DiseaseRepository diseaseRepository;
    @Override
    public Vaccination createVaccination(String vaccineName, List<String> diseasesList, String manufacturer,
                                          int numberOfShots,
                                          int shotInternalVal,
                                          int duration) {
        List<Disease> diseases = new ArrayList<>();
        for(int i = 0; i < diseasesList.size(); i++) {
            Disease disease = diseaseRepository.findByDiseaseName(diseasesList.get(i)).get();
            diseases.add(disease);
        }
        if(duration == 0) {
            duration = Integer.MAX_VALUE;
        }
        Vaccination vaccination = new Vaccination(vaccineName, diseases ,manufacturer, numberOfShots, shotInternalVal, duration);
//        List<Vaccination> vaccinationList = new ArrayList<>();
//        vaccinationList.add(vaccination);
        for(Disease disease : diseases) {
            disease.setVaccination(vaccination);
        }
        vaccination.setDiseases(diseases);
        return this.vaccinationRepository.save(vaccination);
    }

    @Override
    public List<Vaccination> getAllVaccines(){
        List<Vaccination> allVaccines = this.vaccinationRepository.findAll();
        return allVaccines;

    }
}
