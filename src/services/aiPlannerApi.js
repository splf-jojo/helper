export async function askAiPlanner({ weeklySchedule, eventSchedule }) {
  const response = await fetch("/api/ai-planner", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      weeklySchedule,
      eventSchedule
    })
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.error ??
        "Could not get an AI study plan right now. Check your API key and try again."
    );
  }

  return data.text;
}
