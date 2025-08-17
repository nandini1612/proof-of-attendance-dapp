import React, { useState } from 'react';
import { useWallet } from '@aptos-labs/wallet-adapter-react';
import { Calendar, Users, Award, Loader2, RefreshCw, User, Clock } from 'lucide-react';
import toast from 'react-hot-toast';
import { aptosClient } from '../utils/aptosClient';
import { Event } from '../types';

interface EventsListProps {
  events: Event[];
  userAttendance: string[];
  onRefresh: () => void;
  loading: boolean;
}

const EventsList: React.FC<EventsListProps> = ({ 
  events, 
  userAttendance, 
  onRefresh, 
  loading 
}) => {
  const { signAndSubmitTransaction, account } = useWallet();
  const [claimingEvents, setClaimingEvents] = useState<Set<string>>(new Set());

  const handleClaimAttendance = async (organizerAddress: string) => {
    if (!account?.address) {
      toast.error('Please connect your wallet first');
      return;
    }

    if (userAttendance.includes(organizerAddress)) {
      toast.error('You have already claimed attendance for this event');
      return;
    }

    setClaimingEvents(prev => new Set(prev).add(organizerAddress));

    try {
      const response = await signAndSubmitTransaction({
        data: {
          function: `${aptosClient.MODULE_ADDRESS}::ProofOfAttendance::claim_attendance`,
          typeArguments: [],
          functionArguments: [organizerAddress],
        },
      });

      // Wait for transaction confirmation
      await aptosClient.waitForTransaction(response.hash);

      toast.success('Attendance claimed successfully! 🎉');
      onRefresh();
    } catch (error: any) {
      console.error('Error claiming attendance:', error);

      if (error.message?.includes('ALREADY_ATTENDED')) {
        toast.error('You have already claimed attendance for this event');
      } else if (error.message?.includes('EVENT_NOT_FOUND')) {
        toast.error('Event not found');
      } else if (error.message?.includes('rejected')) {
        toast.error('Transaction was rejected by user');
      } else {
        toast.error('Failed to claim attendance. Please try again.');
      }
    } finally {
      setClaimingEvents(prev => {
        const newSet = new Set(prev);
        newSet.delete(organizerAddress);
        return newSet;
      });
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp * 1000).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-purple-600 mr-3" />
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Calendar className="h-6 w-6 text-purple-600 mr-3" />
          <h2 className="text-2xl font-bold text-gray-800">
            Available Events ({events.length})
          </h2>
        </div>
        <button
          onClick={onRefresh}
          className="flex items-center px-4 py-2 text-purple-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {events.length === 0 ? (
        <div className="bg-white rounded-xl shadow-lg p-12 text-center">
          <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">No Events Yet</h3>
          <p className="text-gray-600 mb-6">
            Be the first to create an event and start collecting attendance badges!
          </p>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => {
            const hasAttended = userAttendance.includes(event.organizer);
            const isClaiming = claimingEvents.has(event.organizer);
            const isOwnEvent = account?.address === event.organizer;

            return (
              <div
                key={event.organizer}
                className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-2">
                        {event.name}
                      </h3>
                      <div className="flex items-center text-sm text-gray-500 mb-2">
                        <User className="h-4 w-4 mr-1" />
                        <span className="font-mono">{formatAddress(event.organizer)}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        <span>{formatDate(event.createdAt)}</span>
                      </div>
                    </div>
                    {hasAttended && (
                      <div className="flex-shrink-0 ml-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <Award className="h-4 w-4 text-green-600" />
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-gray-600">
                      <Users className="h-4 w-4 mr-2" />
                      <span className="text-sm">
                        {event.attendanceCount} attendee{event.attendanceCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                    {isOwnEvent && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded-full">
                        Your Event
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleClaimAttendance(event.organizer)}
                    disabled={hasAttended || isClaiming || isOwnEvent}
                    className={`w-full flex items-center justify-center px-4 py-3 rounded-lg font-medium transition-all duration-200 ${
                      hasAttended
                        ? 'bg-green-100 text-green-700 cursor-not-allowed'
                        : isOwnEvent
                        ? 'bg-gray-100 text-gray-500 cursor-not-allowed'
                        : isClaiming
                        ? 'bg-purple-100 text-purple-600 cursor-not-allowed'
                        : 'bg-gradient-to-r from-purple-600 to-blue-600 text-white hover:from-purple-700 hover:to-blue-700 shadow-lg hover:shadow-xl'
                    }`}
                  >
                    {isClaiming ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Claiming...
                      </>
                    ) : hasAttended ? (
                      <>
                        <Award className="h-4 w-4 mr-2" />
                        Attended
                      </>
                    ) : isOwnEvent ? (
                      <>
                        <User className="h-4 w-4 mr-2" />
                        Your Event
                      </>
                    ) : (
                      <>
                        <Award className="h-4 w-4 mr-2" />
                        Claim Attendance
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default EventsList;