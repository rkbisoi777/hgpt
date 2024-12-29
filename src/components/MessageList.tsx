// import React from 'react';
// import { Message } from '../types';
// import { PropertyGrid } from './PropertyGrid';

// interface MessageListProps {
//   messages: Message[];
//   isLoading: boolean;
// }

// export function MessageList({ messages, isLoading }: MessageListProps) {
//   return (
//     <div className="flex-1 overflow-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
//       {messages.map((message) => (
//         <div
//           key={message.id}
//           className={`${
//             message.role === 'user' ? 'ml-auto bg-blue-500 text-white' : 'bg-gray-100'
//           } p-3 rounded-lg max-w-[80%]`}
//         >
//           <p>{message.content}</p>
//           {message.properties && (
//             <div className="mt-4">
//               <PropertyGrid properties={message.properties} />
//             </div>
//           )}
//         </div>
//       ))}
//       {isLoading && (
//         <div className="bg-gray-100 p-3 rounded-lg">
//           <div className="animate-pulse">Thinking...</div>
//         </div>
//       )}
//     </div>
//   );
// }


import React from 'react';
import { Message } from '../types';
import { PropertyGrid } from './PropertyGrid';

interface MessageListProps {
  messages: Message[];
  isLoading: boolean;
}

function formatText(content: string) {
  // Split the content based on custom markers (bold and highlighted)
 const parts = content.split(/(\*\*.*?\*\*|==.*?==|\*.*?)/g).map((part, index) => {
  if (part.startsWith('**') && part.endsWith('**')) {
    return <span key={index} className="font-bold">{part.slice(2, -2)}</span>;
  } else if (part.startsWith('==') && part.endsWith('==')) {
    return <span key={index} className="bg-yellow-200 p-1 rounded">{part.slice(2, -2)}</span>;
  }

   part.replace(/^\* (.*?)$/gm, (match, p1) => (
      <p1>-{p1}</p1>
    ));
  return part;
});

  return parts;
}

export function MessageList({ messages, isLoading }: MessageListProps) {
  return (
    <div className="flex-1 overflow-auto p-4 space-y-4 max-w-4xl mx-auto w-full">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`${
            message.role === 'user' ? 'ml-auto bg-blue-500 text-white' : 'bg-gray-100'
          } p-3 rounded-lg max-w-[80%]`}
        >
          <p className="whitespace-pre-wrap">
            {formatText(message.content)}
          </p>
          {message.properties && (
            <div className="mt-4">
              <PropertyGrid properties={message.properties} />
            </div>
          )}
        </div>
      ))}
      {isLoading && (
        <div className="bg-gray-100 p-3 rounded-lg">
          <div className="animate-pulse">Searching the best properties for you..</div>
        </div>
      )}
    </div>
  );
}


