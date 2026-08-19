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
    { name: "Google Gemini", 
      value: "google-gemini", 
      icon: "/gemini.jpg",
      modelName: "google/gemma-4-31b-it:free"
    },
    { 
      name: "Llama By Meta", 
      value: "llama-meta", 
      icon: "/meta.jpg", 
      modelName: "google/gemma-4-31b-it:free" 
    },
    { 
      name: "Deepseek", 
      value: "deepseek", 
      icon: "/deepseek.jpg", 
      modelName: "google/gemma-4-31b-it:free" },
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