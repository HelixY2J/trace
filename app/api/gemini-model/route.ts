import { NextResponse } from "next/server";
import { z } from "zod";
import { GoogleGenAI } from "@google/genai";

// Request validation schema
const InputItemSchema = z.object({
  type: z.enum(["text", "image"]),
  content: z.string().min(1, "content must be a non-empty string"),
});

const RequestSchema = z.object({
  prompt: z.string().min(1, "prompt must be a non-empty string"),
  inputs: z.array(InputItemSchema).default([]),
});

type ErrorResponse = {
  error: {
    code: string;
    message: string;
  };
};

type SuccessResponse = {
  output: string;
  usedInputs: number;
  image?: string;
};

/**
 * POST /api/gemini-model
 * Validates input and executes a Gemini multimodal request.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const parsed = RequestSchema.safeParse(body);

    if (!parsed.success) {
      const message =
        parsed.error.issues
          .map((issue) => (issue.path.length ? `${issue.path.join(".")}: ${issue.message}` : issue.message))
          .join("; ") || "Invalid request";
      return NextResponse.json<ErrorResponse>(
        { error: { code: "BAD_REQUEST", message } },
        { status: 400 }
      );
    }

    const { prompt, inputs } = parsed.data;

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json<ErrorResponse>(
        { error: { code: "MISSING_API_KEY", message: "GEMINI_API_KEY is not configured" } },
        { status: 500 }
      );
    }

    // Build Gemini multimodal parts from validated inputs
    const parts: Array<{ text?: string; inlineData?: { data: string; mimeType: string } }> = [];
    // Always include the main prompt first
    parts.push({ text: prompt });

    for (const item of inputs) {
      if (item.type === "text") {
        parts.push({ text: item.content });
      } else if (item.type === "image") {
        // Accept data URLs or base64 strings; default mime when unknown
        let base64 = item.content;
        let mimeType = "image/jpeg";
        if (item.content.startsWith("data:")) {
          // data URL: data:<mime>;base64,<data>
          const match = /^data:(.+?);base64,(.*)$/.exec(item.content);
          if (match) {
            mimeType = match[1];
            base64 = match[2];
          }
        }
        parts.push({ inlineData: { data: base64, mimeType } });
      }
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const result = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: [{ role: "user", parts }],
        // Enable multimodcxal output
        config: { responseModalities: ["TEXT", "IMAGE"] },
      });

      // Parse text and optional inline image
      const anyRes = result as any;
      const candidates = anyRes?.candidates ?? anyRes?.response?.candidates ?? [];
      let text = "";
      let imageDataUrl: string | undefined;

      for (const c of candidates) {
        const contentParts = c?.content?.parts ?? [];
        for (const p of contentParts) {
          if (typeof p?.text === "string" && p.text.trim()) {
            text += (text ? "\n" : "") + p.text;
          }
          const inline = p?.inlineData;
          if (
            inline?.data &&
            typeof inline.data === "string" &&
            typeof inline?.mimeType === "string" &&
            inline.mimeType.startsWith("image/")
          ) {
            imageDataUrl = `data:${inline.mimeType};base64,${inline.data}`;
          }
        }
      }

      // Fallback extraction across SDK variants
      if (!text) {
        if (typeof anyRes.text === "function") {
          text = await anyRes.text();
        } else if (anyRes.response && typeof anyRes.response.text === "function") {
          text = await anyRes.response.text();
        } else if (typeof anyRes.outputText === "string") {
          text = anyRes.outputText;
        } else {
          text = "OK";
        }
      }

      const payload: SuccessResponse = { output: text, usedInputs: inputs.length };
      if (imageDataUrl) payload.image = imageDataUrl;
      return NextResponse.json<SuccessResponse>(payload, { status: 200 });
    } catch (err: any) {
      const message = typeof err?.message === "string" ? err.message : "Gemini execution failed";
      return NextResponse.json<ErrorResponse>(
        { error: { code: "MODEL_EXECUTION_FAILED", message } },
        { status: 500 }
      );
    }
  } catch (_err) {
    return NextResponse.json<ErrorResponse>(
      { error: { code: "INTERNAL_ERROR", message: "Unexpected server error" } },
      { status: 500 }
    );
  }
}


