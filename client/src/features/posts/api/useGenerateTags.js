import { useState } from "react";
import { errorToast } from "@/utils";
import { aiApi } from "./ai-api";

/**
 * Hook for generating AI tags from a local image File object.
 * Sends the file directly to ai-service (before post creation).
 */
export const useGenerateTags = () => {
  const [isGeneratingTags, setIsGeneratingTags] = useState(false);

  const generateTags = async (imageFile) => {
    if (!imageFile) return null;
    setIsGeneratingTags(true);
    try {
      const res = await aiApi.generateTagsFromFile(imageFile);
      return Array.isArray(res?.tags) ? res.tags : null;
    } catch (err) {
      errorToast(err?.message ?? "Failed to generate tags. Please try again.");
      return null;
    } finally {
      setIsGeneratingTags(false);
    }
  };

  return { generateTags, isGeneratingTags };
};
