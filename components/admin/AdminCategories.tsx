
import React, { useState } from 'react';
import { NavItem } from '../../types';
import { ChevronDown, ChevronRight, Edit2, Plus, Save, Trash2 } from 'lucide-react';
import { useToast } from '../../ToastContext';

interface Props {
  navItems: NavItem[];
  onUpdateNav: (newItems: NavItem[]) => void;
}

const AdminCategories: React.FC<Props> = ({ navItems, onUpdateNav }) => {
  const { showToast } = useToast();
  const [expandedItem, setExpandedItem] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  const [newSubCategory, setNewSubCategory] = useState('');

  const toggleExpand = (name: string) => {
    setExpandedItem(expandedItem === name ? null : name);
  };

  const startEdit = (item: NavItem) => {
    setEditingItem(item.name);
    setTempName(item.name);
  };

  const cancelEdit = () => {
    setEditingItem(null);
    setTempName('');
  };

  const saveEdit = (oldName: string) => {
    if (!tempName.trim()) return;
    
    const updated = navItems.map(item => 
      item.name === oldName ? { ...item, name: tempName } : item
    );
    onUpdateNav(updated);
    showToast('Category renamed successfully', 'success');
    setEditingItem(null);
  };

  const addSubCategory = (parentName: string) => {
    if (!newSubCategory.trim()) return;

    const updated = navItems.map(item => {
      if (item.name === parentName) {
        return {
          ...item,
          hasDropdown: true,
          subItems: [...(item.subItems || []), newSubCategory]
        };
      }
      return item;
    });

    onUpdateNav(updated);
    showToast('Sub-category added', 'success');
    setNewSubCategory('');
  };

  const removeSubCategory = (parentName: string, subName: string) => {
    const updated = navItems.map(item => {
      if (item.name === parentName && item.subItems) {
        return {
          ...item,
          subItems: item.subItems.filter(s => s !== subName)
        };
      }
      return item;
    });
    onUpdateNav(updated);
    showToast('Sub-category removed', 'info');
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
        <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">Category Manager</h3>
        <p className="text-gray-500 text-sm mb-6">Manage navigation menu structure and product categories.</p>

        <div className="space-y-2">
          {navItems.map((item, idx) => (
            <div key={idx} className="border border-gray-100 rounded-sm overflow-hidden">
              <div className="bg-gray-50 p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 flex-1">
                  <button onClick={() => toggleExpand(item.name)} className="text-gray-500 hover:text-gray-800">
                    {expandedItem === item.name ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>
                  
                  {editingItem === item.name ? (
                    <div className="flex items-center gap-2">
                      <input 
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="border border-gray-300 px-2 py-1 text-sm rounded-sm outline-none focus:border-[#8B7E66]"
                        autoFocus
                      />
                      <button onClick={() => saveEdit(item.name)} className="text-green-600 hover:bg-green-100 p-1 rounded">
                        <Save size={16} />
                      </button>
                    </div>
                  ) : (
                    <span className="font-bold text-gray-800">{item.name}</span>
                  )}
                </div>

                <div className="flex items-center gap-2">
                   {editingItem !== item.name && (
                     <button onClick={() => startEdit(item)} className="text-gray-400 hover:text-[#8B7E66] p-1">
                       <Edit2 size={16} />
                     </button>
                   )}
                </div>
              </div>

              {/* Dropdown Content */}
              {expandedItem === item.name && (
                <div className="p-4 bg-white border-t border-gray-100 pl-12">
                   <h4 className="text-xs font-bold uppercase text-gray-400 tracking-wider mb-3">Sub-Categories</h4>
                   
                   <div className="space-y-2 mb-4">
                      {item.subItems && item.subItems.map((sub, sIdx) => (
                        <div key={sIdx} className="flex items-center justify-between group py-1 border-b border-dotted border-gray-100">
                           <span className="text-sm text-gray-600">{sub}</span>
                           <button 
                             onClick={() => removeSubCategory(item.name, sub)}
                             className="text-red-400 opacity-0 group-hover:opacity-100 hover:text-red-600 transition-opacity"
                           >
                              <Trash2 size={14} />
                           </button>
                        </div>
                      ))}
                      {(!item.subItems || item.subItems.length === 0) && (
                        <p className="text-xs text-gray-400 italic">No sub-categories defined.</p>
                      )}
                   </div>

                   {/* Add New Sub */}
                   <div className="flex items-center gap-2 mt-4">
                      <input 
                        placeholder="New Sub-category..."
                        value={newSubCategory}
                        onChange={(e) => setNewSubCategory(e.target.value)}
                        className="text-sm border border-gray-200 px-3 py-1.5 rounded-sm flex-1 outline-none focus:border-[#8B7E66]"
                      />
                      <button 
                        onClick={() => addSubCategory(item.name)}
                        className="bg-[#8B7E66] text-white p-1.5 rounded-sm hover:bg-[#7A6D55]"
                      >
                         <Plus size={16} />
                      </button>
                   </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminCategories;