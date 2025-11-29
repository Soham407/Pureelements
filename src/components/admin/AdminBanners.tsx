
import React, { useState } from 'react';
import { Slide } from '../../types';
import { Edit2, Save, X, Image as ImageIcon } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

interface Props {
  slides: Slide[];
  onUpdateHero: (slides: Slide[]) => void;
}

const AdminBanners: React.FC<Props> = ({ slides, onUpdateHero }) => {
  const { showToast } = useToast();
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempSlide, setTempSlide] = useState<Slide | null>(null);

  const startEdit = (slide: Slide) => {
    setEditingId(slide.id);
    setTempSlide({ ...slide });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTempSlide(null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!tempSlide) return;
    setTempSlide({ ...tempSlide, [e.target.name]: e.target.value });
  };

  const saveEdit = () => {
    if (!tempSlide) return;
    const updatedSlides = slides.map(s => s.id === tempSlide.id ? tempSlide : s);
    onUpdateHero(updatedSlides);
    showToast('Banner updated successfully', 'success');
    setEditingId(null);
    setTempSlide(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
        <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">Homepage Banners</h3>
        <p className="text-gray-500 text-sm mb-6">Manage the main carousel slides on the homepage.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {slides.map((slide) => (
            <div key={slide.id} className="border border-gray-200 rounded-sm overflow-hidden flex flex-col h-full relative group">
              {/* Image Preview */}
              <div className="h-40 bg-gray-100 relative overflow-hidden">
                <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                   <button 
                     onClick={() => startEdit(slide)}
                     className="bg-white text-gray-800 px-4 py-2 rounded-sm text-xs font-bold uppercase tracking-wider hover:bg-[#8B7E66] hover:text-white transition-colors"
                   >
                      Edit Slide
                   </button>
                </div>
              </div>

              {/* Content Preview */}
              <div className="p-4 flex-1 flex flex-col">
                <p className="text-xs text-[#8B7E66] font-bold uppercase tracking-wider mb-1">{slide.subtitle}</p>
                <h4 className="font-serif text-lg font-bold text-gray-800 leading-tight mb-2 whitespace-pre-line">{slide.title}</h4>
                <p className="text-xs text-gray-500 line-clamp-2">{slide.description}</p>
              </div>

              {/* Edit Overlay Form */}
              {editingId === slide.id && tempSlide && (
                <div className="absolute inset-0 bg-white z-20 p-4 flex flex-col gap-3 overflow-y-auto">
                   <div className="flex justify-between items-center mb-2">
                      <h4 className="text-sm font-bold uppercase text-gray-500">Editing Slide #{slide.id}</h4>
                      <button onClick={cancelEdit}><X size={16} className="text-gray-400 hover:text-gray-800" /></button>
                   </div>
                   
                   <div>
                      <label className="text-[10px] font-bold uppercase text-gray-400">Subtitle</label>
                      <input 
                        name="subtitle"
                        value={tempSlide.subtitle}
                        onChange={handleChange}
                        className="w-full border border-gray-200 px-2 py-1 text-sm rounded-sm focus:border-[#8B7E66] outline-none bg-white"
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-bold uppercase text-gray-400">Title</label>
                      <textarea 
                        name="title"
                        rows={2}
                        value={tempSlide.title}
                        onChange={handleChange}
                        className="w-full border border-gray-200 px-2 py-1 text-sm rounded-sm focus:border-[#8B7E66] outline-none bg-white"
                      />
                   </div>
                   <div>
                      <label className="text-[10px] font-bold uppercase text-gray-400">Image URL</label>
                      <div className="flex gap-2">
                        <input 
                            name="image"
                            value={tempSlide.image}
                            onChange={handleChange}
                            className="w-full border border-gray-200 px-2 py-1 text-xs font-mono rounded-sm focus:border-[#8B7E66] outline-none bg-white"
                        />
                        <a href={tempSlide.image} target="_blank" rel="noreferrer" className="p-1 bg-gray-100 text-gray-500 rounded hover:bg-gray-200"><ImageIcon size={14} /></a>
                      </div>
                   </div>

                   <button 
                     onClick={saveEdit} 
                     className="mt-auto bg-[#8B7E66] text-white py-2 text-xs font-bold uppercase rounded-sm hover:bg-[#7A6D55] flex justify-center gap-2 items-center"
                   >
                      <Save size={14} /> Save Changes
                   </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminBanners;
