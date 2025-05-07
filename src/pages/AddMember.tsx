import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { createMember } from '../services/api';
import { Upload, AlertCircle } from 'lucide-react';

type FormData = {
  name: string;
  role: string;
  email: string;
  contact: string;
};

const AddMember: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
    
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    } else {
      setPreviewUrl(null);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!imageFile) {
      setError('Profile image is required');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('name', data.name);
      formData.append('role', data.role);
      formData.append('email', data.email);
      formData.append('contact', data.contact);
      formData.append('image', imageFile);

      await createMember(formData);
      navigate('/members', { state: { message: 'Member added successfully!' } });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800 mb-8">Add New Team Member</h2>
      
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 flex items-start">
          <AlertCircle className="mr-2 flex-shrink-0 mt-0.5" size={20} />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left column: Text fields */}
          <div className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-gray-700 font-medium mb-2">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="John Doe"
                {...register('name', { required: 'Name is required' })}
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="role" className="block text-gray-700 font-medium mb-2">
                Role
              </label>
              <input
                id="role"
                type="text"
                className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.role ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="Developer"
                {...register('role', { required: 'Role is required' })}
              />
              {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-2">
                Email
              </label>
              <input
                id="email"
                type="email"
                className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="john.doe@example.com"
                {...register('email', { 
                  required: 'Email is required',
                  pattern: {
                    value: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
                    message: 'Please enter a valid email'
                  }
                })}
              />
              {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
            </div>

            <div>
              <label htmlFor="contact" className="block text-gray-700 font-medium mb-2">
                Contact Number
              </label>
              <input
                id="contact"
                type="text"
                className={`w-full border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.contact ? 'border-red-500' : 'border-gray-300'}`}
                placeholder="+1 (123) 456-7890"
                {...register('contact', { required: 'Contact number is required' })}
              />
              {errors.contact && <p className="text-red-500 text-sm mt-1">{errors.contact.message}</p>}
            </div>
          </div>
          
          {/* Right column: Image upload */}
          <div>
            <label className="block text-gray-700 font-medium mb-2">
              Profile Image
            </label>
            <div 
              className={`border-2 border-dashed rounded-lg p-4 text-center h-64 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${!imageFile && !previewUrl ? 'border-gray-300' : 'border-blue-300'}`}
              onClick={() => document.getElementById('image-upload')?.click()}
            >
              {previewUrl ? (
                <div className="h-full w-full relative">
                  <img 
                    src={previewUrl} 
                    alt="Profile preview" 
                    className="h-full w-full object-cover rounded-md" 
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                    <p className="text-white">Click to change image</p>
                  </div>
                </div>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400 mb-3" />
                  <p className="text-gray-500">Click to upload profile image</p>
                  <p className="text-gray-400 text-sm mt-1">JPG, PNG up to 5MB</p>
                </>
              )}
              <input
                id="image-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageChange}
              />
            </div>
            {!imageFile && !previewUrl && (
              <p className="text-red-500 text-sm mt-1">Profile image is required</p>
            )}
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="button"
            className="px-6 py-2 mr-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            onClick={() => navigate(-1)}
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center ${isSubmitting ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {isSubmitting ? (
              <>
                <span className="animate-spin h-4 w-4 mr-2 border-t-2 border-blue-200 border-r-2 rounded-full"></span>
                Saving...
              </>
            ) : 'Add Member'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMember;