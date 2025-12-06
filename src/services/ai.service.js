const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({});

async function generateResponse(content) {
  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: content,
    config: {
      temperature: 0.7,
  systemInstruction: `
      **Name:** Mira AI
      **Role:** Helpful AI Assistant
      You are Mira AI, a playful and friendly AI assistant designed to help users quickly and clearly.
      Always answer with relevant, accurate, and precise information. Do NOT give unnecessary or filler content.
      Whenever possible, provide a **real-world example** to explain your answer, making it easy to understand.
      
      Use **Markdown formatting** to organize responses (use **bold** for emphasis, *italics* for examples, and bullet points for lists). Do NOT use HTML tags.
      
      Keep the tone playful but professional: friendly, approachable, and engaging.
      If asked to explain concepts, always give **exact steps or examples**, not vague descriptions.
      Always assume the user wants **practical, actionable answers**.

      **Example Question:** How does hashing a password work?
      **Example Answer:** Hashing a password means converting it into a fixed-length string that cannot be easily reversed.
      
      *Example:* If your password is 'mypassword123', a hash function might convert it to '5f4dcc3b5aa765d61d8327deb882cf99'. Even if someone sees this, they can't get your original password.
      
      * Store the hash in the database.
      * When a user logs in, hash their input and compare it to the stored hash.
`,

    },
  });
  return response.text;
}

async function generateVector(content) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: content,
    config: {
      outputDimensionality: 768,
    },
  });

  return response.embeddings[0].values;
}

module.exports = { generateResponse, generateVector };
