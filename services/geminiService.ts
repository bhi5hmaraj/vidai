
import { GoogleGenAI, GenerateContentResponse, Content, File as GeminiSDKFile } from "@google/genai";

// API_KEY is obtained exclusively from process.env.API_KEY.
// Assume this variable is pre-configured, valid, and accessible.
const API_KEY = process.env.API_KEY;

// Initialize GoogleGenAI client.
// If API_KEY is undefined or invalid, this constructor will likely throw an error or
// subsequent API calls will fail, which is the expected behavior as per guidelines.
// The application must not prompt for the key or provide UI to set it.
const ai = new GoogleGenAI({ apiKey: API_KEY });

export interface UploadedVideoFile {
  uri: string;
  mimeType: string;
  displayName: string;
}

const POLLING_INTERVAL_MS = 2000; // 2 seconds
const MAX_POLLING_ATTEMPTS = 60; // Max 60 attempts (e.g., 60 * 2s = 2 minutes for processing)

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function uploadVideo(
  file: File,
  onProgress: (progress: number) => void
): Promise<UploadedVideoFile> {
  // If API_KEY was not valid, ai.files.upload will fail.
  onProgress(0); // Initial progress
  let uploadedFileInitialResponse: GeminiSDKFile;
  try {
    uploadedFileInitialResponse = await ai.files.upload({
      file: file, 
      config: { 
        mimeType: file.type,
        displayName: file.name,
      },
    });

    if (!uploadedFileInitialResponse || !uploadedFileInitialResponse.name) {
        throw new Error("File upload response is missing essential data (file name identifier).");
    }
    onProgress(5); // Small progress after initial upload call success
    
  } catch (error) {
    console.error("Error during initial video upload to Gemini:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    // Specific error handling for API key issues should be caught by the SDK or be generic.
    if (errorMessage.includes("API key not valid") || errorMessage.includes("api_key")) {
        throw new Error(`API Key is invalid or missing. Please ensure it is correctly configured in the environment. Original error: ${errorMessage}`);
    }
    throw new Error(`Failed to initiate video upload: ${errorMessage}`);
  }

  // Polling for ACTIVE state
  let currentFile = uploadedFileInitialResponse;
  let attempts = 0;
  console.log(`Initial file state: ${currentFile.state}, File name: ${currentFile.name}. Starting polling...`);

  while (currentFile.state !== "ACTIVE" && attempts < MAX_POLLING_ATTEMPTS) {
    await delay(POLLING_INTERVAL_MS);
    attempts++;
    const progressPercentage = 5 + Math.min(90, (attempts / MAX_POLLING_ATTEMPTS) * 90); // Scale polling to 5-95%
    onProgress(progressPercentage);

    try {
      console.log(`Polling attempt ${attempts}/${MAX_POLLING_ATTEMPTS} for file ${currentFile.name}...`);
      const fileStatusResponse = await ai.files.get({ name: currentFile.name });
      currentFile = fileStatusResponse; // Update currentFile with the latest status
      console.log(`File state after poll ${attempts}: ${currentFile.state}`);
      
      if (currentFile.state === "FAILED") {
        const failureReason = currentFile.error?.message || 'Unknown processing error.';
        throw new Error(`File processing failed. State: ${currentFile.state}. Reason: ${failureReason}`);
      }
    } catch (error) {
      console.error(`Error polling file status (attempt ${attempts}):`, error);
      if (attempts >= MAX_POLLING_ATTEMPTS) {
        throw new Error(`Failed to get active file status after ${MAX_POLLING_ATTEMPTS} attempts: ${error instanceof Error ? error.message : String(error)}`);
      }
      // Allow retry on polling errors unless it's the last attempt
    }
  }

  if (currentFile.state !== "ACTIVE") {
    onProgress(0); // Reset progress on failure
    throw new Error(`Video file did not become active after ${attempts} attempts. Last state: ${currentFile.state}.`);
  }

  if (!currentFile.uri || !currentFile.mimeType) {
    onProgress(0); // Reset progress on unexpected issue
    throw new Error("Processed file is missing URI or mimeType even after becoming active.");
  }
    
  console.log(`File ${currentFile.name} is now ACTIVE. URI: ${currentFile.uri}`);
  onProgress(100); // Final progress
  return {
    uri: currentFile.uri,
    mimeType: currentFile.mimeType,
    displayName: currentFile.displayName || file.name,
  };
}

export async function generateVideoChatMessage(
  videoFile: UploadedVideoFile,
  prompt: string
): Promise<string> {
  // If API_KEY was not valid, ai.models.generateContent will fail.
  try {
    const videoPart = {
      fileData: {
        mimeType: videoFile.mimeType,
        fileUri: videoFile.uri, 
      },
    };
    const textPart = {
      text: prompt,
    };

    const contents: Content[] = [{ role: "user", parts: [videoPart, textPart] }];

    const response: GenerateContentResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17", 
      contents: contents, 
    });

    return response.text;
  } catch (error) {
    console.error("Error generating chat message from Gemini:", error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes("API key not valid") || errorMessage.includes("api_key")) {
        throw new Error(`API Key is invalid or missing. Please ensure it is correctly configured in the environment. Original error: ${errorMessage}`);
    }
    if (errorMessage.includes("FAILED_PRECONDITION") && errorMessage.includes("not in an ACTIVE state")) {
        throw new Error(`Failed to use video: File is not ready. This might indicate an issue with the upload or processing status. ${errorMessage}`);
    }
    if (errorMessage.toLowerCase().includes("quota") || (error as any)?.code === 429) {
        throw new Error("API request failed due to quota limits. Please check your Gemini API plan and usage.");
    }
    if (errorMessage.includes("model") && (errorMessage.includes("permission denied") || errorMessage.includes("not found"))) {
        throw new Error(`The model "gemini-2.5-flash-preview-04-17" may not be available or you lack permissions. Check model name and API key permissions. Original error: ${errorMessage}`);
    }

    throw new Error(`Failed to get response from AI: ${errorMessage}`);
  }
}
