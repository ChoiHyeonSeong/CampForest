package com.campforest.backend.sms.repository;

import org.springframework.data.repository.CrudRepository;

import com.campforest.backend.sms.model.SmsAuth;

public interface SmsRepository extends CrudRepository<SmsAuth, String> {
}
