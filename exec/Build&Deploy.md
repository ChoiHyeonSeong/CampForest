# 1. 애플리케이션 환경
- JVM : OpenJDK 17
- 웹서버 : Nginx 1.27.0
- WAS : Tomcat 10.1.25
- IDE 버전
  - IntelliJ IDEA 2023.1
  - VS Code v1.92.1


# 2. 빌드, 배포 환경 변수

## Nginx

### nginx.conf
```conf
events {
    worker_connections 1024;
}

http {

    client_max_body_size 10m;  # 전체 요청에 대한 최대 본문 크기
    client_body_timeout 1h;
    client_header_timeout 1h;
    keepalive_timeout 1h;
    send_timeout 1h;

    server {
        listen 80;
        server_name i11d208.p.ssafy.io;
	    return 301 https://$server_name$request_uri;
    }

    server {
        listen 443 ssl;
        server_name i11d208.p.ssafy.io;

        ssl_certificate /etc/letsencrypt/live/i11d208.p.ssafy.io/fullchain.pem;
        ssl_certificate_key /etc/letsencrypt/live/i11d208.p.ssafy.io/privkey.pem;

        location / {
            proxy_pass http://frontend-container:3000;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;

	        proxy_cookie_path / "/";
        }

        location /api {
            proxy_pass http://backend-container:8081;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
	        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
            proxy_set_header Cookie $http_cookie;
            proxy_pass_header Set-Cookie;
            proxy_cookie_path / "/; HttpOnly; SameSite=None";
            proxy_cookie_flags ~ secure httponly;
	        proxy_redirect off;
	    }

	    location /api/notification {
    	    proxy_pass http://backend-container:8081;
    	    proxy_set_header Host $host;
            proxy_set_header Cache-Control 'no-cache';
	        proxy_set_header X-Accel-Buffering 'no';
            proxy_set_header Content-Type 'text/event-stream';
            proxy_set_header Connection '';
            proxy_http_version 1.1;
            proxy_buffering off;
            proxy_cache off;
            chunked_transfer_encoding on;
            proxy_read_timeout 86400s;
        }

        location /ws {
            proxy_pass http://backend-container:8081;
            proxy_http_version 1.1;
            proxy_set_header Upgrade $http_upgrade;
            proxy_set_header Connection 'upgrade';
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
	    }

	    location /filter-api {
	        proxy_pass http://filter-server-container:8000;
    	    proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
	    }

	    location ~ ^/(oauth2|login/oauth2) {
            proxy_pass http://backend-container:8081;
            proxy_set_header Host $host;
            proxy_set_header X-Real-IP $remote_addr;
            proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto $scheme;
	    }
    }
}
```

## B.E

### build.gradle

```gradle
plugins {
	id 'java'
	id 'org.springframework.boot' version '3.3.1'
	id 'io.spring.dependency-management' version '1.1.5'
}

group = 'com.campforest'
version = '0.0.1-SNAPSHOT'

java {
	toolchain {
		languageVersion = JavaLanguageVersion.of(17)
	}
}

configurations {
	compileOnly {
		extendsFrom annotationProcessor
	}
}

repositories {
	mavenCentral()
}

dependencies {
	implementation 'org.springframework.boot:spring-boot-starter-data-jpa'
	implementation 'org.springframework.boot:spring-boot-starter-security'
	implementation 'org.springframework.boot:spring-boot-starter-websocket'
	implementation 'org.springframework.boot:spring-boot-starter-data-redis'
	implementation 'org.springframework.boot:spring-boot-starter-oauth2-client'
	implementation 'org.springframework.boot:spring-boot-starter-mail'
	implementation 'org.springframework.cloud:spring-cloud-starter-aws:2.2.6.RELEASE'
	implementation 'io.jsonwebtoken:jjwt-api:0.12.3'
	compileOnly 'org.projectlombok:lombok'
	developmentOnly 'org.springframework.boot:spring-boot-devtools'
	runtimeOnly 'com.mysql:mysql-connector-j'
	runtimeOnly 'io.jsonwebtoken:jjwt-impl:0.12.3'
	runtimeOnly 'io.jsonwebtoken:jjwt-jackson:0.12.3'
	annotationProcessor 'org.projectlombok:lombok'
	testImplementation 'org.springframework.boot:spring-boot-starter-test'
	testImplementation 'org.springframework.security:spring-security-test'
	testRuntimeOnly 'org.junit.platform:junit-platform-launcher'

	testImplementation 'org.mockito:mockito-core:3.6.28'
	testImplementation 'org.mockito:mockito-junit-jupiter:3.6.28'

	implementation 'com.querydsl:querydsl-jpa:5.0.0:jakarta'
	annotationProcessor 'com.querydsl:querydsl-apt:5.0.0:jakarta'
	annotationProcessor 'jakarta.annotation:jakarta.annotation-api'
	annotationProcessor 'jakarta.persistence:jakarta.persistence-api'
}

tasks.named('test') {
	useJUnitPlatform()
}

def generated = 'src/main/generated'

tasks.withType(JavaCompile) {
	options.getGeneratedSourceOutputDirectory().set(file(generated))
}

sourceSets {
	main.java.srcDirs += [ generated ]
}

clean {
	delete file(generated)
}
```

### application.yml

```yaml
server:
  port: 8081

spring:
  application:
    name: backend
  
  servlet:
    multipart:
      max-request-size: 50MB
      max-file-size: 50MB
  
  datasource:
    driver-class-name: com.mysql.cj.jdbc.Driver
    url: jdbc:mysql://{MySQL 서버 주소}:3306/campforest?useSSL=false&serverTimezone=Asia/Seoul&characterEncoding=UTF-8
    username: {UserName}
    password: {Password}
  
  jpa:
    properties:
      hibernate.format_sql: true
      dialect: org.hibernate.dialect.MySQL8InnoDBDialect
  
  data:
    redis:
      host: {Redis 주소}
      port: {Redis 포트}
  
  mail:
    host: smtp.gmail.com
    port: 587
    username: {Google 계정 이메일}
    password: {발급 받은 Secret Key}
    properties:
      mail.smtp.auth: true
      mail.smtp.starttls.enable: true

  security:
    oauth2:
      client:
        registration:
          kakao:
            client-id: {Kakao API Client ID}
            client-secret: {Kakao API Client Secret}
            redirect-uri: https://i11d208.p.ssafy.io/login/oauth2/code/kakao
            authorization-grant-type: authorization_code
            client-authentication-method: client_secret_post
            client-name: Kakao
          naver:
            client-id: {Naver Open API Client ID}
            client-secret: {Naver Open API Client Secret}
            redirect-uri: https://i11d208.p.ssafy.io/login/oauth2/code/naver
            authorization-grant-type: authorization_code
            client-name: Naver
        provider:
          kakao:
            authorization-uri: https://kauth.kakao.com/oauth/authorize
            token-uri: https://kauth.kakao.com/oauth/token
            user-info-uri: https://kapi.kakao.com/v2/user/me
            user-name-attribute: id
          naver:
            authorization-uri: https://nid.naver.com/oauth2.0/authorize
            token-uri: https://nid.naver.com/oauth2.0/token
            user-info-uri: https://openapi.naver.com/v1/nid/me
            user-name-attribute: response

cloud:
  aws:
    s3:
      bucket: campforest
    credentials:
      accessKey: {S3 Access Key}
      secretKey: {S3 Secret Key}
    region:
      static: us-east-1
    stack:
      auto: false

frontend:
  url: https://i11d208.p.ssafy.io

filter-server:
  url: http://3.36.78.37:8000/similar-users/

oauth2:
  baseUrl: https://i11d208.p.ssafy.io

coolsms:
  api:
    domain: https://api.coolsms.co.kr
    from: {휴대폰 번호}
    key: {Cool SMS Key}
    secret: {Cool SMS Secret}

cors:
  allowed-origin: http://192.168.100.166:3000,http://192.168.100.104:3000,http://192.168.100.103:3000,http://localhost:3000,http://127.0.0.1:3000,http://127.0.0.1:5500,http://i11d208.p.ssafy.io,https://i11d208.p.ssafy.io
  allowed-methods: '*'

jwt:
  secret: ${JWT_SECRET}
  accessToken-expiration: ${JWT_ACCESS_TOKEN_EXPIRATION:86400000}
  refreshToken-expiration: ${JWT_REFRESH_TOKEN_EXPIRATION:8640000000}
  oauth-sign-up-expiration: ${JWT_REFRESH_TOKEN_EXPIRATION:600000}
```

## F.E

### package.json
```json
{
  "name": "frontend",
  "version": "0.1.0",
  "private": true,
  "dependencies": {
    "@craco/craco": "^7.1.0",
    "@emoji-mart/react": "^1.1.1",
    "@fullpage/react-fullpage": "^0.1.42",
    "@redux-devtools/extension": "^3.3.0",
    "@reduxjs/toolkit": "^2.2.6",
    "@stomp/stompjs": "^7.0.0",
    "@tailwindcss/aspect-ratio": "^0.4.2",
    "@testing-library/jest-dom": "^5.17.0",
    "@testing-library/react": "^13.4.0",
    "@testing-library/user-event": "^13.5.0",
    "@types/aos": "^3.0.7",
    "@types/event-source-polyfill": "^1.0.5",
    "@types/fullpage.js": "^2.9.6",
    "@types/jest": "^27.5.2",
    "@types/node": "^17.0.45",
    "@types/react": "^18.3.3",
    "@types/react-dom": "^18.3.0",
    "aos": "^2.3.4",
    "autoprefixer": "^10.4.19",
    "axios": "^1.7.2",
    "event-source-polyfill": "^1.0.31",
    "framer-motion": "^11.3.24",
    "fullpage.js": "^4.0.26",
    "gsap": "^3.12.5",
    "postcss": "^8.4.39",
    "react": "^18.3.1",
    "react-cookie": "^7.2.0",
    "react-datepicker": "^7.3.0",
    "react-dom": "^18.3.1",
    "react-intersection-observer": "^9.13.0",
    "react-redux": "^9.1.2",
    "react-router-dom": "^6.26.0",
    "react-scripts": "5.0.1",
    "redux": "^5.0.1",
    "sockjs-client": "^1.6.1",
    "sweetalert2": "^11.12.4",
    "swiper": "^11.1.8",
    "tailwindcss": "^3.4.5",
    "typescript": "^4.9.5",
    "web-vitals": "^2.1.4",
    "workbox-background-sync": "^6.6.0",
    "workbox-broadcast-update": "^6.6.0",
    "workbox-cacheable-response": "^6.6.0",
    "workbox-core": "^6.6.0",
    "workbox-expiration": "^6.6.0",
    "workbox-google-analytics": "^6.6.1",
    "workbox-navigation-preload": "^6.6.0",
    "workbox-precaching": "^6.6.0",
    "workbox-range-requests": "^6.6.0",
    "workbox-routing": "^6.6.0",
    "workbox-strategies": "^6.6.0",
    "workbox-streams": "^6.6.0"
  },
  "scripts": {
    "start": "craco start",
    "build": "craco build",
    "test": "react-scripts test",
    "eject": "react-scripts eject",
    "lint": "eslint src/**/*.{js,jsx,ts,tsx}",
    "lint:fix": "eslint src/**/*.{js,jsx,ts,tsx} --fix"
  },
  "eslintConfig": {
    "extends": [
      "react-app",
      "react-app/jest"
    ]
  },
  "browserslist": {
    "production": [
      ">0.2%",
      "not dead",
      "not op_mini all"
    ],
    "development": [
      "last 1 chrome version",
      "last 1 firefox version",
      "last 1 safari version"
    ]
  },
  "devDependencies": {
    "@types/navermaps": "^3.7.5",
    "@types/react-datepicker": "^7.0.0",
    "@types/sockjs-client": "^1.5.4",
    "@types/stompjs": "^2.3.9",
    "@typescript-eslint/eslint-plugin": "^7.16.1",
    "@typescript-eslint/parser": "^7.16.1",
    "eslint": "^8.56.0",
    "eslint-config-airbnb": "^19.0.4",
    "eslint-config-airbnb-typescript": "^18.0.0",
    "eslint-config-prettier": "^9.1.0",
    "eslint-plugin-import": "^2.29.1",
    "eslint-plugin-jsx-a11y": "^6.9.0",
    "eslint-plugin-prettier": "^5.2.1",
    "eslint-plugin-react": "^7.35.0",
    "eslint-plugin-react-hooks": "^4.6.2",
    "prettier": "^3.3.3",
    "tsconfig-paths-webpack-plugin": "^4.1.0"
  }
}
```

### .env
```
REACT_APP_BACKEND_URL = https://i11d208.p.ssafy.io/api
REACT_APP_BACKEND_WS = https://i11d208.p.ssafy.io/ws
REACT_APP_NAVERMAP_API_KEY = {Naver Map API Key}
```

# 3. 배포 시 특이사항
1. SpringBoot 프로젝트의 src/main/resources 폴더 아래 `application.yml` 파일이 포함되어야 한다. 
2. React 프로젝트의 최상단 폴더(`frontend` 폴더)에 `.env` 파일이 포함되어야 한다. 

# 4. DB, Jenkins 계정 정보
### MySQL
- HOST : 3.36.78.37
- PORT : 3306
- Database : campforest
- ID : root
- Password : 11d208campforest!

### Jenkins
- ID : campforest
- Password : 11d208campforest!