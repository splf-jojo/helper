import { readFileSync } from "node:fs";
import path from "node:path";

function parseEnvFile(envContent) {
  return envContent.split(/\r?\n/).reduce((acc, line) => {
    const trimmedLine = line.trim();

    if (!trimmedLine || trimmedLine.startsWith("#")) {
      return acc;
    }

    const separatorIndex = trimmedLine.indexOf("=");
    if (separatorIndex === -1) {
      return acc;
    }

    const key = trimmedLine.slice(0, separatorIndex).trim();
    const rawValue = trimmedLine.slice(separatorIndex + 1).trim();
    const normalizedValue = rawValue.replace(/^['\"]|['\"]$/g, "").trim();

    acc[key] = normalizedValue;
    return acc;
  }, {});
}

export function getProjectEnvValue(projectRoot, envKey) {
  try {
    const envPath = path.join(projectRoot, ".env");
    const envContent = readFileSync(envPath, "utf8");
    const envValues = parseEnvFile(envContent);
    return envValues[envKey] ?? "";
  } catch (error) {
    return "";
  }
}
