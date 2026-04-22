import { requestAiStudyPlan } from "./openai.js";

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (error) {
        reject(new Error("Invalid JSON body."));
      }
    });

    req.on("error", reject);
  });
}

function writeJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

export function createAiPlannerHandler({ getApiKey }) {
  return async function aiPlannerHandler(req, res, next) {
    const requestPath = req.url?.split("?")[0];

    if (requestPath !== "/api/ai-planner") {
      return next();
    }

    if (req.method !== "POST") {
      res.setHeader("Allow", "POST");
      return writeJson(res, 405, { error: "Method not allowed." });
    }

    try {
      const { weeklySchedule, eventSchedule } = await readJsonBody(req);

      if (!weeklySchedule || !eventSchedule) {
        return writeJson(res, 400, {
          error: "Both weeklySchedule and eventSchedule are required."
        });
      }

      const apiKey = typeof getApiKey === "function" ? getApiKey() : "";
      const text = await requestAiStudyPlan({
        apiKey,
        weeklySchedule,
        eventSchedule
      });

      return writeJson(res, 200, { text });
    } catch (error) {
      return writeJson(res, 500, {
        error:
          error instanceof Error
            ? error.message
            : "Could not generate the AI study plan."
      });
    }
  };
}
