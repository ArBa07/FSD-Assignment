import React from 'react';
import { Link } from 'react-router-dom';
import { Member } from '../types';
import { ChevronRight } from 'lucide-react';

interface MemberCardProps {
  member: Member;
}

const MemberCard: React.FC<MemberCardProps> = ({ member }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all hover:shadow-lg hover:translate-y-[-4px]">
      <div className="h-48 overflow-hidden">
        <img 
          src={member.imageUrl} 
          alt={`${member.name}'s profile`} 
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-5">
        <h3 className="text-xl font-bold text-gray-800 mb-1">{member.name}</h3>
        <p className="text-blue-600 font-medium mb-4">{member.role}</p>
        
        <Link 
          to={`/members/${member._id}`} 
          className="flex items-center text-orange-500 font-medium hover:text-orange-600 transition-colors"
        >
          View Details
          <ChevronRight size={18} className="ml-1" />
        </Link>
      </div>
    </div>
  );
};

export default MemberCard;