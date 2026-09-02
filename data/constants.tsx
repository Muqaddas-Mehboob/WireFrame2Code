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
      name: "Gemini 3.7 Flash",
      value: "google/gemini-3.7-flash",
      icon: "/gemini.jpg",
      modelName: "google/gemini-3.7-flash",
    },
    {
      name: "Claude Sonnet 5",
      value: "anthropic/claude-sonnet-5",
      icon: "/meta.jpg",
      modelName: "anthropic/claude-sonnet-5",
    },
    {
      name: "DeepSeek V4 Flash Vision",
      value: "deepseek/deepseek-v4-flash-vision-exp",
      icon: "/deepseek.jpg",
      modelName: "deepseek/deepseek-v4-flash-vision-exp",
    },
    {
      name: "GPT-5.6 Luna",
      value: "openai/gpt-5.6-luna",
      icon: "/deepseek.jpg",
      modelName: "openai/gpt-5.6-luna",
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