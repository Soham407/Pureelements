import React from 'react';
import { Address } from '../../types';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { Truck, Plus } from 'lucide-react';

interface Props {
  savedAddresses: Address[];
  selectedAddressId: string | null;
  onSelectAddress: (address: Address) => void;
  onAddNewAddress: () => void;
  showAddressForm: boolean;
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const AddressSection: React.FC<Props> = ({
  savedAddresses,
  selectedAddressId,
  onSelectAddress,
  onAddNewAddress,
  showAddressForm,
  register,
  errors
}) => {
  return (
    <div className="bg-white p-6 md:p-8 shadow-sm rounded-sm">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
         <Truck className="text-[#8B7E66]" />
         <h2 className="font-serif text-xl font-bold text-gray-800">Shipping Details</h2>
      </div>

      {/* Saved Addresses Selection */}
      {savedAddresses.length > 0 && (
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-700 uppercase mb-3">Select Delivery Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {savedAddresses.map(addr => (
              <div 
                key={addr.id}
                onClick={() => onSelectAddress(addr)}
                className={`border p-4 rounded-sm cursor-pointer transition-all relative ${selectedAddressId === addr.id ? 'border-[#8B7E66] bg-[#FFFBF2] ring-1 ring-[#8B7E66]' : 'border-gray-200 hover:border-gray-300'}`}
              >
                {addr.isDefault && <span className="absolute top-2 right-2 text-[10px] bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded uppercase font-bold">Default</span>}
                <p className="font-bold text-gray-800 text-sm">{addr.fullName}</p>
                <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                  {addr.addressLine1}, {addr.city}
                </p>
                <p className="text-xs text-gray-600">{addr.pincode}</p>
              </div>
            ))}
            <button
              type="button"
              onClick={onAddNewAddress}
              className={`border border-dashed p-4 rounded-sm flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-[#8B7E66] hover:border-[#8B7E66] transition-colors ${showAddressForm ? 'border-[#8B7E66] text-[#8B7E66] bg-gray-50' : 'border-gray-300'}`}
            >
              <Plus size={20} />
              <span className="text-xs font-bold uppercase">Add New Address</span>
            </button>
          </div>
        </div>
      )}
      
      <div className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${(savedAddresses.length > 0 && !showAddressForm && selectedAddressId) ? 'opacity-50 pointer-events-none grayscale' : ''}`}>
         <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Full Name</label>
            <input {...register('fullName')} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none bg-white" placeholder="John Doe" />
            {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName.message as string}</p>}
         </div>
         <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Phone Number</label>
            <input {...register('phone')} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none bg-white" placeholder="+91 98765 43210" />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone.message as string}</p>}
         </div>
         <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Email Address</label>
            <input type="email" {...register('email')} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none bg-white" placeholder="john@example.com" />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message as string}</p>}
         </div>
         <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">Street Address</label>
            <input {...register('address')} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none bg-white" placeholder="Flat No, Building, Street" />
            {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address.message as string}</p>}
         </div>
         <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">City</label>
            <input {...register('city')} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none bg-white" placeholder="Pune" />
            {errors.city && <p className="text-red-500 text-xs mt-1">{errors.city.message as string}</p>}
         </div>
         <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 uppercase">Pincode</label>
            <input {...register('pincode')} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none bg-white" placeholder="411001" />
            {errors.pincode && <p className="text-red-500 text-xs mt-1">{errors.pincode.message as string}</p>}
         </div>
         <div className="space-y-1 md:col-span-2">
            <label className="text-xs font-bold text-gray-500 uppercase">State</label>
            <select {...register('state')} className="w-full border border-gray-200 p-3 rounded-sm focus:border-[#8B7E66] outline-none bg-white">
               <option value="">Select State</option>
               <option value="Maharashtra">Maharashtra</option>
               <option value="Delhi">Delhi</option>
               <option value="Karnataka">Karnataka</option>
               <option value="Gujarat">Gujarat</option>
            </select>
            {errors.state && <p className="text-red-500 text-xs mt-1">{errors.state.message as string}</p>}
         </div>
      </div>
    </div>
  );
};

export default AddressSection;
