package com.campforest.backend.oauth.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class OAuthController {

	@GetMapping("/login/kakao")
	public String loginKakao() {
		return "redirect:/oauth2/authorization/kakao";
	}
}
