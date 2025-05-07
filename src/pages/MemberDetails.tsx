import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMemberById } from '../services/api';
import { Member } from '../types';
import LoadingSpinner from '../components/LoadingSpinner';
import { ChevronLeft, Mail, Phone, Calendar, User } from 'lucide-react';

const MemberDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [member, setMember] = useState<Member | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMember = async () => {
      if (!id) return;
      
      try {
        const data = await getMemberById(id);
        setMember(data);
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Failed to fetch member details';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchMember();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Members
        </button>
        <LoadingSpinner />
      </div>
    );
  }

  if (error || !member) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
        >
          <ChevronLeft size={20} className="mr-1" />
          Back to Members
        </button>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
          <p>Error: {error || 'Member not found'}</p>
        </div>
      </div>
    );
  }

  // Format date
  const formattedDate = new Date(member.createdAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center text-blue-600 hover:text-blue-800 mb-6 transition-colors"
      >
        <ChevronLeft size={20} className="mr-1" />
        Back to Members
      </button>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="md:flex">
          <div className="md:w-1/3">
            <img 
              src={member.imageUrl} 
              alt={`${member.name}'s profile`} 
              className="h-full w-full object-cover"
            />
          </div>
          
          <div className="p-8 md:w-2/3">
            <div className="uppercase tracking-wide text-sm text-blue-600 font-semibold">
              Team Member
            </div>
            <h1 className="text-3xl font-bold text-gray-800 mt-2 mb-1">{member.name}</h1>
            <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {member.role}
            </div>
            
            <div className="mt-8 space-y-4">
              <div className="flex items-center">
                <Mail className="text-gray-500 mr-3" size={20} />
                <span className="text-gray-700">{member.email}</span>
              </div>
              
              <div className="flex items-center">
                <Phone className="text-gray-500 mr-3" size={20} />
                <span className="text-gray-700">{member.contact}</span>
              </div>
              
              <div className="flex items-center">
                <Calendar className="text-gray-500 mr-3" size={20} />
                <span className="text-gray-700">Member since {formattedDate}</span>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-gray-200">
              <h3 className="flex items-center text-gray-700 font-medium">
                <User className="text-gray-500 mr-2" size={18} />
                About
              </h3>
              <p className="mt-2 text-gray-600">
                {member.name} serves as a {member.role.toLowerCase()} in our team. Contact them directly for any relevant project inquiries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;