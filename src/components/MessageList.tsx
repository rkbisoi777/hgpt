// import React, { useState, useEffect, useRef  } from 'react';
// import { Message } from '../types';
// import { PropertyGrid } from './PropertyGrid';
// import { SuggestedQuestions } from './SuggestedQuestions';
// import { generateSuggestions } from '../utils/questionSuggestions';
// import { PreferenceForm } from './PreferenceForm';


// interface MessageListProps {
//   messages: Message[];
//   isLoading: boolean;
//   onSendMessage: (message: string) => void;
// }

// function formatText(content: string) {
//   return content.split('\n').map((line, i) => (
//     <React.Fragment key={i}>
//       {line.startsWith('•') ? (
//         <li className="ml-4">{line.substring(1).trim()}</li>
//       ) : (
//         <p>{line}</p>
//       )}
//        {i < content.split('\n').length - 1 }
//       {/* {i < content.split('\n').length - 1 && <br />} */}
//     </React.Fragment>
//   ));
// }

// export function MessageList({ messages, isLoading, onSendMessage }: MessageListProps) {

//   const questions = [
//     'What is your purpose?',
//     'Are you looking to buy or rent?',
//     'What type of property?',
//     'What is your budget range?',
//   ];

//   const [answers, setAnswers] = useState<Record<string, string>>({});
//   const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});


//   // Commit answers after user input completes
//   const handlePreferenceSubmit = () => {
//     setAnswers((prev) => ({
//       ...prev,
//       ...draftAnswers,
//     }));
//   };

//   const handleDraftChange = (question: string, answer: string) => {
//     setDraftAnswers((prev) => ({
//       ...prev,
//       [question]: answer,
//     }));
//   };

//   const isPreferenceFilled = questions.every((q) => answers[q]);

//   const lastMessageRef = useRef<HTMLDivElement | null>(null);

//   // Scroll to the latest message whenever messages change
//   useEffect(() => {
//     if (lastMessageRef.current) {
//       lastMessageRef.current.scrollIntoView({
//         behavior: 'smooth',
//         block: 'start',
//       });
//     }
//   }, [messages]);


//   return (
//     <div className="flex-1 overflow-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
//       {messages.map((message, index) => (
//         <div key={message.id}>


//           <div className={`${
//             message.role === 'user' 
//               ? 'ml-auto bg-gradient-to-r from-cyan-500 to-blue-500 text-white max-w-[60%]' 
//               : 'bg-gray-100 max-w-full'
//           } p-1.5 px-2 rounded-lg`}>
//             <div className="text-sm whitespace-pre-wrap">
//               {formatText(message.content)}
//             </div>

//           </div>
//           {message.properties && (
//               <div className="mt-2 mb-1">
//                 <PropertyGrid properties={message.properties} />
//               </div>
//             )}
//            {message.role === 'assistant' && !isPreferenceFilled && (
//             <PreferenceForm
//               questions={questions}
//               answers={answers}
//               onSubmit={handlePreferenceSubmit}
//             />
//           )}
//           {message.role === 'assistant' && (
//             <div className="mt-2">
//                <SuggestedQuestions
//               questions={generateSuggestions(messages[messages.length - 2]?.content || '')}
//               onQuestionClick={onSendMessage}
//             />
//             </div>

//           )}

//           {((index === messages.length - 2) && (message.role === 'assistant')) && <div ref={lastMessageRef} />}
//           {(index === messages.length - 3) && <div ref={lastMessageRef} />}

//         </div>
//       ))}
//       {isLoading && (

//       <div className="bg-gray-50 rounded-full flex items-center justify-start min-w-8 gap-2">
//   {['-0.3s', '-0.15s', '0s'].map((delay, index) => (
//     <div
//       key={index}
//       className={`bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center p-1 animate-bounce`}
//       style={{ animationDelay: delay }}
//     >
//       <img
//         src="https://i.postimg.cc/cHgZjqp8/output-onlinepngtools.png"
//         alt="HouseGPT"
//         className="w-3 h-3"
//       />
//     </div>
//   ))}
// </div>
//       )}
//     </div>
//   );
// }


import { useState, useEffect, useRef } from 'react';
import { Message } from '../types';
import { PropertyGrid } from './property/PropertyGrid';
import { SuggestedQuestions } from './SuggestedQuestions';
import { PreferenceForm } from './PreferenceForm';
import MemoizedReactMarkdown from './markdown';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (message: string) => void;
  suggestedQuestions: string[]
}

function formatText(content: string) {
  console.log("Before Formatting", content);
  const pattern = /Suggested questions:[\s\S]*/i;
  return content.replace(pattern, '').trim();
}


export function MessageList({ messages, isLoading, onSendMessage, suggestedQuestions }: MessageListProps) {
  const questions = [
    'What is your purpose?',
    'Are you looking to buy or rent?',
    'What type of property?',
    'What is your budget range?',
  ];

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [draftAnswers, setDraftAnswers] = useState<Record<string, string>>({});
  const [streamingComplete, setStreamingComplete] = useState<Record<string, boolean>>({});
  const [showSuggestions, setShowSuggestions] = useState<Record<string, boolean>>({});
  const lastMessageRef = useRef<HTMLDivElement | null>(null);

  const handlePreferenceSubmit = () => {
    setAnswers((prev) => ({
      ...prev,
      ...draftAnswers,
    }));
  };

  const handleDraftChange = (question: string, answer: string) => {
    setDraftAnswers((prev) => ({
      ...prev,
      [question]: answer,
    }));
  };

  const isPreferenceFilled = questions.every((q) => answers[q]);

  // Track streaming completion for each message
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === 'assistant') {
      const streamingTimeoutId = setTimeout(() => {
        setStreamingComplete(prev => ({
          ...prev,
          [lastMessage.id]: true
        }));
      }, 100);

      // Add delay for suggestions
      const suggestionsTimeoutId = setTimeout(() => {
        setShowSuggestions(prev => ({
          ...prev,
          [lastMessage.id]: true
        }));
      }, 1000); // Delay showing suggestions by 500ms after streaming completes

      return () => {
        clearTimeout(streamingTimeoutId);
        clearTimeout(suggestionsTimeoutId);
      };
    }
  }, [messages]);

  // Scroll to the latest message
  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  }, [messages, streamingComplete, showSuggestions]);

  return (
    <div className="flex-1 overflow-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
      {messages.map((message, index) => (
        <div key={message.id}>
          <div className={`${message.role === 'user'
            ? 'ml-auto bg-gradient-to-r from-cyan-500 to-blue-500 text-white max-w-[80%]'
            : 'bg-gray-100 max-w-[80%]'
            } p-1.5 px-2 rounded-lg`}>
            {(isLoading && (message.role === 'assistant')) && (
              <div className="mt-1 rounded-full flex items-center justify-start min-w-8 gap-2">

                {['-0.3s', '-0.15s', '0s'].map((delay, index) => (
                  <div
                    key={index}
                    className={`bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center p-1 animate-bounce`}
                    style={{ animationDelay: delay }}
                  >
                    <img
                      src="https://i.postimg.cc/cHgZjqp8/output-onlinepngtools.png"
                      alt="HouseGPT"
                      className="w-3 h-3"
                    />
                  </div>
                ))}
              </div>
            )}
            <div className="text-sm whitespace-pre-wrap py-2 px-1">
              <MemoizedReactMarkdown content={formatText(message.content)} />
              {/* {formatText(message.content)} */}
            </div>
          </div>

          {message.role === 'assistant' && streamingComplete[message.id] && (
            <>

              {message.properties && (
                <div className="mt-2 mb-1">
                  <PropertyGrid properties={message.properties} />
                  {!isPreferenceFilled && (
                    <PreferenceForm
                      questions={questions}
                      answers={answers}
                      onSubmit={handlePreferenceSubmit}
                    />
                  )}
                  {showSuggestions[message.id] && (
                    <div className="mt-2">
                       <SuggestedQuestions
                      questions={suggestedQuestions}
                        //questions={generateSuggestions(messages[messages.length - 2]?.content || '')}
                        onQuestionClick={onSendMessage}
                      /> 
                    </div>
                  )}
                </div>

              )}

            </>
          )}

          {((index === messages.length - 2) && (message.role === 'assistant')) && <div ref={lastMessageRef} />}
          {(index === messages.length - 3) && <div ref={lastMessageRef} />}
        </div>
      ))}

      {/* {isLoading && (
        <div className="bg-gray-50 rounded-full flex items-center justify-start min-w-8 gap-2">

          {['-0.3s', '-0.15s', '0s'].map((delay, index) => (
            <div
              key={index}
              className={`bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full flex items-center justify-center p-1 animate-bounce`}
              style={{ animationDelay: delay }}
            >
              <img
                src="https://i.postimg.cc/cHgZjqp8/output-onlinepngtools.png"
                alt="HouseGPT"
                className="w-3 h-3"
              />
            </div>
          ))}
        </div>
      )} */}

    </div>
  );
}