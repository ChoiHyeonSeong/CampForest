package com.campforest.backend.user.dto.response;

import java.util.List;

import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
public class ResponseSearchDTO {
	private long totalCount;
	private List<ResponseInfoDTO> users;
	private Long nextCursor;
	private boolean hasNext;
}
