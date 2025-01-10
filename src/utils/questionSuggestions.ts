type SuggestionRule = {
  pattern: RegExp;
  suggestions: string[];
};

const suggestionRules: SuggestionRule[] = [
  {
    pattern: /2bhk|3bhk|flat|apartment/i,
    suggestions: [
      "What are the nearby schools?",
      "How is the connectivity?",
      "What are the amenities?",
      "Show similar properties"
    ]
  },
  {
    pattern: /rera|registration/i,
    suggestions: [
      "How to verify RERA registration?",
      "What documents to check?",
      "RERA benefits for buyers"
    ]
  },
  {
    pattern: /invest|investment/i,
    suggestions: [
      "Expected price appreciation",
      "Rental yield in this area",
      "Upcoming developments",
      "Best time to invest"
    ]
  },
  {
    pattern: /mumbai|delhi|bangalore|pune/i,
    suggestions: [
      "Best localities to live",
      "Property rates trend",
      "Upcoming metro projects",
      "New launches in this city"
    ]
  }
];

export function generateSuggestions(message: string): string[] {
  const matchingRules = suggestionRules.filter(rule => 
    rule.pattern.test(message)
  );

  if (!matchingRules.length) {
    return [
      "Show properties under 1 crore",
      "Best areas for families",
      "New projects launching soon",
      "Resale vs New booking"
    ];
  }

  return Array.from(new Set(
    matchingRules.flatMap(rule => rule.suggestions)
  )).slice(0, 4);
}