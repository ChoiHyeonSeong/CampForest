package com.campforest.backend.mail.repository;

import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import com.campforest.backend.mail.model.MailAuth;

@Repository
public interface MailAuthRepository extends CrudRepository<MailAuth, String> {
}
