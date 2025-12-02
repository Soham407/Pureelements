import React, { useState, useEffect } from 'react';
import { X, Loader2 } from 'lucide-react';
import { Address } from '../types';
import { addressesService } from '../lib/database';

interface AddressFormProps {
  userId: string;
  address?: Address | null;
  onClose: () => void;
  onSuccess: () => void;
}

const AddressForm: React.FC<AddressFormProps> = ({ userId, address, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    pincode: '',
    isDefault: false
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (address) {
      setFormData({
        fullName: address.fullName,
        phone: address.phone,
        addressLine1: address.addressLine1,
        addressLine2: address.addressLine2 || '',
        city: address.city,
        state: address.state,
        pincode: address.pincode,
        isDefault: address.isDefault
      });
    }
  }, [address]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (address) {
        await addressesService.update(address.id, { ...formData, userId });
      } else {
        await addressesService.create({ ...formData, userId });
      }
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error saving address:', err);
      setError(err.message || 'Failed to save address. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      
      <div className="bg-white w-full max-w-lg relative z-10 rounded-sm shadow-2xl overflow-hidden animate-fade-in-up">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="font-serif text-xl text-gray-800">
            {address ? 'Edit Address' : 'Add New Address'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-800 transition-colors">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Full Name</label>
              <input
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 focus:border-[#8B7E66] focus:outline-none rounded-sm text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Phone Number</label>
              <input
                type="tel"
                name="phone"
                required
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 focus:border-[#8B7E66] focus:outline-none rounded-sm text-sm"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Address Line 1</label>
            <input
              type="text"
              name="addressLine1"
              required
              value={formData.addressLine1}
              onChange={handleChange}
              placeholder="House No, Building, Street"
              className="w-full px-4 py-2 border border-gray-200 focus:border-[#8B7E66] focus:outline-none rounded-sm text-sm"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Address Line 2 (Optional)</label>
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              placeholder="Area, Landmark"
              className="w-full px-4 py-2 border border-gray-200 focus:border-[#8B7E66] focus:outline-none rounded-sm text-sm"
            />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">City</label>
              <input
                type="text"
                name="city"
                required
                value={formData.city}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 focus:border-[#8B7E66] focus:outline-none rounded-sm text-sm"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">State</label>
              <input
                type="text"
                name="state"
                required
                value={formData.state}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 focus:border-[#8B7E66] focus:outline-none rounded-sm text-sm"
              />
            </div>
            <div className="space-y-1 col-span-2 md:col-span-1">
              <label className="text-xs font-bold text-gray-600 uppercase tracking-wide">Pincode</label>
              <input
                type="text"
                name="pincode"
                required
                value={formData.pincode}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-200 focus:border-[#8B7E66] focus:outline-none rounded-sm text-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 pt-2">
            <input
              type="checkbox"
              id="isDefault"
              name="isDefault"
              checked={formData.isDefault}
              onChange={handleChange}
              className="w-4 h-4 text-[#8B7E66] border-gray-300 rounded focus:ring-[#8B7E66]"
            />
            <label htmlFor="isDefault" className="text-sm text-gray-700">Set as default address</label>
          </div>

          {error && <p className="text-red-500 text-xs">{error}</p>}

          <div className="pt-4 flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 text-gray-700 font-bold uppercase tracking-wider text-xs hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-3 bg-[#2C2C2C] text-white font-bold uppercase tracking-wider text-xs hover:bg-black transition-colors flex items-center justify-center gap-2"
            >
              {isLoading ? <Loader2 size={16} className="animate-spin" /> : 'Save Address'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddressForm;
