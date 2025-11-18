import React from 'react';

const RecipeSkeleton = () => {
  return React.createElement(
    'div',
    { className: 'glass-card rounded-xl p-6 animate-pulse' },
    [
      React.createElement(
        'div',
        { key: 'header', className: 'flex items-start justify-between mb-6' },
        [
          React.createElement(
            'div',
            { key: 'title', className: 'flex-1' },
            [
              React.createElement('div', {
                key: 'line1',
                className: 'h-6 bg-muted rounded w-3/4 mb-2'
              }),
              React.createElement('div', {
                key: 'line2',
                className: 'h-4 bg-muted rounded w-1/2'
              })
            ]
          ),
          React.createElement('div', {
            key: 'badge',
            className: 'h-6 bg-muted rounded w-16'
          })
        ]
      ),
      React.createElement(
        'div',
        { key: 'meta', className: 'flex gap-4 mb-6' },
        Array.from({ length: 3 }).map((_, i) =>
          React.createElement('div', {
            key: i,
            className: 'h-4 bg-muted rounded w-20'
          })
        )
      ),
      React.createElement(
        'div',
        { key: 'ingredients', className: 'mb-6' },
        [
          React.createElement('div', {
            key: 'title',
            className: 'h-5 bg-muted rounded w-24 mb-3'
          }),
          React.createElement(
            'div',
            { key: 'list', className: 'grid grid-cols-2 gap-2' },
            Array.from({ length: 6 }).map((_, i) =>
              React.createElement('div', {
                key: i,
                className: 'h-4 bg-muted rounded'
              })
            )
          )
        ]
      ),
      React.createElement(
        'div',
        { key: 'instructions', className: 'mb-6' },
        [
          React.createElement('div', {
            key: 'title',
            className: 'h-5 bg-muted rounded w-28 mb-3'
          }),
          React.createElement(
            'div',
            { key: 'list', className: 'space-y-3' },
            Array.from({ length: 4 }).map((_, i) =>
              React.createElement(
                'div',
                { key: i, className: 'flex gap-3' },
                [
                  React.createElement('div', {
                    key: 'number',
                    className: 'w-7 h-7 bg-muted rounded-full flex-shrink-0'
                  }),
                  React.createElement('div', {
                    key: 'text',
                    className: 'flex-1 space-y-2',
                  }, [
                    React.createElement('div', {
                      key: 'line1',
                      className: 'h-4 bg-muted rounded w-full'
                    }),
                    React.createElement('div', {
                      key: 'line2',
                      className: 'h-4 bg-muted rounded w-3/4'
                    })
                  ])
                ]
              )
            )
          )
        ]
      )
    ]
  );
};

export default RecipeSkeleton;