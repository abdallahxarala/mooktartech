import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

const OPENAI_ENDPOINT = "https://api.openai.com/v1/responses";

export async function POST(request: Request) {
  try {
    const { name, description, tags } = await request.json();

    if (!name && !description) {
      return NextResponse.json(
        { error: "Le nom ou la description du produit est requis." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        {
          categories: ["Générique"],
          tags: tags ?? [],
          confidence: 0,
          note: "OPENAI_API_KEY non configurée, valeurs simulées."
        },
        { status: 200 }
      );
    }

    const prompt = [
      "Analyse le produit suivant et propose:",
      "1. Une catégorie principale (ex: Technologie, Gastronomie, Services, etc.)",
      "2. Trois tags pertinents au format liste JSON.",
      "",
      `Nom: ${name ?? "N/A"}`,
      `Description: ${description ?? "N/A"}`,
      `Tags existants: ${(tags ?? []).join(", ") || "Aucun"}`,
      "",
      "Réponds au format JSON strict: { \"category\": string, \"tags\": string[], \"confidence\": number }"
    ].join("\n");

    const response = await fetch(OPENAI_ENDPOINT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        input: prompt,
        temperature: 0.2
      })
    });

    if (!response.ok) {
      const errorPayload = await response.json().catch(() => ({}));
      console.error("OpenAI request failed", errorPayload);
      return NextResponse.json(
        { error: "Impossible de catégoriser ce produit pour le moment." },
        { status: 502 }
      );
    }

    const aiResult = await response.json();
    const content =
      aiResult?.output?.[0]?.content?.[0]?.text ||
      aiResult?.output_text ||
      JSON.stringify({
        category: "Non classé",
        tags: tags ?? [],
        confidence: 0.2
      });

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch (error) {
      console.warn("AI response parsing failed", error, content);
      parsed = {
        category: "Non classé",
        tags: tags ?? [],
        confidence: 0.2
      };
    }

    return NextResponse.json(
      {
        categories: [parsed.category ?? "Non classé"],
        tags: parsed.tags ?? tags ?? [],
        confidence: parsed.confidence ?? 0.5
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("categorize-product error", error);
    return NextResponse.json(
      { error: "Erreur lors de la catégorisation." },
      { status: 500 }
    );
  }
}

