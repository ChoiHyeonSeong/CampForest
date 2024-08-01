package com.campforest.backend.user.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "interests")
public class Interest {
	@Id
	@Column(name = "interest_id")
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long interestId;

	@Column(name = "interest")
	private String interest;

}
