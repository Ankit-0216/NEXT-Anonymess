import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import { NextResponse } from "next/server";

// Create an OpenAI API client (that's edge friendly!)
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Set the runtime to edge for best performance
export const runtime = "edge";

export async function POST(req: Request) {
  try {
    // const { messages } = await req.json();

    const prompt =
      "Create a list of three open-ended and engaging questions formatted as a single string. Each questions should be separated by '||'. These questions are for an anonymus social messaging platform, like Qooh.me, and sshould be suitable for a diverse audience. Avoid persoanal or sensitive topics, focusing instead on universal themes that encourage frielndly interaction. For example, your output should be structured like this:'What's a hobby you've recently started?|| If you could have dinner with any historical figure, who would it be?||What's a simple thing that make soyu happy?'. Ensure the questions are intruiging, faster curiosity, and contribute to a positive and weelcoming conversational enviroment";

    // Ask OpenAI for a streaming chat completion given the prompt
    const response = await openai.completions.create({
      model: "gpt-3.5-turbo-instruct",
      max_tokens: 400,
      stream: true,
      prompt,
    });

    // Convert the response into a friendly text-stream
    const stream = OpenAIStream(response);
    // Respond with the stream
    return new StreamingTextResponse(stream);
  } catch (error) {
    if (error instanceof OpenAI.APIError) {
      const { name, status, headers, message } = error;
      return NextResponse.json(
        {
          name,
          status,
          headers,
          message,
        },
        { status }
      );
    } else {
      console.log("Unexpected Error Occurred", error);
      throw error;
    }
  }
}