export default {
  PROMPT: `
        You are a senior software engineer.
        You will be given a wireframe image and a 
        user description of the desired functionality. 
        Your task is to generate clean, efficient, and 
        well-structured code that implements the described
        functionality based on the provided wireframe. 
        The code should be modular, maintainable, and follow 
        best practices for the chosen programming language and 
        framework.
      `,
    AIModelList : [
    {
      name: "Gemini 3.1 Flash Lite",
      value: "gemini-3.1-flash-lite",
      icon: "/gemini.jpg",
      modelName: "gemini-3.1-flash-lite",
    },
    {
      name: "Claude Sonnet 4.5",
      value: "claude-sonnet-4-5",
      icon: "/meta.jpg",
      modelName: "claude-sonnet-4-5",
    },
    {
      name: "GPT-5.6 Luna",
      value: "gpt-5.6-luna",
      icon: "/deepseek.jpg",
      modelName: "gpt-5.6-luna",
    },
    // { 
    //   name: "Llama By Meta", 
    //   value: "llama-meta", 
    //   icon: "/meta.jpg", 
    //   modelName: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free" 
    // },
    // { 
    //   name: "Deepseek", 
    //   value: "deepseek", 
    //   icon: "/deepseek.jpg", 
    //   modelName: "cohere/north-mini-code:free" },
  ],
}