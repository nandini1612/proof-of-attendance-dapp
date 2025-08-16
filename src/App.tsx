import React, { useState, useEffect } from 'react';
import { AptosWalletAdapterProvider } from '@aptos-labs/wallet-adapter-react';
import { Toaster } from 'react-hot-toast';
import { Wallet, Users, Award, Calendar } from 'lucide-react';
import WalletSelector from './components/WalletSelector';
import EventCreation from './components/EventCreation';
import EventsList from './components/EventsList';
import AttendanceHistory from './components/AttendanceHistory';
import Header from './components/Header';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { aptosClient } from './utils/aptosClient';
import { Event } from './types';

const AppContent: React.FC = () => {
  const { connected, account } = useWallet();
  const [events, setEvents] = useState<Event[]>([]);
  const [userAttendance, setUserAttendance] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'events' | 'create' | 'profile'>('events');

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const eventOrganizers = await aptosClient.getEvents();
      const eventsData: Event[] = [];

      for (const organizer of eventOrganizers) {
        try {
          const eventDetails = await aptosClient.getEventDetails(organizer);
          if (eventDetails) {
            eventsData.push({
              organizer,
              ...eventDetails
            });
          }
        } catch (error) {
          console.warn(`Failed to fetch event details for ${organizer}:`, error);
        }
      }

      setEvents(eventsData);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch user attendance
  const fetchUserAttendance = async () => {
    if (!account?.address) return;

    try {
      const attendance: string[] = [];
      for (const event of events) {
        const hasAttended = await aptosClient.hasAttended(account.address, event.organizer);
        if (hasAttended) {
          attendance.push(event.organizer);
        }
      }
      setUserAttendance(attendance);
    } catch (error) {
      console.error('Error fetching user attendance:', error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (connected && events.length > 0) {
      fetchUserAttendance();
    }
  }, [connected, events, account?.address]);

  const refreshData = () => {
    fetchEvents();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        {!connected ? (
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 text-center">
            <Wallet className="h-16 w-16 text-purple-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Connect Your Wallet
            </h2>
            <p className="text-gray-600 mb-6">
              Connect your Aptos wallet to start creating events and claiming attendance badges.
            </p>
            <WalletSelector />
          </div>
        ) : (
          <div className="max-w-6xl mx-auto">
            {/* Navigation Tabs */}
            <div className="bg-white rounded-lg shadow-sm mb-8">
              <div className="flex border-b">
                <button
                  onClick={() => setActiveTab('events')}
                  className={`flex items-center px-6 py-4 font-medium rounded-t-lg transition-colors ${
                    activeTab === 'events'
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  <Calendar className="h-5 w-5 mr-2" />
                  Events
                </button>
                <button
                  onClick={() => setActiveTab('create')}
                  className={`flex items-center px-6 py-4 font-medium rounded-t-lg transition-colors ${
                    activeTab === 'create'
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  <Users className="h-5 w-5 mr-2" />
                  Create Event
                </button>
                <button
                  onClick={() => setActiveTab('profile')}
                  className={`flex items-center px-6 py-4 font-medium rounded-t-lg transition-colors ${
                    activeTab === 'profile'
                      ? 'text-purple-600 border-b-2 border-purple-600 bg-purple-50'
                      : 'text-gray-600 hover:text-purple-600'
                  }`}
                >
                  <Award className="h-5 w-5 mr-2" />
                  My Badges ({userAttendance.length})
                </button>
              </div>
            </div>

            {/* Tab Content */}
            {activeTab === 'events' && (
              <EventsList 
                events={events} 
                userAttendance={userAttendance} 
                onRefresh={refreshData}
                loading={loading}
              />
            )}
            
            {activeTab === 'create' && (
              <EventCreation onEventCreated={refreshData} />
            )}
            
            {activeTab === 'profile' && (
              <AttendanceHistory 
                events={events.filter(event => userAttendance.includes(event.organizer))}
                userAddress={account?.address || ''}
              />
            )}
          </div>
        )}
      </div>
      
      <Toaster position="top-right" />
    </div>
  );
};

const App: React.FC = () => {
  return (
    <AptosWalletAdapterProvider autoConnect={true}>
      <AppContent />
    </AptosWalletAdapterProvider>
  );
};

export default App;