package com.campforest.backend.user.model;

import java.util.Date;
import java.util.List;

import org.hibernate.annotations.ColumnDefault;

import com.campforest.backend.review.model.Review;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import jakarta.persistence.Temporal;
import jakarta.persistence.TemporalType;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@Entity
@Builder
@Table(name = "users")
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Users {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "user_id")
	private Long userId;

	@Column(name = "user_name", nullable = false)
	private String userName;

	@Column(name = "user_email", nullable = false, unique = true)
	private String email;

	@Column(name = "user_password")
	private String password;

	@Column(name = "provider")
	@ColumnDefault(value = "local")
	private String provider;

	@Column(name = "provider_id")
	private String providerId;

	@Column(name = "user_role", nullable = false)
	@Enumerated(EnumType.STRING)
	private Role role;

	@Column(name = "user_Birthdate")
	@Temporal(TemporalType.DATE)
	private Date birthdate;

	@Column(name = "gender")
	@Enumerated(EnumType.STRING)
	private Gender gender;

	@Column(name = "is_open", nullable = false)
	private boolean isOpen;

	@Column(name = "nickname", nullable = false)
	private String nickname;

	@Column(name = "phone_number")
	private String phoneNumber;

	@Column(name = "introduction")
	private String introduction;

	@Column(name = "profile_image")
	private String profileImage;

	@OneToMany(mappedBy = "reviewer", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonManagedReference
	private List<Review> writtenReviews;

	@OneToMany(mappedBy = "reviewed", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	@JsonManagedReference
	private List<Review> receivedReviews;

	@Column(name = "created_at", nullable = false, updatable = false,
		insertable = false, columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP")
	@Temporal(TemporalType.TIMESTAMP)
	private Date createdAt;

	@Column(name = "modified_at", nullable = false, insertable = false,
		columnDefinition = "TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP")
	@Temporal(TemporalType.TIMESTAMP)
	private Date modifiedAt;

	public void updateOAuthInfo(String provider, String providerId) {
		this.provider = provider;
		this.providerId = providerId;
	}
}
