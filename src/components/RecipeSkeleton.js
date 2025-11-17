import React from 'react';

const RecipeSkeleton = () => {
  const SkeletonLine = ({ width, height }) => {
    return React.createElement('div', {
      className: 'rounded bg-muted animate-pulse',
      style: { width, height }
    });
  };

  return React.createElement(
    'div',
    { className: 'card' },
    React.createElement(
      'div',
      { className: 'p-6' },
      [
        React.createElement(
          'div',
          {
            key: 'header',
            className: 'flex items-start justify-between gap-4 mb-4'
          },
          [
            React.createElement(SkeletonLine, { key: 'title', width: '70%', height: '32px' }),
            React.createElement(SkeletonLine, { key: 'badge', width: '64px', height: '24px' })
          ]
        ),
        React.createElement(
          'div',
          {
            key: 'meta',
            className: 'flex gap-4 mb-6'
          },
          [
            React.createElement(SkeletonLine, { key: 'time', width: '80px', height: '16px' }),
            React.createElement(SkeletonLine, { key: 'servings', width: '80px', height: '16px' }),
            React.createElement(SkeletonLine, { key: 'steps', width: '80px', height: '16px' })
          ]
        ),
        React.createElement(
          'div',
          { key: 'ingredients', className: 'mb-6' },
          [
            React.createElement(SkeletonLine, { key: 'title', width: '96px', height: '24px', className: 'mb-3' }),
            React.createElement(
              'div',
              { key: 'list', className: 'grid grid-cols-1 md:grid-cols-2 gap-2' },
              Array.from({ length: 4 }, (_, i) =>
                React.createElement(SkeletonLine, { key: i, width: '100%', height: '40px' })
              )
            )
          ]
        ),
        React.createElement(
          'div',
          { key: 'instructions', className: 'mb-6' },
          [
            React.createElement(SkeletonLine, { key: 'title', width: '96px', height: '24px', className: 'mb-3' }),
            React.createElement(
              'div',
              { key: 'list', className: 'space-y-3' },
              Array.from({ length: 5 }, (_, i) =>
                React.createElement(
                  'div',
                  { key: i, className: 'flex gap-3' },
                  [
                    React.createElement(SkeletonLine, { key: 'number', width: '28px', height: '28px', className: 'rounded-full' }),
                    React.createElement(SkeletonLine, { key: 'desc', width: '100%', height: '48px' })
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

export default RecipeSkeleton;