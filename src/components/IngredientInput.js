import React, { useState, useRef } from 'react';
import { X, Upload, ImageIcon, Edit2 } from 'lucide-react';
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
      addToast({
        title: 'Invalid file',
        description: 'Please upload an image file',
        variant: 'destructive',
      });
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
      await processImage(file);
    }
  };

  const processImage = async (file) => {
    setIsProcessingImage(true);

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
      addToast({
        title: 'Error processing image',
        description: error.message || 'Could not detect ingredients from the image',
        variant: 'destructive',
      });
    } finally {
      setIsProcessingImage(false);
    }
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
      )
    ]
  );
};

export default IngredientInput;