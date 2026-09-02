export const STAGE2_MODEL = "anthropic/claude-sonnet-5";
export const DEFAULT_VISION_MODEL = "google/gemini-3.7-flash";

export const VISION_MODELS = [
  {
    name: "Gemini 3.7 Flash",
    value: "google/gemini-3.7-flash",
    icon: "/gemini.jpg",
  },
  {
    name: "Claude Sonnet 5",
    value: "anthropic/claude-sonnet-5",
    icon: "/meta.jpg",
  },
  {
    name: "DeepSeek V4 Flash Vision",
    value: "deepseek/deepseek-v4-flash-vision-exp",
    icon: "/deepseek.jpg",
  },
  {
    name: "GPT-5.6 Luna",
    value: "openai/gpt-5.6-luna",
    icon: "/deepseek.jpg",
  },
] as const;

export const SUPPORTED_VISION_MODEL_IDS = new Set<string>(
  VISION_MODELS.map((model) => model.value),
);

/** Maps unprefixed aliases and legacy IDs to canonical Puter model IDs. */
const MODEL_ALIAS_TO_CANONICAL: Record<string, string> = {
  "google/gemini-3.7-flash": "google/gemini-3.7-flash",
  "gemini-3.7-flash": "google/gemini-3.7-flash",
  "anthropic/claude-sonnet-5": "anthropic/claude-sonnet-5",
  "claude-sonnet-5": "anthropic/claude-sonnet-5",
  "deepseek/deepseek-v4-flash-vision-exp":
    "deepseek/deepseek-v4-flash-vision-exp",
  "deepseek-v4-flash-vision-exp": "deepseek/deepseek-v4-flash-vision-exp",
  "openai/gpt-5.6-luna": "openai/gpt-5.6-luna",
  "gpt-5.6-luna": "openai/gpt-5.6-luna",
};

const PROVIDER_PREFIX: Record<string, string> = {
  google: "google",
  anthropic: "anthropic",
  claude: "anthropic",
  openai: "openai",
  deepseek: "deepseek",
};

type PuterModelEntry = {
  id: string;
  provider?: string;
  aliases?: string[];
};

type PuterClient = {
  ai: {
    listModels?: (provider?: string | null) => Promise<PuterModelEntry[]>;
  };
};

let listModelsAliasCache: Map<string, string> | null = null;

function toPrefixedModelId(entry: PuterModelEntry): string {
  if (entry.id.includes("/")) {
    return entry.id;
  }

  const providerKey = entry.provider?.toLowerCase();
  const prefix = providerKey ? PROVIDER_PREFIX[providerKey] : undefined;
  if (prefix) {
    return `${prefix}/${entry.id}`;
  }

  return normalizePuterModelId(entry.id);
}

export function normalizePuterModelId(modelId: string): string {
  const trimmed = modelId.trim();
  if (!trimmed) {
    return DEFAULT_VISION_MODEL;
  }

  const canonical = MODEL_ALIAS_TO_CANONICAL[trimmed];
  if (canonical) {
    return canonical;
  }

  if (trimmed.includes("/")) {
    if (SUPPORTED_VISION_MODEL_IDS.has(trimmed)) {
      return trimmed;
    }

    throw new Error(
      `Unsupported Puter model "${trimmed}". Choose one of: ${[
        ...SUPPORTED_VISION_MODEL_IDS,
      ].join(", ")}.`,
    );
  }

  throw new Error(
    `Invalid model ID "${trimmed}": Puter requires provider-prefixed IDs (e.g. google/gemini-3.7-flash).`,
  );
}

async function buildListModelsAliasCache(
  puter: PuterClient,
): Promise<Map<string, string>> {
  if (listModelsAliasCache) {
    return listModelsAliasCache;
  }

  const cache = new Map<string, string>();

  if (!puter.ai.listModels) {
    listModelsAliasCache = cache;
    return cache;
  }

  try {
    const models = await puter.ai.listModels();
    for (const entry of models) {
      const canonical = toPrefixedModelId(entry);
      cache.set(entry.id, canonical);
      cache.set(canonical, canonical);

      for (const alias of entry.aliases ?? []) {
        cache.set(alias, canonical);
      }
    }
    console.log("[Puter] Cached model aliases from listModels():", cache.size);
  } catch (err) {
    console.warn(
      "[Puter] listModels() failed; using static model normalization:",
      formatPuterError(err),
    );
  }

  listModelsAliasCache = cache;
  return cache;
}

export async function resolvePuterModelId(
  puter: PuterClient,
  modelId: string,
): Promise<string> {
  const trimmed = modelId.trim();
  if (!trimmed) {
    return DEFAULT_VISION_MODEL;
  }

  if (MODEL_ALIAS_TO_CANONICAL[trimmed]) {
    return MODEL_ALIAS_TO_CANONICAL[trimmed];
  }

  const cache = await buildListModelsAliasCache(puter);
  const fromList = cache.get(trimmed);
  if (fromList) {
    return fromList;
  }

  return normalizePuterModelId(trimmed);
}

export function extractPuterContent(response: unknown): string {
  if (typeof response === "string") {
    return response;
  }

  if (Array.isArray(response)) {
    return response
      .map((item) => extractPuterContent(item))
      .filter(Boolean)
      .join("\n");
  }

  if (response && typeof response === "object") {
    const message = (response as { message?: { content?: unknown } }).message;

    if (typeof message?.content === "string") {
      return message.content;
    }

    if (Array.isArray(message?.content)) {
      return message.content
        .map((item: { text?: string; content?: string }) =>
          item?.text || item?.content || "",
        )
        .join("\n");
    }

    const text = (response as { text?: string }).text;
    if (typeof text === "string") {
      return text;
    }

    const content = (response as { content?: string }).content;
    if (typeof content === "string") {
      return content;
    }
  }

  console.warn("[Puter] Unrecognized response shape:", response);
  return JSON.stringify(response);
}

export function formatPuterError(err: unknown): string {
  if (err == null) {
    return "Unknown Puter error";
  }

  if (typeof err === "string") {
    return err;
  }

  if (err instanceof Error) {
    const parts = [err.message];
    const extra = err as Error & {
      status?: number;
      statusText?: string;
      body?: unknown;
      response?: unknown;
      data?: unknown;
      error?: unknown;
    };

    if (extra.status != null) {
      parts.push(`${extra.status} status code`);
    }
    if (extra.statusText) {
      parts.push(extra.statusText);
    }
    for (const field of [extra.body, extra.response, extra.data, extra.error]) {
      if (field == null || field === "") continue;
      parts.push(
        typeof field === "string" ? field : JSON.stringify(field, null, 2),
      );
    }

    return parts.filter(Boolean).join(" — ");
  }

  if (typeof err === "object") {
    const obj = err as Record<string, unknown>;
    const parts: string[] = [];

    for (const key of [
      "message",
      "error",
      "statusText",
      "body",
      "details",
      "code",
      "response",
      "data",
    ]) {
      const value = obj[key];
      if (value == null || value === "") continue;
      parts.push(
        `${key}: ${
          typeof value === "string" ? value : JSON.stringify(value, null, 2)
        }`,
      );
    }

    if (obj.status != null) {
      parts.push(`${obj.status} status code`);
    }

    if (parts.length === 0) {
      try {
        const serialized = JSON.stringify(
          err,
          Object.getOwnPropertyNames(err as object),
          2,
        );
        if (serialized && serialized !== "{}") {
          parts.push(serialized);
        }
      } catch {
        parts.push(String(err));
      }
    }

    return parts.length > 0 ? parts.join(" — ") : String(err);
  }

  return String(err);
}
