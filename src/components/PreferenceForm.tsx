import { useState, useEffect } from 'react';
import axios from "axios";
import toast from 'react-hot-toast';

// Cookie utilities
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
  configuration: string;
  budget: string;
  city: string;
  locality: string;
  readiness: string;
  decisionTime: string;
  name: string;
  email: string;
  phoneNumber: string;
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
        configuration: '',
        readiness: '',
        decisionTime: '',
        name: '',
        email: '',
        phoneNumber: ''
      };
  });

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [shouldHide, setShouldHide] = useState(false);

  useEffect(() => {
    // Check if userPreferences cookie exists
    const savedPreferences = getCookie('userPreferences');
    if (savedPreferences) {
      setShouldHide(true);
    }
  }, []);

  // Check if all required fields are filled
  // const areAllFieldsFilled = (prefs: Preferences): boolean => {
  //   return Object.values(prefs).every(value => value !== '');
  // };

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

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const addToGoogleSheet = async (data:any) => {
    try {
      const response = await axios.post(
        "https://script.google.com/macros/s/AKfycbywu-mQdfsAsqcG2Mh4WYatd3WeD0ScByv9o1rmTq-IsaoM5yJAvmA-2OCX7m68MPSU2g/exec", 
        data,
        {
          headers: {
            "Content-Type": "application/json"
          }
        }
      )
      if(response.status === 200){
        toast.success("Data added successfully!");
      }
      
    } catch (error) {
      console.error("Error:", error);
    }
  };


  const handleAnswer = async (field: keyof Preferences, value: string) => {
    const updatedPreferences = { ...preferences, [field]: value };
    setPreferences(updatedPreferences);

    // Always save to cookies
    setCookie('userPreferences', JSON.stringify(updatedPreferences), 30);
    onSubmit(updatedPreferences);

    // If this is the last field and all fields are filled, save to Supabase
    if(field == 'phoneNumber') {
      try {
        addToGoogleSheet(updatedPreferences)
        console.log(updatedPreferences)
        setIsSubmitted(true);
      } catch (error) {
        console.error('Failed to save preferences:', error);
        // You might want to show an error message to the user here
      }
    } else if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const questionKeyMapping: Record<string, keyof Preferences> = {
    'What is your purpose?': 'purpose',
    'Are you looking to buy or rent?': 'buyOrRent',
    'What type of property?': 'propertyType',
    'What is your budget range?': 'budget',
    'Which city are you looking in?': 'city',
    'Do you have a preferred locality?': 'locality',
    'What is your preferred configuration?': 'configuration',
    'When do you need the property?': 'readiness',
    'How soon do you plan to make a decision?': 'decisionTime',
    'Your name': 'name',
    'Your email': 'email',
    'Your phone number': 'phoneNumber'
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
                  className={`px-3 py-1 text-sm rounded-md ${preferences.buyOrRent === option ? 'bg-blue-500 text-white' : 'bg-gray-100'
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
              {/* <option value="Plot/Land">Plot/Land</option> */}
              {/* <option value="Commercial Property">Commercial Property</option> */}
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

      case 'Which city are you looking in?':
        return (
          <div className="mb-1 w-full">
            <label className="block text-sm font-medium mb-2">Which city are you looking in?</label>
            <select
              value={preferences.city}
              onChange={(e) => handleAnswer('city', e.target.value)}
              className="w-full p-1 text-sm border rounded-md"
            >
              <option value="">Select</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Delhi">Delhi</option>
              <option value="Hyderabad">Hyderabad</option>
              <option value="Chennai">Chennai</option>
              <option value="Pune">Pune</option>
            </select>
          </div>
        );

      case 'Do you have a preferred locality?':
        return (
          <div className="mb-1 w-full">
            <label className="block text-sm font-medium mb-2">Do you have a preferred locality?</label>
            <input
              type="text"
              value={preferences.locality}
              onChange={(e) => setPreferences({ ...preferences, locality: e.target.value })}
              onBlur={() => handleAnswer('locality', preferences.locality)}
              placeholder="Enter preferred locality"
              className="w-full p-1 text-sm border rounded-md"
            />
            <div className="flex justify-end">
            <button onClick={handleNext} className="mt-1.5 px-2 py-1 text-xs bg-blue-500 text-white rounded-md">Next</button>
            </div>
            

          </div>
        );

      case 'What is your preferred configuration?':
        return (
          <div className="mb-1 w-full">
            <label className="block text-sm font-medium mb-2">What is your preferred configuration?</label>
            <select
              value={preferences.configuration}
              onChange={(e) => handleAnswer('configuration', e.target.value)}
              className="w-full p-1 text-sm border rounded-md"
            >
              <option value="">Select</option>
              <option value="1 BHK">1 BHK</option>
              <option value="2 BHK">2 BHK</option>
              <option value="3 BHK">3 BHK</option>
              <option value="4 BHK">4 BHK</option>
              <option value="5+ BHK">5+ BHK</option>
            </select>
          </div>
        );

      case 'When do you need the property?':
        return (
          <div className="mb-1 w-full">
            <label className="block text-sm font-medium mb-2">When do you need the property?</label>
            <select
              value={preferences.readiness}
              onChange={(e) => handleAnswer('readiness', e.target.value)}
              className="w-full p-1 text-sm border rounded-md"
            >
              <option value="">Select</option>
              <option value="Immediate">Immediate</option>
              <option value="Within 3 months">Within 3 months</option>
              <option value="3-6 months">3-6 months</option>
              <option value="6-12 months">6-12 months</option>
              <option value="More than 12 months">More than 12 months</option>
            </select>
          </div>
        );

      case 'How soon do you plan to make a decision?':
        return (
          <div className="mb-1 w-full">
            <label className="block text-sm font-medium mb-2">How soon do you plan to make a decision?</label>
            <select
              value={preferences.decisionTime}
              onChange={(e) => handleAnswer('decisionTime', e.target.value)}
              className="w-full p-1 text-sm border rounded-md"
            >
              <option value="">Select</option>
              <option value="Immediately">Immediately</option>
              <option value="Within 1 week">Within 1 week</option>
              <option value="Within 1 month">Within 1 month</option>
              <option value="More than 1 month">More than 1 month</option>
            </select>
          </div>
        );

      case 'Your name':
        return (
          <div className="mb-1 w-full">
            <label className="block text-sm font-medium mb-2">Your name</label>
            <input
              type="text"
              value={preferences.name}
              onChange={(e) => setPreferences({ ...preferences, name: e.target.value })}
              onBlur={() => handleAnswer('name', preferences.name)}
              placeholder="Enter your name"
              className="w-full p-1 text-sm border rounded-md"
            />
            <div className="flex justify-end">
            <button onClick={handleNext} className="mt-1.5 px-2 py-1 text-xs bg-blue-500 text-white rounded-md">Next</button>
            </div>
            

          </div>
        );

      case 'Your email':
        return (
          <div className="mb-1 w-full">
            <label className="block text-sm font-medium mb-2">Your email</label>
            <input
              type="email"
              value={preferences.email}
              onChange={(e) => setPreferences({ ...preferences, email: e.target.value })}
              onBlur={() => handleAnswer('email', preferences.email)}
              placeholder="Enter your email"
              className="w-full p-1 text-sm border rounded-md"
            />
            <div className="flex justify-end">
            <button onClick={handleNext} className="mt-1.5 px-2 py-1 text-xs bg-blue-500 text-white rounded-md">Next</button>
            </div>
            
          </div>
        );

      case 'Your phone number':
        return (
          <div className="mb-1 w-full">
            <label className="block text-sm font-medium mb-2">Your phone number</label>
            <input
              type="tel"
              value={preferences.phoneNumber}
              onChange={(e) => setPreferences({ ...preferences, phoneNumber: e.target.value })}
              onBlur={() => handleAnswer('phoneNumber', preferences.phoneNumber)}
              placeholder="Enter your phone number"
              className="w-full p-1 text-sm border rounded-md"
              pattern="[0-9]*"
              maxLength={10}
            />
            <div className="flex justify-end">
            <button 
              onClick={() => {handleAnswer('phoneNumber', preferences.phoneNumber)
              }} 
              className="mt-1.5 px-2 py-1 text-xs bg-blue-500 text-white rounded-md"
            >
              Submit
            </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (shouldHide) {
    return null;
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