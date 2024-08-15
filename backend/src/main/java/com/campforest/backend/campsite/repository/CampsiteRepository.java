package com.campforest.backend.campsite.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.campforest.backend.campsite.model.Campsite;

public interface CampsiteRepository extends JpaRepository<Campsite, Long>, CampsiteRepositoryCustom {
}
