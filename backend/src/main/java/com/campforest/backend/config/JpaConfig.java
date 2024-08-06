package com.campforest.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.jpa.repository.config.EnableJpaRepositories;

@Configuration
@EnableJpaRepositories(
	basePackages = {
		"com.campforest.backend.board.repository",
		"com.campforest.backend.chatting.repository",
		"com.campforest.backend.product.repository",
		"com.campforest.backend.review.repository",
		"com.campforest.backend.notification.repository",
		"com.campforest.backend.transaction.repository",
		"com.campforest.backend.user.repository.jpa"
	}
)
public class JpaConfig {
}
