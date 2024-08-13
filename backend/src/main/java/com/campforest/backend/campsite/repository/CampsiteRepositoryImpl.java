package com.campforest.backend.campsite.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;

import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CampsiteRepositoryImpl implements CampsiteRepositoryCustom {

	private final JPAQueryFactory queryFactory;
}
