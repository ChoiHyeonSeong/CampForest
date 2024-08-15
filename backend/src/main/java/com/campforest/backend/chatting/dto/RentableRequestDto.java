package com.campforest.backend.chatting.dto;


import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class RentableRequestDto {

	private Long productId;

	private LocalDate currentDate;
}
