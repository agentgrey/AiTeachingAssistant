const {Groq} = require('groq-sdk');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

exports.generateAssignmentContent = async ({ prompt }) => {
  const fullprompt = `${prompt}`;

  try {
    const response = await groq.chat.completions.create({
      messages: [
        {
          role: "user",
          content: fullprompt,
        },
      ],
      model: "llama-3.3-70b-versatile",
    });

    const generatedContent = response.choices[0]?.message?.content || "";
    return generatedContent;

  } catch (err) {
    console.error('Error during Groq API call:', err);
    throw err;
  }
};
