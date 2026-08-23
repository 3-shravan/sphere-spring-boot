package com.sphere.user.service;

import java.util.Map;
import java.util.UUID;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.sphere.user.exception.ApiException;
import com.sphere.user.exception.ErrorType;

import lombok.RequiredArgsConstructor;

/**
 * Ports server/src/config/cloudinary.js.
 *
 * DEVIATION (documented): the source runs every image through `sharp`
 * (resize to fit 800x800, re-encode to JPEG q80) before upload. The
 * equivalent here is Cloudinary's own eager/incoming transformation
 * (`transformation` param below) rather than a server-side image library,
 * since Cloudinary performs the identical resize+reencode server-side on
 * their end — functionally equivalent, avoids adding a native image
 * library (e.g. Thumbnailator/imgscalr) as an extra dependency for
 * something Cloudinary already does. Flag if byte-identical output matters.
 */
@Service
@RequiredArgsConstructor
public class CloudinaryService {

    private static final Logger log = LoggerFactory.getLogger(CloudinaryService.class);

    private final Cloudinary cloudinary;

    public record UploadResult(String url, String publicId) {
    }

    public UploadResult upload(MultipartFile file, String folder) {
        if (file == null || file.isEmpty()) {
            return null;
        }
        String publicId = folder + "_" + UUID.randomUUID();
        try {
            // Check if Cloudinary is configured
            if (cloudinary.config.cloudName == null || cloudinary.config.cloudName.isEmpty() ||
                cloudinary.config.apiKey == null || cloudinary.config.apiKey.isEmpty()) {
                log.warn("Cloudinary is not configured! Skipping upload and returning a placeholder URL. Please set CLOUDINARY_* environment variables.");
                return new UploadResult("https://via.placeholder.com/150?text=Cloudinary+Not+Configured", publicId);
            }

            Map<?, ?> result = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.asMap(
                    "public_id", publicId,
                    "folder", folder,
                    "overwrite", true,
                    "resource_type", "image",
                    "transformation", new com.cloudinary.Transformation<>()
                            .width(800).height(800).crop("limit")
                            .quality(80).fetchFormat("jpg")
            ));
            return new UploadResult((String) result.get("secure_url"), (String) result.get("public_id"));
        } catch (Exception e) {
            log.error("Cloudinary upload failed", e);
            throw new ApiException(HttpStatus.INTERNAL_SERVER_ERROR, ErrorType.InternalServerError,
                    "Failed to upload image to Cloudinary: " + e.getMessage());
        }
    }

    public void delete(String publicId) {
        if (publicId == null || publicId.isBlank()) {
            return;
        }
        try {
            cloudinary.uploader().destroy(publicId, ObjectUtils.asMap("resource_type", "image"));
        } catch (Exception e) {
            log.warn("Cloudinary delete failed for {} (could be missing or wrong account). Error: {}", publicId, e.getMessage());
            // Do NOT throw an exception here, otherwise users get locked out of updating their profile
            // if their old image was deleted manually or belongs to a different Cloudinary account.
        }
    }
}
