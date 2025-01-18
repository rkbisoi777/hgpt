import React, { useState, useEffect } from 'react';

// Utility function to manage cookies
const setCookie = (name: string, value: string, days: number) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires.toUTCString()};path=/`;
};

const getCookie = (name: string): string | null => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return decodeURIComponent(parts.pop()!.split(';')[0]);
  return null;
};

interface Preferences {
  purpose: string;
  buyOrRent: string;
  propertyType: string;
  budget: string;
  city: string;
  locality: string;
  transport: string;
  configuration: string;
  readiness: string;
  amenities: string[];
  facilities: string;
  gated: boolean | null;
  environment: string[];
  appreciation: boolean | null;
  insights: boolean | null;
  additionalInfo: string;
  decisionTime: string;
}

interface PreferenceFormProps {
  onSubmit: (preferences: Preferences) => void;
  answers: Record<string, string>;
  questions: string[];
}

export function PreferenceForm({ onSubmit, answers, questions }: PreferenceFormProps) {
  const [preferences, setPreferences] = useState<Preferences>(() => {
    const savedPreferences = getCookie('userPreferences');
    return savedPreferences
      ? JSON.parse(savedPreferences)
      : {
          purpose: '',
          buyOrRent: '',
          propertyType: '',
          budget: '',
          city: '',
          locality: '',
          transport: '',
          configuration: '',
          readiness: '',
          amenities: [],
          facilities: '',
          gated: null,
          environment: [],
          appreciation: null,
          insights: null,
          additionalInfo: '',
          decisionTime: '',
        };
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isPreferencesExist, setIsPreferencesExist] = useState(false);

  useEffect(() => {
    // Check if userPreferences cookie already exists
    const savedPreferences = getCookie('userPreferences');
    if (savedPreferences) {
      setIsPreferencesExist(true);
    }
  }, []);

  useEffect(() => {
    // Check if preferences are fully filled
    const isAllFilled = questions.every((question) => {
      const key = questionKeyMapping[question];
      return preferences[key as keyof Preferences];
    });

    if (isAllFilled) {
      setIsSubmitted(true);
    }
  }, [preferences, questions]);

  const handleAnswer = (field: keyof Preferences, value: string) => {
    setPreferences((prev) => {
      const updatedPreferences = { ...prev, [field]: value };
      setCookie('userPreferences', JSON.stringify(updatedPreferences), 30); // Save for 30 days
      onSubmit(updatedPreferences);
      return updatedPreferences;
    });

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setIsSubmitted(true);
    }
  };

  const questionKeyMapping: Record<string, keyof Preferences> = {
    'What is your purpose?': 'purpose',
    'Are you looking to buy or rent?': 'buyOrRent',
    'What type of property?': 'propertyType',
    'What is your budget range?': 'budget',
  };

  const renderQuestion = () => {
    const currentQuestion = questions[currentQuestionIndex];

    switch (currentQuestion) {
      case 'What is your purpose?':
        return (
          <div className="mb-1 w-full">
            <label className="block text-sm font-medium mb-2">What is your purpose?</label>
            <select
              value={preferences.purpose}
              onChange={(e) => handleAnswer('purpose', e.target.value)}
              className="w-full p-1 text-sm border rounded-md"
            >
              <option value="">Select</option>
              <option value="Investment">Investment</option>
              <option value="Own Stay">Own Stay</option>
              <option value="Rental Income">Rental Income</option>
            </select>
          </div>
        );
      case 'Are you looking to buy or rent?':
        return (
          <div className="mb-1 w-full">
            <label className="block text-sm font-medium mb-2">Are you looking to buy or rent?</label>
            <div className="flex gap-2">
              {['Buy', 'Rent'].map((option) => (
                <button
                  type="button"
                  key={option}
                  className={`px-3 py-1 text-sm rounded-md ${
                    preferences.buyOrRent === option ? 'bg-blue-500 text-white' : 'bg-gray-100'
                  }`}
                  onClick={() => handleAnswer('buyOrRent', option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        );
      case 'What type of property?':
        return (
          <div className="mb-1 w-full">
            <label className="block text-sm font-medium mb-2">What type of property?</label>
            <select
              value={preferences.propertyType}
              onChange={(e) => handleAnswer('propertyType', e.target.value)}
              className="w-full p-1 text-sm border rounded-md"
            >
              <option value="">Select</option>
              <option value="Apartment/Flat">Apartment/Flat</option>
              <option value="Independent House/Villa">Independent House/Villa</option>
              <option value="Plot/Land">Plot/Land</option>
              <option value="Commercial Property">Commercial Property</option>
            </select>
          </div>
        );
      case 'What is your budget range?':
        return (
          <div className="mb-1 w-full">
            <label className="block text-sm font-medium mb-2">What is your budget range?</label>
            <select
              value={preferences.budget}
              onChange={(e) => handleAnswer('budget', e.target.value)}
              className="w-full p-1 text-sm border rounded-md"
            >
              <option value="">Select</option>
              <option value="Below ₹50 Lakhs">Below ₹50 Lakhs</option>
              <option value="₹50 Lakhs - ₹1 Crore">₹50 Lakhs - ₹1 Crore</option>
              <option value="₹1 Crore - ₹2 Crore">₹1 Crore - ₹2 Crore</option>
              <option value="Above ₹2 Crore">Above ₹2 Crore</option>
            </select>
          </div>
        );
      default:
        return null;
    }
  };

  if (isPreferencesExist) {
    return null; // Hide the component if preferences already exist in cookies
  }


  return (
    <div className="mt-2">
      {isSubmitted ? (
        <div className="text-center w-full max-w-[80%]">
          <h2 className="text-sm text-blue-500 font-semibold">
            Thank you for sharing your preferences! HouseGPT will show the best properties based on your requirements.
          </h2>
        </div>
      ) : (
        <div className="flex justify-start px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 max-w-[80%]">
          {renderQuestion()}
        </div>
      )}
    </div>
  );
}
