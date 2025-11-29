
import React, { useState } from 'react';
import { NavItem } from '../../types';
import { ChevronDown, ChevronRight, Edit2, Plus, Save, Trash2, GripVertical } from 'lucide-react';
import { useToast } from '../../contexts/ToastContext';

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

  // Drag and Drop State
  const [draggedCategoryIndex, setDraggedCategoryIndex] = useState<number | null>(null);
  const [draggedSubItem, setDraggedSubItem] = useState<{parentIndex: number, subIndex: number} | null>(null);

  const toggleExpand = (name: string) => {
    setExpandedItem(expandedItem === name ? null : name);
  };

  const startEdit = (item: NavItem) => {
    setEditingItem(item.name);
    setTempName(item.name);
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

  // --- Drag and Drop Handlers for Main Categories ---

  const handleDragStartCategory = (e: React.DragEvent, index: number) => {
    setDraggedCategoryIndex(index);
    // Required for Firefox
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverCategory = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    if (draggedCategoryIndex === null || draggedCategoryIndex === index) return;

    const newItems = [...navItems];
    const draggedItem = newItems[draggedCategoryIndex];
    newItems.splice(draggedCategoryIndex, 1);
    newItems.splice(index, 0, draggedItem);

    onUpdateNav(newItems);
    setDraggedCategoryIndex(index);
  };

  const handleDragEndCategory = () => {
    setDraggedCategoryIndex(null);
  };

  // --- Drag and Drop Handlers for Sub Categories ---

  const handleDragStartSub = (e: React.DragEvent, parentIndex: number, subIndex: number) => {
    e.stopPropagation(); // Prevent bubbling to parent
    setDraggedSubItem({ parentIndex, subIndex });
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOverSub = (e: React.DragEvent, parentIndex: number, subIndex: number) => {
    e.preventDefault();
    e.stopPropagation();

    if (!draggedSubItem) return;
    // Only allow reordering within the same parent
    if (draggedSubItem.parentIndex !== parentIndex) return;
    if (draggedSubItem.subIndex === subIndex) return;

    const parentItem = navItems[parentIndex];
    if (!parentItem.subItems) return;

    const newSubItems = [...parentItem.subItems];
    const draggedItemContent = newSubItems[draggedSubItem.subIndex];
    
    newSubItems.splice(draggedSubItem.subIndex, 1);
    newSubItems.splice(subIndex, 0, draggedItemContent);

    const newNavItems = [...navItems];
    newNavItems[parentIndex] = { ...parentItem, subItems: newSubItems };

    onUpdateNav(newNavItems);
    setDraggedSubItem({ parentIndex, subIndex });
  };

  const handleDragEndSub = () => {
    setDraggedSubItem(null);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-white p-6 rounded-sm shadow-sm border border-gray-100">
        <h3 className="font-serif text-xl font-bold text-gray-800 mb-2">Category Manager</h3>
        <p className="text-gray-500 text-sm mb-6">Drag to reorder. Manage navigation menu structure.</p>

        <div className="space-y-2">
          {navItems.map((item, idx) => (
            <div 
              key={item.name} 
              draggable={editingItem === null} // Disable drag while editing
              onDragStart={(e) => handleDragStartCategory(e, idx)}
              onDragOver={(e) => handleDragOverCategory(e, idx)}
              onDragEnd={handleDragEndCategory}
              className={`border border-gray-100 rounded-sm overflow-hidden transition-all ${
                draggedCategoryIndex === idx ? 'opacity-50 border-dashed border-[#8B7E66]' : 'opacity-100'
              }`}
            >
              <div className="bg-gray-50 p-4 flex items-center justify-between cursor-default">
                <div className="flex items-center gap-3 flex-1">
                  {/* Drag Handle */}
                  <div className="cursor-move text-gray-400 hover:text-[#8B7E66]" title="Drag to reorder">
                    <GripVertical size={16} />
                  </div>

                  <button onClick={() => toggleExpand(item.name)} className="text-gray-500 hover:text-gray-800">
                    {expandedItem === item.name ? <ChevronDown size={18} /> : <ChevronRight size={18} />}
                  </button>
                  
                  {editingItem === item.name ? (
                    <div className="flex items-center gap-2">
                      <input 
                        value={tempName}
                        onChange={(e) => setTempName(e.target.value)}
                        className="border border-gray-300 px-2 py-1 text-sm rounded-sm outline-none focus:border-[#8B7E66] bg-white"
                        autoFocus
                      />
                      <button onClick={() => saveEdit(item.name)} className="text-green-600 hover:bg-green-100 p-1 rounded">
                        <Save size={16} />
                      </button>
                    </div>
                  ) : (
                    <span className="font-bold text-gray-800 select-none">{item.name}</span>
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
                        <div 
                          key={sub} 
                          draggable
                          onDragStart={(e) => handleDragStartSub(e, idx, sIdx)}
                          onDragOver={(e) => handleDragOverSub(e, idx, sIdx)}
                          onDragEnd={handleDragEndSub}
                          className={`flex items-center justify-between group py-2 px-3 border border-transparent hover:border-gray-100 rounded-sm hover:bg-gray-50 transition-colors ${
                             draggedSubItem?.parentIndex === idx && draggedSubItem?.subIndex === sIdx ? 'opacity-40 border-dashed border-gray-300' : ''
                          }`}
                        >
                           <div className="flex items-center gap-3">
                              <GripVertical size={14} className="text-gray-300 cursor-move hover:text-[#8B7E66]" />
                              <span className="text-sm text-gray-600 select-none">{sub}</span>
                           </div>
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
                        className="text-sm border border-gray-200 px-3 py-1.5 rounded-sm flex-1 outline-none focus:border-[#8B7E66] bg-white"
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
