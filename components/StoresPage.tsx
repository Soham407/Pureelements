
import React, { useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StoreData {
  id: number;
  name: string;
  address: string[];
  contact: string;
  images: string[];
  mapLink: string;
}

const STORES_DATA: StoreData[] = [
  {
    id: 1,
    name: "Mahabaleshwar - New",
    address: ["134 Dr. Sabne Road, Main Market, Mahabaleshwar."],
    contact: "9371007202",
    images: [
        "https://picsum.photos/id/20/1200/500", 
        "https://picsum.photos/id/21/1200/500",
        "https://picsum.photos/id/22/1200/500"
    ],
    mapLink: "#"
  },
  {
    id: 2,
    name: "Mahabaleshwar",
    address: ["Near Police Station, Main Market, Mahabaleshwar."],
    contact: "9371007201",
    images: [
        "https://picsum.photos/id/30/1200/500", 
        "https://picsum.photos/id/31/1200/500",
        "https://picsum.photos/id/32/1200/500"
    ],
    mapLink: "#"
  },
  {
    id: 3,
    name: "Koregaon Park, Pune",
    address: ["Sunderban Resort, Lane 1, Koregaon Park, Pune."],
    contact: "9371007205",
    images: [
        "https://picsum.photos/id/40/1200/500", 
        "https://picsum.photos/id/41/1200/500", 
        "https://picsum.photos/id/42/1200/500"
    ],
    mapLink: "#"
  },
  {
    id: 4,
    name: "Westend Mall, Aundh, Pune",
    address: ["HGS 25, Westend Mall, Parihar Chowk, Aundh, Pune."],
    contact: "9371007207",
    images: [
        "https://picsum.photos/id/50/1200/500", 
        "https://picsum.photos/id/51/1200/500",
        "https://picsum.photos/id/52/1200/500"
    ],
    mapLink: "#"
  },
  {
    id: 5,
    name: "Phoenix Marketcity, Viman Nagar, Pune",
    address: ["Lower Ground Floor, Opp. Timezone, Phoenix Mall, Viman Nagar, Pune."],
    contact: "9371007204",
    images: [
        "https://picsum.photos/id/60/1200/500", 
        "https://picsum.photos/id/61/1200/500", 
        "https://picsum.photos/id/62/1200/500"
    ],
    mapLink: "#"
  },
  {
    id: 6,
    name: "The Pavillion Mall, Shivajinagar, Pune",
    address: ["Second Floor, The Pavillion Mall, Senapati Bapat Road, Shivajinagar, Pune"],
    contact: "9371007203",
    images: [
        "https://picsum.photos/id/70/1200/500", 
        "https://picsum.photos/id/71/1200/500",
        "https://picsum.photos/id/72/1200/500"
    ],
    mapLink: "#"
  },
  {
    id: 7,
    name: "Phoenix Mall of Millennium, Wakad, Pune",
    address: [
        "Shop No S-51, Second Floor, Phoenix Mall of the Millennium,",
        "Behind Sayaji Hotel, Wakad, Pune - 411057."
    ],
    contact: "9371007206",
    images: [
        "https://picsum.photos/id/80/1200/500", 
        "https://picsum.photos/id/81/1200/500",
        "https://picsum.photos/id/82/1200/500"
    ],
    mapLink: "#"
  }
];

const LeafDivider = () => (
    <div className="flex justify-center items-center my-12 opacity-40">
        <svg width="200" height="20" viewBox="0 0 200 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M100 10C80 10 70 0 50 0C30 0 20 10 0 10" stroke="#5D6D55" strokeWidth="1.5"/>
            <path d="M100 10C120 10 130 0 150 0C170 0 180 10 200 10" stroke="#5D6D55" strokeWidth="1.5"/>
            <path d="M100 10C80 10 70 20 50 20C30 20 20 10 0 10" stroke="#5D6D55" strokeWidth="1.5"/>
            <path d="M100 10C120 10 130 20 150 20C170 20 180 10 200 10" stroke="#5D6D55" strokeWidth="1.5"/>
            <circle cx="100" cy="10" r="3" fill="#5D6D55"/>
            <path d="M90 10 L80 5 M110 10 L120 5 M90 10 L80 15 M110 10 L120 15" stroke="#5D6D55" strokeLinecap="round"/>
        </svg>
    </div>
);

const StoreItem: React.FC<{ store: StoreData, isLast: boolean }> = ({ store, isLast }) => {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const nextImage = () => {
        setCurrentImageIndex((prev) => (prev + 1) % store.images.length);
    };

    const prevImage = () => {
        setCurrentImageIndex((prev) => (prev === 0 ? store.images.length - 1 : prev - 1));
    };

    return (
        <div className="flex flex-col items-center animate-fade-in">
            {/* Header Info */}
            <div className="text-center mb-6">
                <h3 className="font-sans text-xl md:text-2xl text-[#3A5A40] mb-2 font-medium">
                    {store.name}
                </h3>
                <div className="text-xs md:text-sm text-gray-600 font-light leading-relaxed">
                    {store.address.map((line, i) => (
                        <p key={i}>{line}</p>
                    ))}
                    <p className="mt-1">Contact - {store.contact}</p>
                </div>
            </div>

            {/* Image Carousel */}
            <div className="w-full max-w-5xl relative group aspect-[16/7] md:aspect-[16/6] bg-gray-100 mb-8 overflow-hidden rounded-sm shadow-md">
                <div 
                  className="flex h-full transition-transform duration-500 ease-out"
                  style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                >
                    {store.images.map((img, idx) => (
                        <div key={idx} className="w-full h-full flex-shrink-0">
                            <img src={img} alt={`${store.name} - View ${idx + 1}`} className="w-full h-full object-cover" />
                        </div>
                    ))}
                </div>

                {/* Navigation Arrows */}
                {store.images.length > 1 && (
                    <>
                        <button 
                            onClick={prevImage}
                            className="absolute left-2 md:left-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <button 
                            onClick={nextImage}
                            className="absolute right-2 md:right-4 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-md text-gray-700 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                        >
                            <ChevronRight size={20} />
                        </button>
                        
                        {/* Dots */}
                        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                            {store.images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => setCurrentImageIndex(idx)}
                                    className={`w-1.5 h-1.5 rounded-full transition-all ${
                                        idx === currentImageIndex ? 'bg-white w-4' : 'bg-white/60'
                                    }`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>

            {/* Google Map Button */}
            <button className="flex items-center gap-3 px-6 py-2.5 bg-white border border-[#5D6D55] rounded-sm hover:shadow-lg transition-all group">
                 {/* Google Maps Icon Placeholder (SVG) */}
                 <div className="w-6 h-6">
                    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" fill="#EA4335" />
                        <circle cx="12" cy="9" r="2.5" fill="white" />
                    </svg>
                 </div>
                 <span className="text-[#5D6D55] text-xs font-bold uppercase tracking-widest group-hover:text-[#3A5A40]">
                    Get Store Location
                 </span>
            </button>

            {/* Divider */}
            {!isLast && <LeafDivider />}
        </div>
    );
};

const StoresPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-white pb-20 font-sans">
      
      {/* Page Header */}
      <div className="pt-16 pb-12 text-center bg-[#FFFBF2] mb-12">
        <h1 className="font-serif text-3xl md:text-4xl text-[#3A5A40]">Pure Elements Flagship Stores</h1>
      </div>

      <div className="container mx-auto px-4 max-w-6xl">
         {STORES_DATA.map((store, index) => (
            <StoreItem 
                key={store.id} 
                store={store} 
                isLast={index === STORES_DATA.length - 1} 
            />
         ))}
      </div>
      
      {/* Decorative End */}
      <div className="flex justify-center mt-20 opacity-30">
          <LeafDivider />
      </div>
    </div>
  );
};

export default StoresPage;
