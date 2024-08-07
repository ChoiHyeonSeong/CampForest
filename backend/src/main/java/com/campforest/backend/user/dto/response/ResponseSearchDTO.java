package com.campforest.backend.user.dto.response;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResponseSearchDTO {
	private int size;
	private List<ResponseInfoDTO> users;
}
