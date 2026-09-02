export {};

declare global {
  interface Window {
    puter: {
      ai: {
        chat: (
          prompt: string,
          mediaOrOptions?:
            | string
            | File
            | string[]
            | { model?: string; stream?: boolean; normalize?: boolean },
          options?: { model?: string; stream?: boolean; normalize?: boolean },
        ) => Promise<unknown>;
        listModels?: (
          provider?: string | null,
        ) => Promise<
          Array<{
            id: string;
            provider?: string;
            name?: string;
            aliases?: string[];
          }>
        >;
      };
    };
  }
}
