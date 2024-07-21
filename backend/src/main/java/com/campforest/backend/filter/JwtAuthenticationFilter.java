package com.campforest.backend.filter;

import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

import javax.security.sasl.AuthenticationException;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.campforest.backend.common.JwtTokenProvider;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

	private final JwtTokenProvider jwtTokenProvider;

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response,
		FilterChain filterChain) throws ServletException, IOException {
		String jwt = getJwtFromRequest(request);

		try {
			if (jwtTokenProvider.validateToken(jwt)) {
				Claims claims = jwtTokenProvider.getClaims(jwt);
				String userEmail = claims.get("userEmail", String.class);
				List<SimpleGrantedAuthority> authorities =
					Arrays.stream(((String)claims.get("authorities"))
							.split(","))
						.map(SimpleGrantedAuthority::new)
						.collect(Collectors.toList());

				UsernamePasswordAuthenticationToken authentication =
					new UsernamePasswordAuthenticationToken(userEmail, null, authorities);
				SecurityContextHolder.getContext().setAuthentication(authentication);
			}
		} catch (JwtException e) {
			SecurityContextHolder.clearContext();
			throw new AuthenticationException("Invalid JWT token received!", e);
		}
		filterChain.doFilter(request, response);
	}

	private String getJwtFromRequest(HttpServletRequest request) {
		String bearerToken = request.getHeader("Authorization");
		if (bearerToken != null && bearerToken.startsWith("Bearer ")) {
			return bearerToken.substring(7);
		}
		return null;
	}
}
