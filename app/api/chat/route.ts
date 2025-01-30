import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai"
import { DataAPIClient } from "@datastax/astra-db-ts";

const {
  ASTRA_DB_NAMESPACE,
  ASTRA_DB_COLLECTION,
  ASTRA_DB_API_ENDPOINT,
  ASTRA_DB_APPLICATION_TOKEN,
  OPENAI_API_KEY,
} = process.env as unknown as {
  ASTRA_DB_NAMESPACE: string;
  ASTRA_DB_COLLECTION: string;
  ASTRA_DB_API_ENDPOINT: string;
  ASTRA_DB_APPLICATION_TOKEN: string;
  OPENAI_API_KEY: string;
};

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

const client = new DataAPIClient(ASTRA_DB_APPLICATION_TOKEN);
const db = client.db(ASTRA_DB_API_ENDPOINT, { namespace: ASTRA_DB_NAMESPACE });

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();
    const latestMessage = messages[messages?.length - 1]?.content;

    let docContext = "" // (Code snippet is truncated here)

    const embedding = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: latestMessage,
      encoding_format: "float",
    })

    try {
      const collection = await db.collection(ASTRA_DB_COLLECTION);

      const cursor = collection.find(null, {
        sort: {
          $vector: embedding.data[0].embedding,
        },
        limit: 10,
      });

      const documents = await cursor.toArray();

      const docsMap = documents?.map((doc) => doc.text);

      docContext = JSON.stringify(docsMap)
    }
    catch (error) {
      console.log("error querying db...")
      docContext = ""
    }


    const template = {
      role: "system",
      content: `You are an AI assistant who knows everything about Finance. 
        Use the below context to augment what you know about Finance. 
        The context will provide you with the most recent page data from Wikipedia and others. 
        If the context doesn't include the information you need, answer based on your existing knowledge and don't mention the source of your information or 
        what the context does or doesn't include. Format responses using markdown where applicable and don't return images.
        Use the following pieces of retrieved context to answer the question.
        Your response must be structured in a visually appealing, modern format. \n\n

        Formatting Rules:\n 
        - Use 1️⃣, 2️⃣, 3️⃣ and so on before subsections. \n
        - Use emojis like 👉, 📖, 📚, 📌 or 🚀 where appropriate to enhance readability. \n
        - Ensure proper spacing between paragraphs for improved readability. \n
        - If the question contains the word "tablo", format your response using HTML tables: \n
          * Use <table>, <tr>, <td>, <th> tags for table structure \n
          * Add class="finance-table" to the table element \n
          * Use <th> for header cells \n
          * Structure data in a clear and organized manner \n
        - HTML tables are allowed, other HTML tags should be avoided \n\n
        -----------
        START CONTEXT
        ${docContext}
        END CONTEXT
        ------------
        QUESTION:${latestMessage}
        -----------
       `
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      stream: true,
      messages: [template, ...messages],
      temperature: 0.1,
      max_tokens: 300
    })

    const stream = OpenAIStream(response);
    return new StreamingTextResponse(stream);
  }
  catch (err) {
    console.log("error while fetching the record from the collection");
    throw err;
  }
}