import React from 'react';

interface Props {
  title: string;
  subtitle?: string;
}

const SectionHeader: React.FC<Props> = ({ title, subtitle }) => {
  return (
    <div className="text-center py-12">
      {subtitle && <p className="text-gray-500 font-sans text-sm tracking-widest uppercase mb-2">{subtitle}</p>}
      <h2 className="text-3xl md:text-4xl font-serif text-brand-dark relative inline-block">
        {title}
        {/* Decorative underline */}
        <span className="block h-px w-1/2 bg-brand-primary mx-auto mt-4"></span>
      </h2>
    </div>
  );
};

export default SectionHeader;