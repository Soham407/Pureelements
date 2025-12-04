import React from 'react';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { CreditCard } from 'lucide-react';

interface Props {
  register: UseFormRegister<any>;
  errors: FieldErrors<any>;
}

const PaymentSection: React.FC<Props> = ({ register, errors }) => {
  return (
    <div className="bg-white p-6 md:p-8 shadow-sm rounded-sm">
      <div className="flex items-center gap-3 mb-6 border-b border-gray-100 pb-4">
         <CreditCard className="text-[#8B7E66]" />
         <h2 className="font-serif text-xl font-bold text-gray-800">Payment Method</h2>
      </div>
      
      <div className="space-y-4">
         <label className={`flex items-center gap-4 border p-4 rounded-sm cursor-pointer transition-colors ${!errors.paymentMethod ? 'border-gray-200' : 'border-red-300'}`}>
            <input type="radio" value="UPI" {...register('paymentMethod')} className="accent-[#8B7E66] w-5 h-5" />
            <div>
               <span className="font-bold text-gray-800">UPI (Google Pay / PhonePe)</span>
               <p className="text-xs text-gray-500">Instant payment via QR Code</p>
            </div>
         </label>

         <label className={`flex items-center gap-4 border p-4 rounded-sm cursor-pointer transition-colors ${!errors.paymentMethod ? 'border-gray-200' : 'border-red-300'}`}>
            <input type="radio" value="CARD" {...register('paymentMethod')} className="accent-[#8B7E66] w-5 h-5" />
            <div>
               <span className="font-bold text-gray-800">Credit / Debit Card</span>
               <p className="text-xs text-gray-500">Visa, Mastercard, Rupay</p>
            </div>
         </label>

         <label className={`flex items-center gap-4 border p-4 rounded-sm cursor-pointer transition-colors ${!errors.paymentMethod ? 'border-gray-200' : 'border-red-300'}`}>
            <input type="radio" value="COD" {...register('paymentMethod')} className="accent-[#8B7E66] w-5 h-5" />
            <div>
               <span className="font-bold text-gray-800">Cash on Delivery</span>
               <p className="text-xs text-gray-500">Pay when you receive the order</p>
            </div>
         </label>
         {errors.paymentMethod && <p className="text-red-500 text-xs mt-1">{errors.paymentMethod.message as string}</p>}
      </div>
    </div>
  );
};

export default PaymentSection;
