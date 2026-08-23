package com.sphere.post.service;

import java.io.IOException;
import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.sphere.post.exception.ApiException;
import com.sphere.post.exception.ErrorType;

import lombok.RequiredArgsConstructor;

/** Ports server/src/config/cloudinary.js — see user-service's CloudinaryService javadoc for the sharp-resize-to-Cloudinary-transform deviation note (same reasoning applies here). */
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryService.class);
    private final Cloudinary cloudinary;

    public record UploadResult(String url, String publicId) {
    }

    public UploadResult upload(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) return null;
        String publicId = folder + "_" + UUID.randomUUID();
        try {
            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "public_id", publicId, "folder", folder, "overwrite", true, "resource_type", "image",
                    "transformation", new Transformation<>().width(1080).height(1080).crop("limit").quality(80).fetchFormat("jpg")
            ));
            return new UploadResult((String) result.get("secure_url"), (String) result.get("public_id"));
        } catch (IOException e) {
            log.error("Cloudinary upload failed", e);
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, ErrorType.InternalServerError, "Failed to upload image to Cloudinary");
        }
    }

    public void delete(String publicId) {
        if (publicId == null || publicId.isBlank()) return;
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "image"));
        } catch (IOException e) {
            log.error("Cloudinary delete failed for {}", publicId, e);
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, ErrorType.InternalServerError, "image deletion failed in Cloudinary");
        }
    }
}
