package com.campforest.backend.config.s3;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.net.URLEncoder;
import java.util.Optional;
import java.util.UUID;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CompletionException;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.model.AmazonS3Exception;
import com.amazonaws.services.s3.model.CannedAccessControlList;
import com.amazonaws.services.s3.model.GetObjectRequest;
import com.amazonaws.services.s3.model.PutObjectRequest;
import com.amazonaws.services.s3.model.S3Object;
import com.amazonaws.services.s3.model.S3ObjectInputStream;
import com.campforest.backend.common.ApiResponse;
import com.campforest.backend.common.ErrorCode;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class S3Service {

	private final AmazonS3 amazonS3;

	@Value("${cloud.aws.s3.bucket}")
	private String bucket;

	private final String DIR_NAME = "picture";

	public String upload(String fileName, MultipartFile multipartFile, String extend) throws IOException {
		File uploadFile = convert(multipartFile)
			.orElseThrow(() -> new IllegalArgumentException("MultipartFile -> File 전환 실패"));
		return upload(fileName, uploadFile, extend);
	}

	private String upload(String fileName, File uploadFile, String extend) {
		String newFileName = buildFileName(fileName, extend);
		log.info(newFileName);
		String uploadImageUrl = putS3(uploadFile, newFileName);
		removeNewFile(uploadFile);
		return uploadImageUrl;
	}

	@Async
	public CompletableFuture<String> uploadAsync(String fileName, MultipartFile multipartFile, String extend) throws IOException {
		return CompletableFuture.supplyAsync(() -> {
			try {
				return upload(fileName, multipartFile, extend);
			} catch (IOException e) {
				throw new CompletionException(e);
			}
		});
	}

	private String buildFileName(String fileName, String extend) {
		String uuid = UUID.randomUUID().toString();
		if (fileName.endsWith(extend)) {
			return DIR_NAME + "/" + uuid + "_" + fileName;
		}
		return DIR_NAME + "/" + uuid + "_" + fileName + extend;
	}

	private String putS3(File uploadFile, String fileName) {
		amazonS3.putObject(
			new PutObjectRequest(bucket, fileName, uploadFile)
				.withCannedAcl(CannedAccessControlList.PublicRead)
		);
		String s3Url = amazonS3.getUrl(bucket, fileName).toString();
		log.info(s3Url);
		return s3Url;
	}

	private void removeNewFile(File targetFile) {
		if (targetFile.delete()) {
			log.info("파일이 삭제되었습니다.");
		} else {
			log.info("파일이 삭제되지 못했습니다.");
		}
	}

	private Optional<File> convert(MultipartFile file) throws IOException {
		File convertFile = File.createTempFile("temp", file.getOriginalFilename()); // 임시 파일 생성
		try (FileOutputStream fos = new FileOutputStream(convertFile)) {
			fos.write(file.getBytes());
		}
		return Optional.of(convertFile);
	}

	public ApiResponse<?> download(String fileName) {
		try {
			S3Object awsS3Object = amazonS3.getObject(new GetObjectRequest(bucket, DIR_NAME + "/" + fileName));
			S3ObjectInputStream s3is = awsS3Object.getObjectContent();
			byte[] bytes = s3is.readAllBytes();

			String downloadedFileName = URLEncoder.encode(fileName, "UTF-8").replace("+", "%20");
			HttpHeaders httpHeaders = new HttpHeaders();
			httpHeaders.setContentType(MediaType.IMAGE_JPEG);
			httpHeaders.setContentLength(bytes.length);
			httpHeaders.setContentDispositionFormData("attachment", downloadedFileName);

			return ApiResponse.createSuccess(bytes, "File downloaded successfully");
		} catch (IOException e) {
			return ApiResponse.createError(ErrorCode.FILE_DOWNLOAD_FAILED);
		} catch (AmazonS3Exception e) {
			return ApiResponse.createError(ErrorCode.S3_SERVER_ERROR);
		}
	}
}
