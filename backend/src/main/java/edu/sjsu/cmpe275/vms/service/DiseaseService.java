package edu.sjsu.cmpe275.vms.service;

import edu.sjsu.cmpe275.vms.model.Disease;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface DiseaseService {
    Disease addDisease(String diseaseName,
                       String description);
    List<Disease> getAllDiseases();
}
