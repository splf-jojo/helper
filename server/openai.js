const OPENAI_API_URL = "https://api.openai.com/v1/responses";
const OPENAI_MODEL = "gpt-5-mini";
const AI_PLANNER_PROMPT =
  "Make me an ideal study schedule so I can prepare well for my upcoming events. Use my weekly schedule and my event schedule. Give me a practical plan with priorities, what to do each week, and what to focus on first.";

function extractOutputText(responseData) {
  const outputText = responseData.output_text?.trim();
  if (outputText) {
    return outputText;
  }

  const messageText = (responseData.output ?? [])
    .flatMap((item) => item.content ?? [])
    .filter((contentPart) => contentPart.type === "output_text")
    .map((contentPart) => contentPart.text)
    .join("\n\n")
    .trim();

  return messageText;
}

export async function requestAiStudyPlan({ apiKey, weeklySchedule, eventSchedule }) {
  if (!apiKey) {
    throw new Error("Missing OPENAI_API_KEY in the server environment.");
  }

  const response = await fetch(OPENAI_API_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: OPENAI_MODEL,
      store: false,
      input: [
        {
          role: "developer",
          content: [
            {
              type: "input_text",
              text:
                "You create practical study plans. Use the provided weekly schedule and event schedule. Return a readable plan with short sections, clear priorities, and practical weekly actions."
            }
          ]
        },
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `${AI_PLANNER_PROMPT}\n\nWeekly schedule JSON:\n${JSON.stringify(
                weeklySchedule,
                null,
                2
              )}\n\nEvent schedule JSON:\n${JSON.stringify(eventSchedule, null, 2)}`
            }
          ]
        }
      ]
    })
  });

  const responseData = await response.json();

  if (!response.ok) {
    const apiMessage = responseData.error?.message ?? "OpenAI request failed.";
    throw new Error(apiMessage);
  }

  const text = extractOutputText(responseData);

  if (!text) {
    throw new Error("OpenAI returned an empty response.");
  }

  return text;
}
