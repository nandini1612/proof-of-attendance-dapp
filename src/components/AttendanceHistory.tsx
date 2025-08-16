import React from 'react';
import { Award, Calendar, User, Trophy, Clock } from 'lucide-react';
import { Event } from '../types';

interface AttendanceHistoryProps {
  events: Event[];
  userAddress: string;
}

const AttendanceHistory: React.FC<AttendanceHistoryProps> = ({ events, userAddress }) => {
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

  const sortedEvents = [...events].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="flex items-center mb-6">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-blue-500 rounded-xl flex items-center justify-center mr-4">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">My Attendance Badges</h2>
            <p className="text-gray-600">Events you've attended and badges you've earned</p>
          </div>
        </div>

        {/* Stats Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
            <div className="flex items-center">
              <Award className="h-8 w-8 text-purple-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-800">{events.length}</p>
                <p className="text-sm text-gray-600">Total Badges</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {events.length > 0 ? formatDate(Math.max(...events.map(e => e.createdAt))).split(',')[0] : '-'}
                </p>
                <p className="text-sm text-gray-600">Latest Event</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-50 to-red-50 rounded-lg p-4">
            <div className="flex items-center">
              <User className="h-8 w-8 text-orange-600 mr-3" />
              <div>
                <p className="text-sm font-mono text-gray-800">{formatAddress(userAddress)}</p>
                <p className="text-sm text-gray-600">Your Address</p>
              </div>
            </div>
          </div>
        </div>

        {/* Badge Collection */}
        {events.length === 0 ? (
          <div className="text-center py-12">
            <Award className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">No Badges Yet</h3>
            <p className="text-gray-600 mb-6">
              Start attending events to collect your first attendance badge!
            </p>
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-lg">
              <Calendar className="h-4 w-4 mr-2" />
              <span>Browse available events to get started</span>
            </div>
          </div>
        ) : (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Your Badge Collection ({events.length})
            </h3>
            <div className="grid gap-4">
              {sortedEvents.map((event) => (
                <div
                  key={event.organizer}
                  className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 border border-purple-100 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-blue-500 rounded-lg flex items-center justify-center mr-3">
                          <Award className="h-5 w-5 text-white" />
                        </div>
                        <div>
                          <h4 className="text-lg font-semibold text-gray-800">{event.name}</h4>
                          <p className="text-sm text-gray-600">Attendance Badge Earned</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <User className="h-4 w-4 mr-2" />
                          <span>Organizer: </span>
                          <span className="font-mono ml-1">{formatAddress(event.organizer)}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <Clock className="h-4 w-4 mr-2" />
                          <span>Event Date: {formatDate(event.createdAt)}</span>
                        </div>
                        
                        <div className="flex items-center text-sm text-gray-600">
                          <Calendar className="h-4 w-4 mr-2" />
                          <span>Total Attendees: {event.attendanceCount}</span>
                        </div>
                        
                        <div className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          <span className="text-green-700 font-medium">Verified Attendance</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-shrink-0 ml-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                        <Trophy className="h-8 w-8 text-white" />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AttendanceHistory;