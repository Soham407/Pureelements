
import React from 'react';
import SectionHeader from './SectionHeader';

interface Props {
  type: 'PRIVACY' | 'TERMS' | 'SHIPPING' | 'BLOG' | 'PAYMENT' | 'REFUND';
}

const InfoPage: React.FC<Props> = ({ type }) => {
  const getContent = () => {
    switch(type) {
      case 'PRIVACY':
        return {
          title: "Privacy Policy",
          content: (
            <div className="space-y-4">
              <p>At Pure Elements, we value your privacy and are committed to protecting your personal data.</p>
              <h3 className="font-bold text-lg mt-4">1. Data Collection</h3>
              <p>We collect information you provide directly to us when you create an account, make a purchase, or communicate with us.</p>
              <h3 className="font-bold text-lg mt-4">2. Usage of Information</h3>
              <p>We use your information to process transactions, send updates, and improve our services.</p>
              <h3 className="font-bold text-lg mt-4">3. Security</h3>
              <p>We implement security measures to ensure your data is safe.</p>
            </div>
          )
        };
      case 'TERMS':
        return {
          title: "Terms & Conditions",
          content: (
            <div className="space-y-4">
              <p>Welcome to Pure Elements. By using our website, you agree to the following terms.</p>
              <h3 className="font-bold text-lg mt-4">1. General</h3>
              <p>These terms apply to all users of the site.</p>
              <h3 className="font-bold text-lg mt-4">2. Products</h3>
              <p>All products are subject to availability. We reserve the right to limit quantities.</p>
              <h3 className="font-bold text-lg mt-4">3. Pricing</h3>
              <p>Prices are subject to change without notice.</p>
            </div>
          )
        };
      case 'SHIPPING':
        return {
            title: "Shipping & Delivery",
            content: (
                <div className="space-y-4">
                    <p>We ship across India via trusted courier partners.</p>
                    <h3 className="font-bold text-lg mt-4">Timelines</h3>
                    <p>Standard delivery takes 3-7 business days depending on the location.</p>
                    <h3 className="font-bold text-lg mt-4">Charges</h3>
                    <p>Free shipping on orders above ₹999.</p>
                </div>
            )
        };
      case 'PAYMENT':
        return {
          title: "Payment Policy",
          content: (
            <div className="space-y-4">
              <p>All prices on this web site are processed in Indian Rupees.</p>
              <h3 className="font-bold text-lg mt-4">Payment Options</h3>
              <ul className="list-disc pl-5 space-y-2">
                  <li><strong>Credit/Debit Cards:</strong> Visa, MasterCard, and Rupay.</li>
                  <li><strong>UPI:</strong> Google Pay, PhonePe, Paytm, and other BHIM UPI apps.</li>
                  <li><strong>Net Banking:</strong> All major Indian banks.</li>
                  <li><strong>Cash on Delivery (COD):</strong> Available for select pin codes.</li>
              </ul>
              <h3 className="font-bold text-lg mt-4">Security</h3>
              <p>All transactions are protected by SSL (Secure Sockets Layer) and Secure Data Encryption.</p>
            </div>
          )
        };
      case 'REFUND':
        return {
          title: "Refund & Returns Policy",
          content: (
            <div className="space-y-4">
              <p>It is our intention to satisfy our customers. For this reason, we will gladly issue a full refund for any full priced unopened merchandise that is returned within 7 days from the date of delivery.</p>
              <h3 className="font-bold text-lg mt-4">Returns</h3>
              <p>In case the product you have received is 'Damaged' or 'Defective', we will issue a refund after it is proved that the product is defective.</p>
              <h3 className="font-bold text-lg mt-4">Cancellations</h3>
              <p>If you want to cancel your order, you need to inform us by email at <strong>customercare@pureelements.in</strong> with your order number within 8 hours of placing the order.</p>
            </div>
          )
        };
      default:
        return { title: "Blog", content: <p>Coming Soon...</p> };
    }
  };

  const { title, content } = getContent();

  return (
    <div className="container mx-auto px-4 py-16 min-h-screen max-w-4xl">
       <SectionHeader title={title} />
       <div className="bg-white p-8 md:p-12 shadow-sm rounded-sm text-gray-600 leading-relaxed">
         {content}
       </div>
    </div>
  );
};

export default InfoPage;
