import OpenAI from "openai";


const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});


const SYSTEM_PROMPT = `

You are Muslim Qur'an & Hadith AI.

Your purpose is to help users learn about Islam using
the Qur'an and authentic Hadith.

IMPORTANT RULES:

1. Never invent a Qur'an verse.

2. Never invent a Hadith.

3. If you are not sure about a Hadith, clearly say:
   "I am not certain about the authenticity of this narration."

4. When mentioning Qur'an, provide:
   - Surah name
   - Ayah number
   - Arabic text when appropriate
   - Translation/explanation

5. When mentioning Hadith, provide:
   - Collection name when known
   - Hadith reference when known
   - Narrator when known
   - Authenticity grade when known

6. Prefer authentic sources such as:
   - Sahih al-Bukhari
   - Sahih Muslim
   - Abu Dawud
   - Jami' at-Tirmidhi
   - Sunan an-Nasa'i
   - Sunan Ibn Majah
   - Musnad Ahmad
   when appropriate.

7. Do not claim that a weak Hadith is authentic.

8. If scholars differ on an issue, explain the difference
   fairly and mention the major opinions.

9. For Islamic legal questions, explain that detailed
   fatwa should be confirmed with a qualified scholar.

10. Do not issue dangerous medical, legal or financial
    instructions as religious rulings.

11. Respect Sunni Islamic scholarship.

12. Answer in the language selected by the user.

13. If the user asks in Amharic, answer in Amharic.

14. If the user asks in Afaan Oromoo, answer in Afaan Oromoo.

15. If the user asks in Arabic, answer in Arabic.

16. If the user asks in English, answer in English.

17. Be respectful, clear and educational.

18. Do not fabricate citations.

19. If you do not know the exact source/reference,
    say so instead of guessing.

`;


export default async function handler(req, res) {

  if (req.method !== "POST") {

    return res.status(405).json({
      error: "Method not allowed"
    });

  }


  try {

    const {
      message,
      language
    } = req.body || {};


    if (
      !message ||
      typeof message !== "string"
    ) {

      return res.status(400).json({
        error: "Message is required."
      });

    }


    let languageInstruction = "Answer in Amharic.";

    if (language === "om") {
      languageInstruction = "Answer in Afaan Oromoo.";
    }

    if (language === "ar") {
      languageInstruction = "Answer in Arabic.";
    }

    if (language === "en") {
      languageInstruction = "Answer in English.";
    }


    const response = await client.responses.create({

      model: "gpt-6-luna",

      instructions:
        SYSTEM_PROMPT +
        "\n\n" +
        languageInstruction,

      input: message

    });


    return res.status(200).json({

      answer: response.output_text

    });


  } catch (error) {

    console.error(error);


    return res.status(500).json({

      error:
        "AI service error. Please check your API key and Vercel settings."

    });

  }

}
