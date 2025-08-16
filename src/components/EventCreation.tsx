import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Plus, Calendar, User, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { aptosClient } from '../utils/aptosClient';

interface EventCreationProps {
  onEventCreated: () => void;
}

const EventCreation: React.FC<EventCreationProps> = ({ onEventCreated }) => {
  const { signAndSubmitTransaction, account } = useWallet();
  const [eventName, setEventName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!eventName.trim()) {
      toast.error('Please enter an event name');
      return;
    }

    if (!account?.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    setIsCreating(true);

    try {
      const response = await signAndSubmitTransaction({
        type: "entry_function_payload",
        function: `${aptosClient.MODULE_ADDRESS}::ProofOfAttendance::create_event`,
        type_arguments: [],
        arguments: [Array.from(new TextEncoder().encode(eventName.trim()))]
      });
      
      // Wait for transaction confirmation
      await aptosClient.waitForTransaction(response.hash);
      
      toast.success('Event created successfully!');
      setEventName('');
      onEventCreated();
    } catch (error: any) {
      console.error('Error creating event:', error);
      
      if (error.message?.includes('RESOURCE_ALREADY_EXISTS')) {
        toast.error('You can only create one event per account. Please use a different account.');
      } else if (error.message?.includes('rejected')) {
        toast.error('Transaction was rejected by user');
      } else {
        toast.error('Failed to create event. Please try again.');
      }
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-8">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-4">
          <Plus className="h-6 w-6 text-white" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Create New Event</h2>
          <p className="text-gray-600">Start a new event and let attendees claim their badges</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="eventName" className="block text-sm font-medium text-gray-700 mb-2">
            Event Name
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              id="eventName"
              value={eventName}
              onChange={(e) => setEventName(e.target.value)}
              placeholder="Enter your event name..."
              className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 text-gray-900 placeholder-gray-500"
              maxLength={100}
              disabled={isCreating}
              required
            />
          </div>
          <p className="mt-2 text-sm text-gray-500">
            Choose a descriptive name for your event (max 100 characters)
          </p>
        </div>

        {account?.address && (
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="flex items-center">
              <User className="h-5 w-5 text-gray-400 mr-2" />
              <div>
                <p className="text-sm font-medium text-gray-700">Event Organizer</p>
                <p className="text-sm text-gray-500 font-mono">{account.address}</p>
              </div>
            </div>
          </div>
        )}

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Important Note</h3>
              <div className="mt-2 text-sm text-blue-700">
                <p>Each wallet address can only create one event. Make sure your event name is exactly what you want!</p>
              </div>
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={isCreating || !eventName.trim()}
          className="w-full flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
        >
          {isCreating ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Creating Event...
            </>
          ) : (
            <>
              <Plus className="h-5 w-5 mr-2" />
              Create Event
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default EventCreation;