
import React from 'react';
import SectionHeader from './SectionHeader';
import RevealOnScroll from './RevealOnScroll';

const AboutUs: React.FC = () => {
  return (
    <div className="bg-white min-h-screen font-sans text-gray-700 pb-20">
      
      {/* Header Banner */}
      <div className="bg-[#FFFBF2] py-16 mb-10">
        <div className="container mx-auto px-4">
             <SectionHeader title="About Us" subtitle="Our Journey" />
        </div>
      </div>

      <div className="container mx-auto px-4 max-w-6xl space-y-20 md:space-y-32">
        
        {/* Section 1: Our Story */}
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
            <div className="w-full md:w-1/2">
              <div className="relative p-2 border-2 border-[#8B7E66]/20 rounded-sm">
                <img 
                  src="https://picsum.photos/id/405/800/600" 
                  alt="Founders in store" 
                  className="w-full h-auto object-cover shadow-lg"
                />
              </div>
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl text-gray-800">Our Story</h2>
              <div className="space-y-4 text-sm md:text-base leading-relaxed font-light text-gray-600">
                <p>
                  Welcome to Pure Elements, where all the goodness of nature is discovered from pure ingredients, pure thinking and pure passion. PURE ELEMENTS is an ayurveda based beauty and wellness care system specially crafted for a beautiful YOU! This journey started two decades ago by Dr. Anand Mandhane (MD. Ayu Med) & Dr. Suteja Mandhane (Ayu Med) from their own Spa at Mahabaleshwar, the very heart of nature.
                </p>
                <p>
                  While catering to their spa clients, they realised the need of result-oriented natural beauty products. Their vast experience of spa industry and deep knowledge of ayurveda came handy and they began experimenting with ayurvedic decoctions and herbal extracts in their kitchen. This ultimately evolved into a full-fledged R&D lab and scientific formulations. Huge response from their thousands of happy customers led to a well-known brand, PURE ELEMENTS in a very short time.
                </p>
                <p>
                  The effectiveness of this product line is reflected through the innumerable radiant faces and their trust & love.
                </p>
                <p>
                  As a proud Indian brand, we draw our inspiration from our ancient culture and vedic wisdom. We strongly believe that by combining modern science with traditional wisdom, we can deliver the quality which is at par with the best in the world!
                </p>
                <p>
                  Our founder Dr. Anand Mandhane's in-depth knowledge of ayurvedic herbs and expertise in understanding their use on the human body has been appreciated by thousands of happy customers in the last two decades.
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Section 2: The Formulation */}
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
            <div className="w-full md:w-1/2">
               <div className="relative overflow-hidden shadow-xl rounded-sm group">
                  <img 
                    src="https://picsum.photos/id/250/800/500" 
                    alt="Ayurvedic Formulation" 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-[#8B7E66]/10"></div>
               </div>
            </div>
            <div className="w-full md:w-1/2 space-y-6">
              <h2 className="font-serif text-3xl md:text-4xl text-gray-800">The Formulation</h2>
              <div className="space-y-4 text-sm md:text-base leading-relaxed font-light text-gray-600">
                <p>
                  Every formulation at PURE ELEMENTS is developed personally by Dr. Anand Mandhane, who is a postgraduate in Ayurvedic Medicine and Dr. Suteja Mandhane.
                </p>
                <p>
                  Their combined experience of four decades in the field of Ayurveda and Spa / Beauty industry is the backbone of these formulations.
                </p>
                <p>
                  Every ingredient is thoroughly studied for its efficacy and safety before it makes the way in a formulation.
                </p>
                <p>
                  Dr. Anand & Suteja spend considerable time in their own R&D lab for developing various products. By combining time-tested holistic practices with the latest in technology, every formulation is developed carefully to deliver desired results.
                </p>
                <p>
                  Every formulation goes through multiple trials to get the perfect texture, fragrance, colour or viscosity.
                </p>
                <p>
                  Once the desired product is developed in a lab, it goes for "Stability Testing".
                </p>
                <p>
                  A stringent testing method based on various parameters is followed to ensure that the formulation will remain stable and effective throughout its shelf life.
                </p>
                <p>
                  Our formulations are 100% clean, vegan, and cruelty free and contain no parabens, phthalates, mineral oil, and the other harmful chemicals.
                </p>
                <p className="italic font-medium text-gray-800 border-l-4 border-[#8B7E66] pl-4">
                  At PURE ELEMENTS, we aim towards simplification of skincare and create effective products through the ingredients offered by Mother Nature! Every product comes with a promise of ayurveda – Safety & Performance!
                </p>
              </div>
            </div>
          </div>
        </RevealOnScroll>

        {/* Section 3: Ingredients */}
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
             <div className="w-full md:w-1/2">
                <div className="grid grid-cols-2 gap-2">
                   <img src="https://picsum.photos/id/292/300/300" className="rounded-sm shadow-md" alt="Spices" />
                   <img src="https://picsum.photos/id/306/300/300" className="rounded-sm shadow-md mt-6" alt="Herbs" />
                </div>
             </div>
             <div className="w-full md:w-1/2 space-y-6">
               <h2 className="font-serif text-3xl md:text-4xl text-gray-800">Ingredients</h2>
               <div className="space-y-4 text-sm md:text-base leading-relaxed font-light text-gray-600">
                  <p>The Real Heroes, are selected from ayurvedic texts and picked up from mother nature.</p>
                  <p>Roots / Fruits / Leaves / Flowers / Barks, almost every part of the plant is used in various formulations.</p>
                  <p>Ingredients come in all possible forms ... powders / juices / aqueous extracts / oil extracts / essential oils / raw herbs etc.</p>
                  <p>Their essence is derived sometimes by grinding, sometimes squeezing / cold pressing / roasting / steam distilling / boiling or crushing.</p>
                  <p>These natural treasures are then blended with modern goodies like vitamins / proteins / peptides etc. to enhance the efficacy of a formulation.</p>
                  <p>We carefully select all our ingredients so that they're safe for you, your skin and the environment.</p>
                  <p>All ingredients are sourced in an ethical way and no animal is harmed in the process.</p>
                  <p className="font-bold text-[#8B7E66]">They are Potent, Pure & Safe!</p>
               </div>
             </div>
          </div>
        </RevealOnScroll>

        {/* Section 4: Safety */}
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
             <div className="w-full md:w-1/2">
               <img 
                  src="https://picsum.photos/id/431/600/600" 
                  alt="Safe Ingredients" 
                  className="w-full h-auto rounded-full border-8 border-gray-50 shadow-xl" 
               />
             </div>
             <div className="w-full md:w-1/2 space-y-6">
               <h2 className="font-serif text-3xl md:text-4xl text-gray-800">Safety</h2>
               <div className="space-y-4 text-sm md:text-base leading-relaxed font-light text-gray-600">
                 <p>Safety is the single most important criterion at PURE ELEMENTS while selecting the ingredients and raw materials</p>
                 <p>All our products are free from Paraben Preservatives.</p>
                 <p>We do not use harmful chemicals, petroleum products, paraffin oil, SLS, formaldehydes, phthalates etc.</p>
                 <p>Every ingredient used in our formulations undergoes extensive scrutiny, not only for its friendliness with skin & hair but with the environment also.</p>
               </div>
             </div>
          </div>
        </RevealOnScroll>

        {/* Section 5: Efficacy */}
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
             <div className="w-full md:w-1/2">
                <div className="relative">
                   <img 
                      src="https://picsum.photos/id/514/800/800" 
                      alt="Product Efficacy" 
                      className="w-full h-auto rounded-sm shadow-2xl" 
                   />
                   <div className="absolute -bottom-6 -right-6 bg-[#FFFBF2] p-6 shadow-lg border border-[#8B7E66]/20 hidden md:block">
                      <p className="font-serif text-xl italic text-[#8B7E66]">Promise of Ayurveda!</p>
                   </div>
                </div>
             </div>
             <div className="w-full md:w-1/2 space-y-6">
                <h2 className="font-serif text-3xl md:text-4xl text-gray-800">Efficacy</h2>
                <div className="space-y-4 text-sm md:text-base leading-relaxed font-light text-gray-600">
                   <p>Every ingredient is selected, and every formulation is developed in such a way that it should do what it is supposed to do.</p>
                   <p>Potency and Efficacy is one of the most important factors which has made PURE ELEMENTS so popular among its users.</p>
                   <ul className="list-disc list-inside space-y-2 pt-2 marker:text-[#8B7E66]">
                      <li>Pure Thinking</li>
                      <li>Pure Ingredients</li>
                      <li>PURE ELEMENTS</li>
                   </ul>
                   <p className="font-medium text-lg pt-4 text-[#8B7E66]">The Promise of Ayurveda !</p>
                </div>
             </div>
          </div>
        </RevealOnScroll>

      </div>
    </div>
  );
};

export default AboutUs;
