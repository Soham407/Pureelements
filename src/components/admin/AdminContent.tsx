import React, { useState } from 'react';
import { Slide, ConcernsContent, BestsellersConfig, VideoContent, StoreContent, Testimonial, Category } from '../../types';
import { Save, Plus, Trash2 } from 'lucide-react';
import ImageUpload from './ImageUpload';

interface Props {
  slides: Slide[];
  concerns: ConcernsContent[];
  categories: Category[];
  bestsellersConfig: BestsellersConfig | null;
  videoSection: VideoContent | null;
  testimonials: Testimonial[];
  stores: StoreContent[];
  onUpdateHero: (slides: Slide[]) => void;
  onUpdateContent: (section: string, content: any) => Promise<void>;
  onUpdateCategories: (categories: Category[]) => Promise<void>;
}

const AdminContent: React.FC<Props> = ({
  slides,
  concerns,
  categories,
  bestsellersConfig,
  videoSection,
  testimonials,
  stores,
  onUpdateHero,
  onUpdateContent,
  onUpdateCategories
}) => {
  const [activeTab, setActiveTab] = useState<'HERO' | 'CATEGORIES' | 'CONCERNS' | 'BESTSELLERS' | 'VIDEO' | 'TESTIMONIALS' | 'STORES'>('HERO');
  const [localSlides, setLocalSlides] = useState<Slide[]>(slides);
  const [loading, setLoading] = useState(false);

  // --- Handlers for Hero Slides ---
  const handleSaveHero = async () => {
    setLoading(true);
    try {
      await onUpdateHero(localSlides);
      alert('Hero slides updated successfully!');
    } catch (error) {
      console.error('Error saving hero slides:', error);
      alert('Failed to update hero slides.');
    } finally {
      setLoading(false);
    }
  };

  const handleAddSlide = () => {
    const newSlide: Slide = {
      id: Date.now(),
      image: '',
      title: 'New Slide Title',
      subtitle: 'New Slide Subtitle',
      description: 'New Slide Description',
      buttonText: 'Shop Now',
      link: '/shop/ALL'
    };
    setLocalSlides([...localSlides, newSlide]);
  };

  const handleUpdateSlide = (id: number, field: keyof Slide, value: string) => {
    setLocalSlides(prev => prev.map(slide => 
      slide.id === id ? { ...slide, [field]: value } : slide
    ));
  };

  const handleDeleteSlide = (id: number) => {
    setLocalSlides(prev => prev.filter(slide => slide.id !== id));
  };

  // --- General Content Update Handler ---
  const handleUpdateSection = async (section: string, newData: any) => {
      setLoading(true);
      try {
          await onUpdateContent(section, newData);
          alert(`${section.replace(/_/g, ' ')} updated successfully!`);
      } catch (error) {
          console.error(`Error updating ${section}:`, error);
          alert(`Failed to update ${section}.`);
      } finally {
          setLoading(false);
      }
  };

  // --- Render Functions ---

  const renderHeroEditor = () => (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Hero Banners</h3>
          <button onClick={handleAddSlide} className="flex items-center gap-2 text-brand-primary text-sm font-bold hover:underline">
             <Plus size={16} /> Add Slide
          </button>
       </div>
       
       <div className="space-y-4">
          {localSlides.map((slide) => (
             <div key={slide.id} className="bg-gray-50 p-4 rounded border border-gray-200 flex gap-4">
                <div className="w-1/4 aspect-video bg-gray-200 rounded overflow-hidden relative group">
                   {slide.image && <img src={slide.image} alt={slide.title} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 grid grid-cols-2 gap-4">
                   <div className="col-span-2">
                      <ImageUpload
                        value={slide.image}
                        onChange={(url) => handleUpdateSlide(slide.id, 'image', url)}
                        label="Image"
                        previewSize="medium"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Title</label>
                      <input 
                        type="text" 
                        value={slide.title} 
                        onChange={(e) => handleUpdateSlide(slide.id, 'title', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Subtitle</label>
                      <input 
                        type="text" 
                        value={slide.subtitle} 
                        onChange={(e) => handleUpdateSlide(slide.id, 'subtitle', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                   </div>
                   <div>
                      <label className="block text-xs font-bold text-gray-500 mb-1">Link</label>
                      <input 
                        type="text" 
                        value={slide.link || ''} 
                        onChange={(e) => handleUpdateSlide(slide.id, 'link', e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded text-sm"
                      />
                   </div>
                </div>
                <div className="flex flex-col justify-start">
                   <button onClick={() => handleDeleteSlide(slide.id)} className="text-red-500 hover:text-red-700 p-1">
                      <Trash2 size={18} />
                   </button>
                </div>
             </div>
          ))}
       </div>
       
       <div className="pt-4 border-t border-gray-200">
          <button 
            onClick={handleSaveHero} 
            disabled={loading}
            className="flex items-center gap-2 bg-brand-primary text-white px-6 py-2 rounded shadow hover:bg-brand-dark transition-colors disabled:opacity-50"
          >
             <Save size={18} /> {loading ? 'Saving...' : 'Save Changes'}
          </button>
       </div>
    </div>
  );

  const renderCategoriesEditor = () => {
    return <CategoriesEditor initialCategories={categories} onSave={onUpdateCategories} loading={loading} />;
  };

  const renderConcernsEditor = () => {
    return <ConcernsEditor initialConcerns={concerns} onSave={(data) => handleUpdateSection('shop_by_concerns', data)} loading={loading} />;
  };

  const renderBestsellersEditor = () => {
      return <BestsellersEditor initialConfig={bestsellersConfig} onSave={(data) => handleUpdateSection('bestsellers_config', data)} loading={loading} />;
  };

  const renderVideoEditor = () => {
      return <VideoEditor initialData={videoSection} onSave={(data) => handleUpdateSection('video_section', data)} loading={loading} />;
  };

  const renderTestimonialsEditor = () => {
      return <TestimonialsEditor initialData={testimonials} onSave={(data) => handleUpdateSection('testimonials', data)} loading={loading} />;
  };

  const renderStoresEditor = () => {
      return <StoresEditor initialData={stores} onSave={(data) => handleUpdateSection('stores', data)} loading={loading} />;
  };

  return (
    <div className="bg-white rounded-sm shadow-sm border border-gray-200">
      <div className="flex border-b border-gray-200 overflow-x-auto">
         {['HERO', 'CATEGORIES', 'CONCERNS', 'BESTSELLERS', 'VIDEO', 'TESTIMONIALS', 'STORES'].map((tab) => (
             <button
               key={tab}
               onClick={() => setActiveTab(tab as any)}
               className={`px-6 py-4 text-sm font-bold uppercase tracking-wider whitespace-nowrap ${
                  activeTab === tab ? 'border-b-2 border-brand-primary text-brand-primary' : 'text-gray-500 hover:text-gray-700'
               }`}
             >
                {tab}
             </button>
         ))}
      </div>
      
      <div className="p-6">
         {activeTab === 'HERO' && renderHeroEditor()}
         {activeTab === 'CATEGORIES' && renderCategoriesEditor()}
         {activeTab === 'CONCERNS' && renderConcernsEditor()}
         {activeTab === 'BESTSELLERS' && renderBestsellersEditor()}
         {activeTab === 'VIDEO' && renderVideoEditor()}
         {activeTab === 'TESTIMONIALS' && renderTestimonialsEditor()}
         {activeTab === 'STORES' && renderStoresEditor()}
      </div>
    </div>
  );
};

// --- Sub Components ---

const CategoriesEditor = ({ initialCategories, onSave, loading }: { initialCategories: Category[], onSave: (categories: Category[]) => Promise<void>, loading: boolean }) => {
    const [localCategories, setLocalCategories] = useState(initialCategories);
      
    const updateCategory = (idx: number, field: string, value: string) => {
        const updated = [...localCategories];
        updated[idx] = { ...updated[idx], [field]: value };
        setLocalCategories(updated);
    };

    const handleSave = async () => {
        try {
            await onSave(localCategories);
            alert('Categories updated successfully!');
        } catch (error) {
            console.error('Error saving categories:', error);
            alert('Failed to update categories.');
        }
    };

    return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Shop by Category</h3>
            <p className="text-sm text-gray-500">Update category images displayed on homepage</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {localCategories.map((cat, idx) => (
                <div key={cat.id} className="border p-4 rounded bg-gray-50 space-y-3">
                    <div className="flex items-center gap-3">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-2 border-gray-200 flex-shrink-0">
                            {cat.image ? (
                                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                    <span className="text-xs text-gray-400">No Image</span>
                                </div>
                            )}
                        </div>
                        <div className="flex-1">
                            <h4 className="font-bold text-sm text-gray-800">{cat.name}</h4>
                            <p className="text-xs text-gray-500">ID: {cat.id}</p>
                        </div>
                    </div>
                    <ImageUpload
                        value={cat.image}
                        onChange={(url) => updateCategory(idx, 'image', url)}
                        label="Category Image"
                        previewSize="small"
                    />
                </div>
            ))}
        </div>
        <button onClick={handleSave} disabled={loading} className="bg-brand-primary text-white px-6 py-2 rounded shadow mt-4 flex items-center gap-2">
            <Save size={18}/> {loading ? 'Saving...' : 'Save Categories'}
        </button>
    </div>
    );
};

const ConcernsEditor = ({ initialConcerns, onSave, loading }: { initialConcerns: ConcernsContent[], onSave: (data: any) => void, loading: boolean }) => {
    const [localConcerns, setLocalConcerns] = useState(initialConcerns);
      
    const updateConcern = (idx: number, field: string, value: string) => {
        const updated = [...localConcerns];
        updated[idx] = { ...updated[idx], [field]: value };
        setLocalConcerns(updated);
    };

    const addConcern = () => {
        setLocalConcerns([...localConcerns, { title: 'New Concern', image: '', link: '/shop' }]);
    };

    const removeConcern = (idx: number) => {
        setLocalConcerns(localConcerns.filter((_, i) => i !== idx));
    };

    return (
    <div className="space-y-6">
        <div className="flex justify-between items-center">
            <h3 className="text-lg font-bold">Shop By Concerns</h3>
            <button onClick={addConcern} className="text-brand-primary font-bold flex items-center gap-1 text-sm"><Plus size={16}/> Add Concern</button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {localConcerns.map((c, idx) => (
                <div key={idx} className="border p-4 rounded bg-gray-50 space-y-3 relative group">
                    <ImageUpload
                        value={c.image}
                        onChange={(url) => updateConcern(idx, 'image', url)}
                        label="Image"
                        previewSize="small"
                    />
                    <div className="space-y-2">
                        <input 
                        value={c.title} 
                        onChange={(e) => updateConcern(idx, 'title', e.target.value)}
                        className="w-full p-2 border rounded text-sm font-bold" 
                        placeholder="Title"
                        />
                        <input 
                        value={c.link} 
                        onChange={(e) => updateConcern(idx, 'link', e.target.value)}
                        className="w-full p-2 border rounded text-xs" 
                        placeholder="Link (e.g. /shop/ACNE)"
                        />
                    </div>
                    <button onClick={() => removeConcern(idx)} className="absolute top-2 right-2 text-red-500 hover:text-red-600"><Trash2 size={16}/></button>
                </div>
            ))}
        </div>
        <button onClick={() => onSave(localConcerns)} disabled={loading} className="bg-brand-primary text-white px-6 py-2 rounded shadow mt-4 flex items-center gap-2">
            <Save size={18}/> Save Concerns
        </button>
    </div>
    );
};

const BestsellersEditor = ({ initialConfig, onSave, loading }: { initialConfig: BestsellersConfig | null, onSave: (data: any) => void, loading: boolean }) => {
    const [config, setConfig] = useState(initialConfig || { backgroundImage: '', title: '', buttonText: '' });

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold">Bestsellers Section Config</h3>
            <div className="border p-6 rounded bg-gray-50 space-y-4 max-w-2xl">
                 <ImageUpload
                    value={config.backgroundImage}
                    onChange={(url) => setConfig({ ...config, backgroundImage: url })}
                    label="Background Image"
                    previewSize="medium"
                 />
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Title (Use \n for line breaks)</label>
                    <textarea 
                      value={config.title} 
                      onChange={(e) => setConfig({ ...config, title: e.target.value })}
                      className="w-full p-2 border rounded"
                      rows={3}
                    />
                 </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Button Text</label>
                    <input 
                      value={config.buttonText} 
                      onChange={(e) => setConfig({ ...config, buttonText: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                 </div>
            </div>
            <button onClick={() => onSave(config)} disabled={loading} className="bg-brand-primary text-white px-6 py-2 rounded shadow flex items-center gap-2">
                <Save size={18}/> Save Bestsellers Config
            </button>
        </div>
    );
};

const VideoEditor = ({ initialData, onSave, loading }: { initialData: VideoContent | null, onSave: (data: any) => void, loading: boolean }) => {
    const [video, setVideo] = useState(initialData || { thumbnail: '', videoUrl: '', title: '', subtitle: '' });

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold">Video Section</h3>
            <div className="border p-6 rounded bg-gray-50 space-y-4 max-w-2xl">
                 <ImageUpload
                    value={video.thumbnail}
                    onChange={(url) => setVideo({ ...video, thumbnail: url })}
                    label="Thumbnail Image"
                    previewSize="medium"
                 />
                 <div>
                     <label className="block text-sm font-bold text-gray-700 mb-1">Video Link (YouTube URL)</label>
                     <input 
                      value={video.videoUrl} 
                      onChange={(e) => setVideo({ ...video, videoUrl: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                 </div>
                 <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Main Title</label>
                    <input 
                      value={video.title} 
                      onChange={(e) => setVideo({ ...video, title: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                 </div>
                  <div>
                    <label className="block text-sm font-bold text-gray-700 mb-1">Subtitle</label>
                    <input 
                      value={video.subtitle} 
                      onChange={(e) => setVideo({ ...video, subtitle: e.target.value })}
                      className="w-full p-2 border rounded"
                    />
                 </div>
            </div>
            <button onClick={() => onSave(video)} disabled={loading} className="bg-brand-primary text-white px-6 py-2 rounded shadow flex items-center gap-2">
                <Save size={18}/> Save Video Section
            </button>
        </div>
    );
};

const TestimonialsEditor = ({ initialData, onSave, loading }: { initialData: Testimonial[], onSave: (data: any) => void, loading: boolean }) => {
      const [localTestimonials, setLocalTestimonials] = useState(initialData);

      const updateTestimonial = (idx: number, field: string, value: string) => {
          const updated = [...localTestimonials];
          updated[idx] = { ...updated[idx], [field]: value };
          setLocalTestimonials(updated);
      };

      const addTestimonial = () => {
          setLocalTestimonials([...localTestimonials, { id: Date.now(), name: 'Customer Name', thumbnail: '', platform: 'YouTube', videoUrl: '' }]);
      };
      
      const removeTestimonial = (id: number) => {
          setLocalTestimonials(localTestimonials.filter(t => t.id !== id));
      };

      return (
         <div className="space-y-6">
             <div className="flex justify-between items-center">
                 <h3 className="text-lg font-bold">Customer Testimonials</h3>
                 <button onClick={addTestimonial} className="text-brand-primary font-bold flex items-center gap-1 text-sm"><Plus size={16}/> Add Testimonial</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                 {localTestimonials.map((t, idx) => (
                     <div key={t.id} className="border p-4 rounded bg-gray-50 space-y-2 relative">
                         <ImageUpload
                            value={t.thumbnail}
                            onChange={(url) => updateTestimonial(idx, 'thumbnail', url)}
                            label="Thumbnail"
                            previewSize="small"
                         />
                         <input value={t.name} onChange={(e) => updateTestimonial(idx, 'name', e.target.value)} className="w-full p-2 border rounded text-sm font-bold" placeholder="Customer Name" />
                         <input value={t.videoUrl} onChange={(e) => updateTestimonial(idx, 'videoUrl', e.target.value)} className="w-full p-2 border rounded text-xs" placeholder="Video URL" />
                         <select value={t.platform} onChange={(e) => updateTestimonial(idx, 'platform', e.target.value)} className="w-full p-2 border rounded text-xs">
                             <option value="YouTube">YouTube</option>
                             <option value="Instagram">Instagram</option>
                         </select>
                         <button onClick={() => removeTestimonial(t.id)} className="absolute top-2 right-2 bg-white rounded-full p-1 text-red-500 shadow"><Trash2 size={14}/></button>
                     </div>
                 ))}
             </div>
             <button onClick={() => onSave(localTestimonials)} disabled={loading} className="bg-brand-primary text-white px-6 py-2 rounded shadow mt-4 flex items-center gap-2">
                 <Save size={18}/> Save Testimonials
             </button>
         </div>
      );
};

const StoresEditor = ({ initialData, onSave, loading }: { initialData: StoreContent[], onSave: (data: any) => void, loading: boolean }) => {
      const [localStores, setLocalStores] = useState(initialData);
      
      const updateStore = (idx: number, field: string, value: string) => {
          const updated = [...localStores];
          updated[idx] = { ...updated[idx], [field]: value };
          setLocalStores(updated);
      };

      const addStore = () => {
          setLocalStores([...localStores, { id: Date.now(), name: 'New Store', location: 'Location', image: '' }]);
      };

      const removeStore = (id: number) => {
          setLocalStores(localStores.filter(s => s.id !== id));
      };

      return (
          <div className="space-y-6">
             <div className="flex justify-between items-center">
                 <h3 className="text-lg font-bold">Store Locations</h3>
                 <button onClick={addStore} className="text-brand-primary font-bold flex items-center gap-1 text-sm"><Plus size={16}/> Add Store</button>
             </div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 {localStores.map((s, idx) => (
                     <div key={s.id} className="border p-4 rounded bg-gray-50 space-y-3 relative">
                         <ImageUpload
                            value={s.image}
                            onChange={(url) => updateStore(idx, 'image', url)}
                            label="Store Image"
                            previewSize="small"
                         />
                         <div className="space-y-2">
                             <input value={s.name} onChange={(e) => updateStore(idx, 'name', e.target.value)} className="w-full p-2 border rounded text-sm font-bold" placeholder="Store Name" />
                             <input value={s.location} onChange={(e) => updateStore(idx, 'location', e.target.value)} className="w-full p-2 border rounded text-xs" placeholder="Location" />
                         </div>
                         <button onClick={() => removeStore(s.id)} className="absolute top-2 right-2 text-red-400 hover:text-red-600"><Trash2 size={16}/></button>
                     </div>
                 ))}
             </div>
             <button onClick={() => onSave(localStores)} disabled={loading} className="bg-brand-primary text-white px-6 py-2 rounded shadow mt-4 flex items-center gap-2">
                 <Save size={18}/> Save Stores
             </button>
          </div>
      );
};

export default AdminContent;
