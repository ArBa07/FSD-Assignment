import React from 'react';
import { NavLink } from 'react-router-dom';
import { Users } from 'lucide-react';

const Header: React.FC = () => {
  return (
    <header className="bg-blue-600 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center mb-4 md:mb-0">
          <Users size={32} className="mr-3" />
          <h1 className="text-2xl font-bold">Student Team Management</h1>
        </div>
        
        <nav>
          <ul className="flex space-x-6">
            <li>
              <NavLink 
                to="/" 
                className={({ isActive }) => 
                  isActive 
                    ? "font-medium border-b-2 border-white pb-1" 
                    : "hover:text-blue-200 transition-colors"
                }
              >
                Home
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/add-member" 
                className={({ isActive }) => 
                  isActive 
                    ? "font-medium border-b-2 border-white pb-1" 
                    : "hover:text-blue-200 transition-colors"
                }
              >
                Add Member
              </NavLink>
            </li>
            <li>
              <NavLink 
                to="/members" 
                className={({ isActive }) => 
                  isActive 
                    ? "font-medium border-b-2 border-white pb-1" 
                    : "hover:text-blue-200 transition-colors"
                }
              >
                View Members
              </NavLink>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;