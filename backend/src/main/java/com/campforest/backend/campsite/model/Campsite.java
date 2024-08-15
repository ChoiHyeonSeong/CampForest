package com.campforest.backend.campsite.model;

import java.time.LocalDateTime;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Getter;

@Entity
@Getter
@Table(name = "campsite")
public class Campsite {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "contentId")
	private Long id;

	@Column(name = "facltNm")
	private String facltNm;

	@Column(name = "lineIntro")
	private String lineIntro;

	@Column(name = "intro")
	private String intro;

	@Column(name = "featureNm")
	private String featureNm;

	@Column(name = "induty")
	private String induty;

	@Column(name = "lctCl")
	private String lctCl;

	@Column(name = "doNm")
	private String doNm;

	@Column(name = "sigunguNm")
	private String sigunguNm;

	@Column(name = "zipcode")
	private String zipcode;

	@Column(name = "addr1")
	private String addr1;

	@Column(name = "mapX")
	private double mapX;

	@Column(name = "mapY")
	private double mapY;

	@Column(name = "tel")
	private String tel;

	@Column(name = "homepage")
	private String homepage;

	@Column(name = "resveUrl")
	private String resveUrl;

	@Column(name = "trlerAcmpnyAt")
	private String trlerAcmpnyAt;

	@Column(name = "caravAcmpnyAt")
	private String caravAcmpnyAt;

	@Column(name = "sbrsCl")
	private String sbrsCl;

	@Column(name = "posblFcltyCl")
	private String posblFcltyCl;

	@Column(name = "animalCmgCl")
	private String animalCmgCl;

	@Column(name = "firstImageUrl")
	private String firstImageUrl;

	@Column(name = "createdtime")
	private LocalDateTime createdTime;

	@Column(name = "modifiedtime")
	private LocalDateTime modifiedTime;
}
