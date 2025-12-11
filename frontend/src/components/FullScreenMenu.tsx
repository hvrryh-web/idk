import React, { useState } from 'react';
import { X, Settings, User, BookOpen, Sword, Heart } from 'lucide-react';

interface MenuOption {
  id: string;
  label: string;
  icon: React.ReactNode;
  description: string;
}

interface FullScreenMenuProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectOption: (optionId: string) => void;
}

export default function FullScreenMenu({ isOpen, onClose, onSelectOption }: FullScreenMenuProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const menuOptions: MenuOption[] = [
    {
      id: 'character',
      label: 'Character',
      icon: <User size={32} strokeWidth={2} />,
      description: 'View character status, cultivation progress, and abilities',
    },
    {
      id: 'techniques',
      label: 'Techniques',
      icon: <Sword size={32} strokeWidth={2} />,
      description: 'Manage your learned techniques and combat skills',
    },
    {
      id: 'items',
      label: 'Items',
      icon: <Heart size={32} strokeWidth={2} />,
      description: 'View inventory, consumables, and equipment',
    },
    {
      id: 'codex',
      label: 'Codex',
      icon: <BookOpen size={32} strokeWidth={2} />,
      description: 'Access cultivation knowledge and discovered lore',
    },
    {
      id: 'settings',
      label: 'Settings',
      icon: <Settings size={32} strokeWidth={2} />,
      description: 'Configure game settings and preferences',
    },
  ];

  if (!isOpen) return null;

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
  };

  const handleConfirm = () => {
    onSelectOption(menuOptions[selectedIndex].id);
    onClose();
  };

  return (
    <div className="fullscreen-menu-overlay">
      <div className="fullscreen-menu">
        {/* Menu Header */}
        <div className="menu-header">
          <h2 className="menu-title">Main Menu</h2>
          <button className="menu-close-btn" onClick={onClose}>
            <X size={32} strokeWidth={2} />
          </button>
        </div>

        {/* Menu Content */}
        <div className="menu-content">
          {/* Menu Options List */}
          <div className="menu-options-list">
            {menuOptions.map((option, index) => (
              <button
                key={option.id}
                className={`menu-option ${selectedIndex === index ? 'selected' : ''}`}
                onClick={() => handleSelect(index)}
                onDoubleClick={handleConfirm}
              >
                <div className="menu-option-icon">{option.icon}</div>
                <div className="menu-option-content">
                  <span className="menu-option-label">{option.label}</span>
                  <span className="menu-option-description">{option.description}</span>
                </div>
                <div className="menu-option-indicator">
                  {selectedIndex === index && <div className="selection-diamond" />}
                </div>
              </button>
            ))}
          </div>

          {/* Menu Preview Panel */}
          <div className="menu-preview-panel">
            <div className="preview-header">
              <div className="preview-icon">{menuOptions[selectedIndex].icon}</div>
              <h3 className="preview-title">{menuOptions[selectedIndex].label}</h3>
            </div>
            <p className="preview-description">{menuOptions[selectedIndex].description}</p>
            <div className="preview-actions">
              <button className="preview-action-btn primary" onClick={handleConfirm}>
                Select
              </button>
              <button className="preview-action-btn secondary" onClick={onClose}>
                Cancel
              </button>
            </div>
          </div>
        </div>

        {/* Menu Footer */}
        <div className="menu-footer">
          <div className="menu-hint">
            <span className="hint-key">Click</span>
            <span className="hint-text">to select</span>
          </div>
          <div className="menu-hint">
            <span className="hint-key">Double Click</span>
            <span className="hint-text">to confirm</span>
          </div>
        </div>
      </div>
    </div>
  );
}
