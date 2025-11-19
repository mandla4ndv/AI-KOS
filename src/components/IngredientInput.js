import React, { useState, useRef } from 'react';
import { X, Upload, ImageIcon, Edit2, AlertCircle, Trash2 } from 'lucide-react';
import { useToast } from '../contexts/ToastContext';
import { useAuth } from '../contexts/AuthContext';
import { detectIngredientsFromImage } from '../services/recipeService';
import '../styles/IngredientInput.css';

const IngredientInput = ({ ingredients, onIngredientsChange, onAuthRequired }) => {
  const [inputValue, setInputValue] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessingImage, setIsProcessingImage] = useState(false);
  const [autoDetectedIngredients, setAutoDetectedIngredients] = useState([]);
  const [editingIngredient, setEditingIngredient] = useState(null);
  const [editValue, setEditValue] = useState('');
  const [imageError, setImageError] = useState(null);
  const fileInputRef = useRef(null);
  const { addToast } = useToast();
  const { user } = useAuth();

  const addIngredient = () => {
    const trimmed = inputValue.trim().toLowerCase();
    if (trimmed && !ingredients.includes(trimmed)) {
      onIngredientsChange([...ingredients, trimmed]);
      setInputValue('');
    }
  };

  const removeIngredient = (ingredient) => {
    onIngredientsChange(ingredients.filter((i) => i !== ingredient));
    setAutoDetectedIngredients(autoDetectedIngredients.filter((i) => i !== ingredient));
  };

  const clearAllIngredients = () => {
    onIngredientsChange([]);
    setAutoDetectedIngredients([]);
    addToast({
      title: 'Ingredients cleared',
      description: 'All ingredients have been removed',
    });
  };

  const startEditingIngredient = (ingredient) => {
    setEditingIngredient(ingredient);
    setEditValue(ingredient);
  };

  const saveEditedIngredient = () => {
    if (editingIngredient && editValue.trim()) {
      const trimmed = editValue.trim().toLowerCase();
      const updatedIngredients = ingredients.map((ing) => (ing === editingIngredient ? trimmed : ing));
      onIngredientsChange(updatedIngredients);
      setAutoDetectedIngredients(autoDetectedIngredients.map((ing) => (ing === editingIngredient ? trimmed : ing)));
      setEditingIngredient(null);
      setEditValue('');
    }
  };

  const cancelEditing = () => {
    setEditingIngredient(null);
    setEditValue('');
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addIngredient();
    }
  };

  const handleEditKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      saveEditedIngredient();
    } else if (e.key === 'Escape') {
      cancelEditing();
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    setImageError(null);

    // Check authentication for image upload
    if (!user) {
      onAuthRequired();
      return;
    }

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find((f) => f.type.startsWith('image/'));

    if (imageFile) {
      await processImage(imageFile);
    } else {
      setImageError('Please upload an image file (JPEG, PNG, etc.)');
    }
  };

  const handleFileSelect = async (e) => {
    // Check authentication for image upload
    if (!user) {
      onAuthRequired();
      return;
    }

    const file = e.target.files?.[0];
    if (file) {
      setImageError(null);
      await processImage(file);
    }
  };

  const processImage = async (file) => {
    setIsProcessingImage(true);
    setImageError(null);

    try {
      const detectedIngredients = await detectIngredientsFromImage(file);
      
      const newIngredients = [...new Set([...ingredients, ...detectedIngredients])];
      onIngredientsChange(newIngredients);
      setAutoDetectedIngredients([...new Set([...autoDetectedIngredients, ...detectedIngredients])]);

      addToast({
        title: 'Ingredients detected!',
        description: `Found ${detectedIngredients.length} ingredients from your image`,
      });
    } catch (error) {
      console.error('Image processing error:', error);
      
      // Set inline error message instead of toast
      if (error.message.includes('vehicle') || error.message.includes('car')) {
        setImageError('🚗 This image contains a vehicle, not food ingredients. Please upload a photo of food items.');
      } else if (error.message.includes('No food') || error.message.includes('no ingredients')) {
        setImageError('🔍 No food ingredients detected. Please try a clearer photo of food items.');
      } else if (error.message.includes('JSON') || error.message.includes('parse')) {
        setImageError('⚠️ The AI service returned an unexpected response. Please try a different image.');
      } else {
        setImageError('❌ Failed to analyze image. Please try a clearer photo or add ingredients manually.');
      }
    } finally {
      setIsProcessingImage(false);
    }
  };

  const clearImageError = () => {
    setImageError(null);
  };

  return React.createElement(
    'div',
    { className: 'space-y-4' },
    [
      React.createElement(
        'div',
        { key: 'input-section', className: 'space-y-2' },
        [
          React.createElement(
            'label',
            {
              key: 'label',
              className: 'text-sm font-medium'
            },
            'Add Ingredients'
          ),
          React.createElement(
            'div',
            {
              key: 'input-row',
              className: 'flex gap-2'
            },
            [
              React.createElement('input', {
                key: 'input',
                type: 'text',
                placeholder: 'Type an ingredient and press Enter',
                value: inputValue,
                onChange: (e) => setInputValue(e.target.value),
                onKeyDown: handleKeyDown,
                className: 'input flex-1'
              }),
              React.createElement(
                'button',
                {
                  key: 'add-btn',
                  onClick: addIngredient,
                  className: 'btn btn-primary'
                },
                'Add'
              )
            ]
          )
        ]
      ),
      
      // Ingredients list and clear button section
      React.createElement(
        'div',
        {
          key: 'ingredients-section',
          className: 'space-y-3'
        },
        [
          ingredients.length > 0 && React.createElement(
            'div',
            {
              key: 'ingredients-list',
              className: 'flex flex-wrap gap-2'
            },
            ingredients.map((ingredient) => {
              if (editingIngredient === ingredient) {
                return React.createElement(
                  'div',
                  {
                    key: ingredient,
                    className: 'flex items-center gap-1 rounded-full px-3 py-1.5',
                    style: { backgroundColor: 'var(--secondary)', color: 'var(--secondary-foreground)' }
                  },
                  [
                    React.createElement('input', {
                      key: 'edit-input',
                      value: editValue,
                      onChange: (e) => setEditValue(e.target.value),
                      onKeyDown: handleEditKeyDown,
                      className: 'h-6 w-32 text-sm px-2',
                      style: { 
                        backgroundColor: 'transparent',
                        border: 'none',
                        outline: 'none',
                        color: 'inherit'
                      },
                      autoFocus: true
                    }),
                    React.createElement(
                      'button',
                      {
                        key: 'save',
                        onClick: saveEditedIngredient,
                        className: 'px-1',
                        style: { color: '#22c55e' }
                      },
                      '✓'
                    ),
                    React.createElement(
                      'button',
                      {
                        key: 'cancel',
                        onClick: cancelEditing,
                        className: 'px-1',
                        style: { color: '#ef4444' }
                      },
                      React.createElement(X, { size: 12 })
                    )
                  ]
                );
              }

              const isAutoDetected = autoDetectedIngredients.includes(ingredient);
              return React.createElement(
                'div',
                {
                  key: ingredient,
                  className: 'badge badge-secondary flex items-center gap-1.5 group py-1.5 px-3',
                  style: { fontSize: '14px' }
                },
                [
                  ingredient,
                  React.createElement(
                    'div',
                    {
                      key: 'actions',
                      className: 'flex items-center gap-1'
                    },
                    [
                      isAutoDetected && React.createElement(
                        'button',
                        {
                          key: 'edit',
                          onClick: () => startEditingIngredient(ingredient),
                          className: 'opacity-60 hover:opacity-100 transition-opacity',
                          style: { color: 'var(--primary)' }
                        },
                        React.createElement(Edit2, { size: 12 })
                      ),
                      React.createElement(
                        'button',
                        {
                          key: 'remove',
                          onClick: () => removeIngredient(ingredient),
                          className: 'hover:text-destructive'
                        },
                        React.createElement(X, { size: 12 })
                      )
                    ]
                  )
                ]
              );
            })
          ),
          
          // Clear All Button - Only shows when there are ingredients
          ingredients.length > 0 && React.createElement(
            'div',
            {
              key: 'clear-button-container',
              className: 'flex justify-start'
            },
            React.createElement(
              'button',
              {
                onClick: clearAllIngredients,
                className: 'btn btn-outline btn-sm gap-2 text-destructive border-destructive hover:bg-destructive hover:text-destructive-foreground'
              },
              [
                React.createElement(Trash2, { key: 'icon', size: 14 }),
                'Clear All Ingredients'
              ]
            )
          )
        ]
      ),

      React.createElement(
        'div',
        {
          key: 'upload-section',
          className: 'space-y-4'
        },
        [
          React.createElement(
            'div',
            {
              key: 'upload-area',
              className: `card border-2 border-dashed transition-colors ${isDragging ? 'border-primary' : 'border-border'} ${isProcessingImage ? 'opacity-50' : ''}`,
              onDragOver: handleDragOver,
              onDragLeave: handleDragLeave,
              onDrop: handleDrop
            },
            React.createElement(
              'div',
              { className: 'p-8 flex flex-col items-center justify-center gap-4 text-center' },
              isProcessingImage ? [
                React.createElement(
                  'div',
                  {
                    key: 'spinner',
                    className: 'h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent'
                  }
                ),
                React.createElement(
                  'p',
                  {
                    key: 'text',
                    className: 'text-sm',
                    style: { color: 'var(--muted-foreground)' }
                  },
                  'Processing image...'
                )
              ] : [
                React.createElement(
                  'div',
                  {
                    key: 'icon',
                    className: 'rounded-full p-4',
                    style: { backgroundColor: 'var(--accent)', color: 'var(--accent-foreground)' }
                  },
                  React.createElement(ImageIcon, { size: 32 })
                ),
                React.createElement(
                  'div',
                  { key: 'text' },
                  [
                    React.createElement(
                      'p',
                      {
                        key: 'title',
                        className: 'font-medium'
                      },
                      'Drag & drop an image here'
                    ),
                    React.createElement(
                      'p',
                      {
                        key: 'subtitle',
                        className: 'text-sm mt-1',
                        style: { color: 'var(--muted-foreground)' }
                      },
                      'Or click to upload a photo of your ingredients'
                    )
                  ]
                ),
                React.createElement(
                  'button',
                  {
                    key: 'upload-btn',
                    onClick: () => fileInputRef.current?.click(),
                    className: 'btn btn-outline gap-2'
                  },
                  [
                    React.createElement(Upload, { key: 'icon', size: 16 }),
                    'Choose Image'
                  ]
                ),
                React.createElement('input', {
                  key: 'file-input',
                  ref: fileInputRef,
                  type: 'file',
                  accept: 'image/*',
                  onChange: handleFileSelect,
                  style: { display: 'none' }
                })
              ]
            )
          ),
          
          // Inline error message display
          imageError && React.createElement(
            'div',
            {
              key: 'error-message',
              className: 'card border-destructive bg-destructive/5 p-4 animate-fade-in'
            },
            React.createElement(
              'div',
              { className: 'flex items-start gap-3' },
              [
                React.createElement(
                  'div',
                  {
                    key: 'icon',
                    className: 'flex-shrink-0 mt-0.5',
                    style: { color: 'var(--destructive)' }
                  },
                  React.createElement(AlertCircle, { size: 16 })
                ),
                React.createElement(
                  'div',
                  { key: 'content', className: 'flex-1' },
                  [
                    React.createElement(
                      'p',
                      {
                        key: 'error-text',
                        className: 'text-sm',
                        style: { color: 'var(--destructive)' }
                      },
                      imageError
                    ),
                    React.createElement(
                      'p',
                      {
                        key: 'help-text',
                        className: 'text-xs mt-1',
                        style: { color: 'var(--muted-foreground)' }
                      },
                      'Please try another image or add ingredients manually above.'
                    )
                  ]
                ),
                React.createElement(
                  'button',
                  {
                    key: 'close',
                    onClick: clearImageError,
                    className: 'flex-shrink-0 text-destructive hover:bg-destructive/10 p-1 rounded transition-colors',
                    'aria-label': 'Dismiss error'
                  },
                  React.createElement(X, { size: 14 })
                )
              ]
            )
          )
        ]
      )
    ]
  );
};

export default IngredientInput;