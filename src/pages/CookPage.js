import React from 'react';
import { ArrowLeft } from 'lucide-react';

const CookPage = () => {
  const recipe = JSON.parse(sessionStorage.getItem('currentRecipe') || 'null');

  if (!recipe) {
    return React.createElement(
      'div',
      { className: 'min-h-screen flex items-center justify-center' },
      React.createElement(
        'div',
        { className: 'text-center' },
        [
          React.createElement(
            'h1',
            { key: 'title', className: 'text-2xl font-bold mb-4' },
            'No Recipe Selected'
          ),
          React.createElement(
            'button',
            {
              key: 'back',
              onClick: () => window.location.hash = 'home',
              className: 'btn btn-primary gap-2'
            },
            [
              React.createElement(ArrowLeft, { key: 'icon', size: 16 }),
              'Back to Home'
            ]
          )
        ]
      )
    );
  }

  return React.createElement(
    'div',
    { className: 'min-h-screen' },
    React.createElement(
      'div',
      { className: 'container py-8' },
      [
        React.createElement(
          'button',
          {
            key: 'back',
            onClick: () => window.location.hash = 'home',
            className: 'btn btn-outline gap-2 mb-6',
            style: { backgroundColor: 'transparent' }
          },
          [
            React.createElement(ArrowLeft, { key: 'icon', size: 16 }),
            'Back to Recipe'
          ]
        ),
        React.createElement(
          'div',
          { key: 'content', className: 'max-w-4xl mx-auto' },
          [
            React.createElement(
              'h1',
              { key: 'title', className: 'text-3xl font-bold mb-4' },
              recipe.title
            ),
            React.createElement(
              'div',
              { key: 'instructions', className: 'space-y-4' },
              recipe.instructions.map((instruction, index) =>
                React.createElement(
                  'div',
                  {
                    key: index,
                    className: 'card p-4'
                  },
                  [
                    React.createElement(
                      'h3',
                      {
                        key: 'step',
                        className: 'text-lg font-semibold mb-2'
                      },
                      `Step ${instruction.step}`
                    ),
                    React.createElement(
                      'p',
                      { key: 'desc' },
                      instruction.description
                    ),
                    instruction.duration && React.createElement(
                      'div',
                      {
                        key: 'timer',
                        className: 'mt-2 text-sm',
                        style: { color: 'var(--muted-foreground)' }
                      },
                      `⏱️ ${instruction.duration} minutes`
                    )
                  ]
                )
              )
            )
          ]
        )
      ]
    )
  );
};

export default CookPage;