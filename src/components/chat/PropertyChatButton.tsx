import React, { useState, useEffect, useRef } from 'react';
import { X } from 'lucide-react';
import { PropertyChatDialog } from './PropertyChatDialog';
import { Property } from '../../types';

interface PropertyChatButtonProps {
  property: Property;
}

export function PropertyChatButton({ property }: PropertyChatButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const chatButtonRef = useRef<HTMLButtonElement | null>(null);

  // Prevent scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      closeButtonRef.current?.focus();
    } else {
      document.body.style.overflow = 'auto';
      chatButtonRef.current?.focus();
    }

    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  return (
    <>
      {/* Chat Button */}
      <button
        ref={chatButtonRef}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 p-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-white rounded-full shadow-lg hover:bg-blue-600 transition-colors z-40"
        aria-label="Chat about this property"
        aria-expanded={isOpen}
        aria-controls="property-chat-dialog"
      >
        <div className="w-8 h-8">
          <img
            src="https://i.postimg.cc/cHgZjqp8/output-onlinepngtools.png"
            alt="HouseGPT"
          />
        </div>
      </button>

      {/* Chat Modal */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center p-4 z-50"
          role="dialog"
          aria-modal="true"
          id="property-chat-dialog"
        >
          <div className="bg-white w-full max-w-lg rounded-lg sm:rounded-lg shadow-xl flex flex-col h-[600px] max-h-[80vh]">
            {/* Modal Header */}
            <div className="p-4 border-b flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img
                  src={property.imageUrl}
                  alt={property.title}
                  className="w-12 h-12 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{property.title}</h3>
                  <p className="text-sm text-gray-500 truncate">{property.location}</p>
                </div>
              </div>
              <button
                ref={closeButtonRef}
                onClick={() => setIsOpen(false)}
                className="p-2 hover:bg-gray-100 rounded-full"
                aria-label="Close chat dialog"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <PropertyChatDialog property={property} />
          </div>
        </div>
      )}
    </>
  );
}
