package com.sphere.post.service;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.anyMap;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

import java.io.IOException;
import java.util.Map;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import com.sphere.post.exception.ApiException;

@ExtendWith(MockitoExtension.class)
class CloudinaryServiceTest {

  @Mock
  private Cloudinary cloudinary;

  @Mock
  private Uploader uploader;

  @InjectMocks
  private CloudinaryService cloudinaryService;

  @Test
  void delete_blankPublicId_doesNothing() {
    cloudinaryService.delete("   ");

    verify(cloudinary, never()).uploader();
  }

  @Test
  void delete_validPublicId_callsCloudinaryDestroyWithImageResourceType() throws Exception {
    when(cloudinary.uploader()).thenReturn(uploader);
    when(uploader.destroy(eq("posts/asset-1"), anyMap())).thenReturn(Map.of("result", "ok"));

    cloudinaryService.delete("posts/asset-1");

    ArgumentCaptor<Map> optionsCaptor = ArgumentCaptor.forClass(Map.class);
    verify(uploader).destroy(eq("posts/asset-1"), optionsCaptor.capture());
    assertThat(optionsCaptor.getValue()).containsEntry("resource_type", "image");
  }

  @Test
  void delete_whenCloudinaryThrows_wrapsAsApiException() throws Exception {
    when(cloudinary.uploader()).thenReturn(uploader);
    when(uploader.destroy(eq("posts/broken"), anyMap())).thenThrow(new IOException("network error"));

    assertThatThrownBy(() -> cloudinaryService.delete("posts/broken"))
        .isInstanceOf(ApiException.class)
        .hasMessageContaining("image deletion failed in Cloudinary");
  }
}
