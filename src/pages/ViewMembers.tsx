import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { getAllMembers } from '../services/api';
import { Member } from '../types';
import MemberCard from '../components/MemberCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { CheckCircle2 } from 'lucide-react';

const ViewMembers: React.FC = () => {
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  
  const location = useLocation();

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getAllMembers();
        setMembers(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch members';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchMembers();
    
    // Check for notification message in location state
    if (location.state?.message) {
      setNotification(location.state.message);
      // Clear the message after 5 seconds
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [location]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Team Members</h2>
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto p-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">Team Members</h2>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p>Error: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Team Members</h2>
      
      {notification && (
        <div className="mb-6 p-4 bg-green-50 border-l-4 border-green-500 text-green-700 flex items-center animate-fadeIn">
          <CheckCircle2 className="mr-2" size={20} />
          <span>{notification}</span>
        </div>
      )}
      
      {members.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-600 text-lg">No team members found. Add your first team member!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {members.map((member) => (
            <MemberCard key={member._id} member={member} />
          ))}
        </div>
      )}
    </div>
  );
};

export default ViewMembers;