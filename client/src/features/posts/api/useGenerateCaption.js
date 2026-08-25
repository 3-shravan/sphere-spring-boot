import { useState } from "react";
import { errorToast } from "@/utils";
import { aiApi } from "./ai-api";

/**
 * Hook for generating an AI caption from a local image File object.
 * Sends the file directly to ai-service (before post creation).
 *
 * Usage:
 *   const { generateCaption, isGenerating } = useGenerateCaption()
 *   const caption = await generateCaption(imageFile)
 */
export const useGenerateCaption = () => {
  const [isGenerating, setIsGenerating] = useState(false);

  const generateCaption = async (imageFile) => {
    if (!imageFile) return null;
    setIsGenerating(true);
    try {
      const res = await aiApi.generateCaptionFromFile(imageFile);
      return res?.caption ?? null;
    } catch (err) {
      errorToast(
        err?.message ?? "Failed to generate caption. Please try again.",
      );
      return null;
    } finally {
      setIsGenerating(false);
    }
  };

  return { generateCaption, isGenerating };
};
