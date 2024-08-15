package com.campforest.backend.user.service;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.Optional;

import org.springframework.security.core.Authentication;
import org.springframework.web.multipart.MultipartFile;

import com.campforest.backend.user.dto.request.RequestPasswordDTO;
import com.campforest.backend.user.dto.request.RequestRegisterDTO;
import com.campforest.backend.user.dto.request.RequestUpdateDTO;
import com.campforest.backend.user.dto.response.ResponseFollowDTO;
import com.campforest.backend.user.dto.response.ResponseInfoDTO;
import com.campforest.backend.user.dto.response.SimilarDto;
import com.campforest.backend.user.model.Users;

public interface UserService {

	void registUser(RequestRegisterDTO requestDTO);

	Optional<Users> findByEmail(String email);

	Optional<Users> findByUserId(Long userId);

	ResponseInfoDTO getUserInfo(Long userId);

	boolean isEmailExist(String email);

	void deleteByEmail(String email);

	void updateUserPassword(RequestPasswordDTO requestDTO);

	void updateUserProfile(String email, RequestUpdateDTO requestDTO, MultipartFile profileImageFile) throws
		IOException;

	Authentication authenticateUser(String email, String password);

	void followUser(Authentication authentication, Long followeeId);

	void unfollowUser(Authentication auth, Long followeeId);

	List<ResponseFollowDTO> getFollowers(Long userId);

	List<ResponseFollowDTO> getFollowing(Long userId);

	boolean isFollowing(Long followerId, Long followeeId);

	List<SimilarDto> getPythonRecommendUsers(Long userId);

	List<ResponseInfoDTO> findByNicknameContaining(String nickname, Long cursor, int limit);

	long countByNicknameContaining(String nickname);
}
