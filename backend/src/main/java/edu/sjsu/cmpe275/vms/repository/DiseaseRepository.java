package edu.sjsu.cmpe275.vms.repository;


import edu.sjsu.cmpe275.vms.model.Disease;
import edu.sjsu.cmpe275.vms.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface DiseaseRepository extends JpaRepository<Disease, Long> {
    Optional<Disease> findByDiseaseName(String name);
}


