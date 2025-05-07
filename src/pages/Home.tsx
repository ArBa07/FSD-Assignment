import React from 'react';
import { Link } from 'react-router-dom';
import { UserPlus, Users } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 min-h-[calc(100vh-76px)] p-8">
      <div className="max-w-4xl mx-auto">
        <section className="text-center mb-12 py-8">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
            Welcome to <span className="text-blue-600">TeamSync</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Manage your student team members efficiently with our comprehensive team management application.
          </p>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <Link 
            to="/add-member"
            className="group bg-white rounded-xl shadow-md hover:shadow-lg p-8 flex flex-col items-center transition-all duration-300 hover:translate-y-[-4px]"
          >
            <div className="bg-blue-100 p-4 rounded-full mb-4 group-hover:bg-blue-600 transition-colors">
              <UserPlus size={36} className="text-blue-600 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">Add Member</h2>
            <p className="text-gray-600 text-center">
              Add new team members with their roles, contact information, and profile pictures.
            </p>
          </Link>

          <Link 
            to="/members"
            className="group bg-white rounded-xl shadow-md hover:shadow-lg p-8 flex flex-col items-center transition-all duration-300 hover:translate-y-[-4px]"
          >
            <div className="bg-orange-100 p-4 rounded-full mb-4 group-hover:bg-orange-500 transition-colors">
              <Users size={36} className="text-orange-500 group-hover:text-white transition-colors" />
            </div>
            <h2 className="text-2xl font-bold mb-3 text-gray-800">View Members</h2>
            <p className="text-gray-600 text-center">
              Browse all team members, view their profiles, and access their contact information.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;