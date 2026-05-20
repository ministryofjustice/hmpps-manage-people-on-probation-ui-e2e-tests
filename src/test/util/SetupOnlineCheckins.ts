export interface MPoPCheckinDetails {
  date: string;
  frequency: string;
  preference: string;
}

const definitions: Record<string, string> = {
  YES: "Yes",
  NO: "No",
  EMAIL: "Email",
  TEXT: "Text message",
  PHONE: "Text message",
  EVERY_WEEK: "Every week",
  EVERY_2_WEEKS: "Every 2 weeks",
  EVERY_4_WEEKS: "Every 4 weeks",
  EVERY_8_WEEKS: "Every 8 weeks",
  VERY_WELL: "Very well",
  WELL: "Well",
  NOT_GREAT: "Not great",
  STRUGGLING: "Struggling",
  MENTAL_HEALTH: "Mental health",
  ALCOHOL: "Alcohol",
  DRUGS: "Drugs",
  HOUSING: "Housing",
  MONEY: "Money",
  SUPPORT_SYSTEM: "Support system",
  OTHER: "Other",
  NO_HELP: "No, I do not need help",
};

export default function getUserFriendlyString(key: string): string {
  if (!key) {
    return "";
  }
  if (typeof key !== "string") {
    return key;
  }
  return definitions[key.trim().toUpperCase()] ?? key;
}
