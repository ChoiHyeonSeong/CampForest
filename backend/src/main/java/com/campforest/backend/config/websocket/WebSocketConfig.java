package com.campforest.backend.config.websocket;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.context.annotation.Configuration;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.MessageDeliveryException;
import org.springframework.messaging.simp.config.ChannelRegistration;
import org.springframework.messaging.simp.config.MessageBrokerRegistry;
import org.springframework.messaging.simp.stomp.StompCommand;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.messaging.support.MessageHeaderAccessor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.web.socket.config.annotation.EnableWebSocketMessageBroker;
import org.springframework.web.socket.config.annotation.StompEndpointRegistry;
import org.springframework.web.socket.config.annotation.WebSocketMessageBrokerConfigurer;

import com.campforest.backend.common.JwtTokenProvider;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.JwtException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@Configuration
@EnableWebSocketMessageBroker
@RequiredArgsConstructor
public class WebSocketConfig implements WebSocketMessageBrokerConfigurer {

    private final JwtTokenProvider jwtTokenProvider;

    @Override
    public void configureMessageBroker(MessageBrokerRegistry config){
        //메시지 구독 요청 url -> 메세지를 받을때
        config.enableSimpleBroker("/sub");
        //메시지 발행 요청 url -> 메시지를 보낼때
        config.setApplicationDestinationPrefixes("/pub");
    }

    @Override
    public void registerStompEndpoints(StompEndpointRegistry registry){
        registry.addEndpoint("/ws")
                .setAllowedOriginPatterns("*")
        .withSockJS();
    }

    // @Override
    // public void configureClientInboundChannel(ChannelRegistration registration) {
    //     registration.interceptors(new ChannelInterceptor() {
    //         @Override
    //         public Message<?> preSend(Message<?> message, MessageChannel channel) {
    //             StompHeaderAccessor accessor = MessageHeaderAccessor.getAccessor(message, StompHeaderAccessor.class);
    //
    //             if (StompCommand.CONNECT.equals(accessor.getCommand())) {
    //                 String authToken = accessor.getFirstNativeHeader("Authorization");
    //
    //                 if (authToken != null && authToken.startsWith("Bearer ")) {
    //                     String jwtToken = authToken.substring(7);
    //
    //                     try {
    //                         // JWT 토큰 검증
    //                         if(!jwtTokenProvider.validateToken(jwtToken))
    //                             throw new MessageDeliveryException("Invalid JWT token");
    //
    //                         Claims claims = jwtTokenProvider.getClaims(jwtToken);
    //
    //                         // 사용자 정보 설정
    //                         String username = claims.getSubject();
    //                         List<String> authorities = claims.get("authorities", List.class);
    //
    //                         UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
    //                             username,
    //                             null,
    //                             authorities.stream().map(SimpleGrantedAuthority::new).collect(Collectors.toList())
    //                         );
    //
    //                         accessor.setUser(auth);
    //                     } catch (JwtException e) {
    //                         // 토큰이 유효하지 않은 경우
    //                         accessor.setUser(null);
    //                         throw new MessageDeliveryException("Invalid JWT token");
    //                     }
    //                 } else {
    //                     // Authorization 헤더가 없거나 형식이 잘못된 경우
    //                     accessor.setUser(null);
    //                     throw new MessageDeliveryException("Missing or invalid Authorization header");
    //                 }
    //             }
    //
    //             return message;
    //         }
    //     });
    // }

}