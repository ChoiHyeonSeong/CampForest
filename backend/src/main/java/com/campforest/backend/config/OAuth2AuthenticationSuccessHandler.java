package com.campforest.backend.config;

import java.io.IOException;
import java.util.Map;

import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseCookie;
import org.springframework.security.core.Authentication;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler;
import org.springframework.stereotype.Component;

import com.campforest.backend.common.JwtTokenProvider;
import com.campforest.backend.user.model.RefreshToken;
import com.campforest.backend.user.repository.RefreshTokenRepository;

import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class OAuth2AuthenticationSuccessHandler extends SimpleUrlAuthenticationSuccessHandler {

	private final JwtTokenProvider jwtTokenProvider;
	private final RefreshTokenRepository refreshTokenRepository;

	@Override
	public void onAuthenticationSuccess(HttpServletRequest request, HttpServletResponse response,
		Authentication authentication) throws IOException, ServletException {

		OAuth2User oAuth2User = (OAuth2User) authentication.getPrincipal();

		String providerType = determineProviderType(request);
		String email = extractEmail(oAuth2User, providerType);
		System.out.println(
			"OAuth2AuthenticationSuccessHandler.onAuthenticationSuccess email = " + email
		);

		String accessToken = jwtTokenProvider.generateAccessToken(email);
		String refreshToken = jwtTokenProvider.generateRefreshToken(email);

		refreshTokenRepository.save(new RefreshToken(email, refreshToken, jwtTokenProvider.getRefreshTokenExpiration()));

		ResponseCookie cookie = ResponseCookie.from("refreshToken", refreshToken)
			.httpOnly(true)
			.secure(true)
			.maxAge(jwtTokenProvider.getRefreshTokenExpiration())
			.sameSite("None")
			.path("/")
			.build();

		response.addHeader("Authorization", "Bearer " + accessToken);
		response.addHeader(HttpHeaders.SET_COOKIE, cookie.toString());

		// TODO : Redirect URL 설정
	}

	private String determineProviderType(HttpServletRequest request) {
		String requestUrl = request.getRequestURI();
		if (requestUrl.contains("/login/oauth2/code/")) {
			String[] parts = requestUrl.split("/");
			return parts[parts.length - 1];
		}
		throw new OAuth2AuthenticationException("Provider Type을 찾을 수 없습니다.");
	}

	private String extractEmail(OAuth2User oAuth2User, String providerType) {
		Map<String, Object> attributes = oAuth2User.getAttributes();
		if(providerType.equals("kakao")) {
			Map<String, Object> kakaoAccount = (Map<String, Object>) attributes.get("kakao_account");
			return (String) kakaoAccount.get("email");
		} else {
			// TODO : Naver 구현
			return null;
		}
	}
}
