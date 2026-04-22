import { useMemo, useState } from "react";
import { getWeeklyScheduleSource } from "../lib/data";
import { askAiPlanner } from "../services/aiPlannerApi";

const EMPTY_RESPONSE_TEXT = "AI response will appear here.";
const FALLBACK_ERROR_TEXT =
  "Could not get an AI study plan right now. Check OPENAI_API_KEY in .env and try again.";

export default function AIPlannerPage({ plans }) {
  const [responseText, setResponseText] = useState(EMPTY_RESPONSE_TEXT);
  const [isLoading, setIsLoading] = useState(false);
  const [errorText, setErrorText] = useState("");
  const weeklySchedule = useMemo(() => getWeeklyScheduleSource(), []);

  async function handleAskAi() {
    setIsLoading(true);
    setErrorText("");

    try {
      const aiResponse = await askAiPlanner({
        weeklySchedule,
        eventSchedule: plans
      });

      setResponseText(aiResponse);
    } catch (error) {
      setErrorText(
        error instanceof Error && error.message ? error.message : FALLBACK_ERROR_TEXT
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="space-y-4">
      <div>
        <h2 className="text-2xl font-semibold text-slate-900">AI Planner</h2>
      </div>

      <button
        type="button"
        onClick={handleAskAi}
        disabled={isLoading}
        className="rounded-md bg-slate-900 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-slate-700 disabled:cursor-not-allowed disabled:bg-slate-400"
      >
        {isLoading ? "Loading..." : "Ask AI"}
      </button>

      <div className="min-h-40 rounded-md border border-border bg-white px-4 py-3 text-sm leading-6 text-slate-700 whitespace-pre-wrap">
        {errorText ? (
          <p className="text-red-600">{errorText || FALLBACK_ERROR_TEXT}</p>
        ) : (
          responseText
        )}
      </div>
    </main>
  );
}
