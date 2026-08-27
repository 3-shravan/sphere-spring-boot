import { fetcher } from "@/lib/api/fetcher";

export const aiApi = {
  /**
   * Generate a caption from an uploaded image file (before post creation).
   * Sends the image as multipart/form-data to ai-service.
   *
   * @param {File} imageFile - The image File object from the file input / cropper.
   * @returns {{ caption: string, cached: boolean }}
   */
  generateCaptionFromFile: (imageFile) => {
    const form = new FormData();
    form.append("image", imageFile);
    return fetcher({
      endpoint: "/ai/caption/upload",
      method: "POST",
      data: form,
    });
  },

  /**
   * Generate (or retrieve cached) caption for a public image URL.
   * Used after post creation when the Cloudinary URL is available.
   *
   * @param {string} imageUrl - Publicly accessible image URL.
   * @returns {{ caption: string, cached: boolean }}
   */
  generateCaptionFromUrl: (imageUrl) =>
    fetcher({ endpoint: "/ai/caption", method: "POST", data: { imageUrl } }),

  /**
   * Generate tags from an uploaded image file (before post creation).
   * Sends the image as multipart/form-data to ai-service.
   *
   * @param {File} imageFile - The image File object from the file input / cropper.
   * @returns {{ tags: string[], cached: boolean }}
   */
  generateTagsFromFile: (imageFile) => {
    const form = new FormData();
    form.append("image", imageFile);
    return fetcher({
      endpoint: "/ai/tags/upload",
      method: "POST",
      data: form,
    });
  },

  /**
   * Generate (or retrieve cached) tags for a public image URL.
   *
   * @param {string} imageUrl - Publicly accessible image URL.
   * @returns {{ tags: string[], cached: boolean }}
   */
  generateTagsFromUrl: (imageUrl) =>
    fetcher({ endpoint: "/ai/tags", method: "POST", data: { imageUrl } }),
};
