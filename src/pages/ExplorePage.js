import React, { useState } from 'react';
import { Search, Clock, TrendingUp, ChefHat } from 'lucide-react';

const ExplorePage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCuisine, setSelectedCuisine] = useState(null);
  const [selectedDietary, setSelectedDietary] = useState(null);

  const popularCategories = [
    { name: 'Quick & Easy', count: 156, icon: Clock, color: 'badge-primary' },
    { name: 'Trending Now', count: 89, icon: TrendingUp, color: 'badge-secondary' },
    { name: "Chef's Special", count: 42, icon: ChefHat, color: 'badge-primary' },
  ];

  const cuisineTypes = [
    'Italian', 'Mexican', 'Asian', 'Mediterranean', 'American', 
    'Indian', 'Thai', 'French', 'Japanese', 'Greek'
  ];

  const dietaryPreferences = [
    'Vegetarian', 'Vegan', 'Gluten-Free', 'Keto', 'Paleo', 
    'Low-Carb', 'High-Protein', 'Dairy-Free'
  ];

  const featuredRecipes = [
    {
      id: 1,
      title: 'Creamy Tuscan Chicken',
      image: '/creamy-tuscan-chicken-with-spinach-and-sun-dried-t.jpg',
      time: '30 min',
      difficulty: 'Easy',
      cuisine: 'Italian',
    },
    {
      id: 2,
      title: 'Spicy Thai Basil Stir-Fry',
      image: '/thai-basil-chicken-stir-fry-with-vegetables.jpg',
      time: '25 min',
      difficulty: 'Medium',
      cuisine: 'Thai',
    },
    {
      id: 3,
      title: 'Mediterranean Buddha Bowl',
      image: '/mediterranean-buddha-bowl-with-hummus-and-falafel.jpg',
      time: '20 min',
      difficulty: 'Easy',
      cuisine: 'Mediterranean',
    },
    {
      id: 4,
      title: 'Classic Beef Tacos',
      image: '/beef-tacos-with-fresh-toppings-and-guacamole.jpg',
      time: '35 min',
      difficulty: 'Easy',
      cuisine: 'Mexican',
    },
    {
      id: 5,
      title: 'Honey Garlic Salmon',
      image: '/honey-glazed-salmon.png',
      time: '25 min',
      difficulty: 'Medium',
      cuisine: 'Asian',
    },
    {
      id: 6,
      title: 'Mushroom Risotto',
      image: '/images/menu/risotto.png',
      time: '45 min',
      difficulty: 'Medium',
      cuisine: 'Italian',
    },
  ];

  return React.createElement(
    'div',
    { className: 'min-h-screen flex flex-col' },
    React.createElement(
      'main',
      { className: 'flex-1' },
      React.createElement(
        'div',
        { className: 'container py-12' },
        [
          React.createElement(
            'div',
            {
              key: 'hero',
              className: 'max-w-4xl mx-auto text-center mb-12 animate-fade-in'
            },
            [
              React.createElement(
                'h1',
                {
                  key: 'title',
                  className: 'text-4xl md:text-5xl font-bold mb-4 text-balance'
                },
                'Explore ',
                React.createElement(
                  'span',
                  { style: { color: 'var(--primary)' } },
                  'Delicious Recipes'
                )
              ),
              React.createElement(
                'p',
                {
                  key: 'subtitle',
                  className: 'text-lg mb-8 leading-relaxed',
                  style: { color: 'var(--muted-foreground)' }
                },
                'Discover thousands of AI-generated recipes from cuisines around the world'
              ),
              React.createElement(
                'div',
                {
                  key: 'search',
                  className: 'relative max-w-2xl mx-auto'
                },
                [
                  React.createElement(Search, {
                    key: 'icon',
                    className: 'absolute left-4 top-1/2 transform -translate-y-1/2',
                    size: 20,
                    style: { color: 'var(--muted-foreground)' }
                  }),
                  React.createElement('input', {
                    key: 'input',
                    type: 'text',
                    placeholder: 'Search for recipes, ingredients, or cuisines...',
                    value: searchQuery,
                    onChange: (e) => setSearchQuery(e.target.value),
                    className: 'input pl-12',
                    style: { height: '56px', fontSize: '18px' }
                  })
                ]
              )
            ]
          ),
          React.createElement(
            'div',
            {
              key: 'categories',
              className: 'mb-12 animate-slide-up'
            },
            [
              React.createElement(
                'h2',
                {
                  key: 'title',
                  className: 'text-2xl font-bold mb-6'
                },
                'Popular Categories'
              ),
              React.createElement(
                'div',
                {
                  key: 'grid',
                  className: 'grid md:grid-cols-3 gap-6'
                },
                popularCategories.map((category, index) =>
                  React.createElement(
                    'div',
                    {
                      key: category.name,
                      className: 'p-6 rounded-xl border glass-card hover-lift cursor-pointer animate-slide-up',
                      style: { animationDelay: `${index * 0.1}s` }
                    },
                    [
                      React.createElement(
                        'div',
                        {
                          key: 'icon',
                          className: `inline-flex items-center justify-center w-12 h-12 rounded-xl mb-4 ${category.color}`
                        },
                        React.createElement(category.icon, { size: 24 })
                      ),
                      React.createElement(
                        'h3',
                        {
                          key: 'name',
                          className: 'text-xl font-semibold mb-2'
                        },
                        category.name
                      ),
                      React.createElement(
                        'p',
                        {
                          key: 'count',
                          className: 'text-sm',
                          style: { color: 'var(--muted-foreground)' }
                        },
                        `${category.count} recipes`
                      )
                    ]
                  )
                )
              )
            ]
          ),
          React.createElement(
            'div',
            {
              key: 'filters',
              className: 'space-y-6 mb-12 animate-slide-up',
              style: { animationDelay: '0.2s' }
            },
            [
              React.createElement(
                'div',
                { key: 'cuisine' },
                [
                  React.createElement(
                    'h3',
                    {
                      key: 'title',
                      className: 'text-lg font-semibold mb-3'
                    },
                    'Filter by Cuisine'
                  ),
                  React.createElement(
                    'div',
                    {
                      key: 'buttons',
                      className: 'flex flex-wrap gap-2'
                    },
                    cuisineTypes.map((cuisine) =>
                      React.createElement(
                        'span',
                        {
                          key: cuisine,
                          className: `badge cursor-pointer px-4 py-2 text-sm transition-colors ${selectedCuisine === cuisine ? 'badge-primary' : 'badge-outline'}`,
                          onClick: () => setSelectedCuisine(selectedCuisine === cuisine ? null : cuisine)
                        },
                        cuisine
                      )
                    )
                  )
                ]
              ),
              React.createElement(
                'div',
                { key: 'dietary' },
                [
                  React.createElement(
                    'h3',
                    {
                      key: 'title',
                      className: 'text-lg font-semibold mb-3'
                    },
                    'Dietary Preferences'
                  ),
                  React.createElement(
                    'div',
                    {
                      key: 'buttons',
                      className: 'flex flex-wrap gap-2'
                    },
                    dietaryPreferences.map((dietary) =>
                      React.createElement(
                        'span',
                        {
                          key: dietary,
                          className: `badge cursor-pointer px-4 py-2 text-sm transition-colors ${selectedDietary === dietary ? 'badge-primary' : 'badge-outline'}`,
                          onClick: () => setSelectedDietary(selectedDietary === dietary ? null : dietary)
                        },
                        dietary
                      )
                    )
                  )
                ]
              )
            ]
          ),
          React.createElement(
            'div',
            {
              key: 'recipes',
              className: 'animate-slide-up',
              style: { animationDelay: '0.3s' }
            },
            [
              React.createElement(
                'h2',
                {
                  key: 'title',
                  className: 'text-2xl font-bold mb-6'
                },
                'Featured Recipes'
              ),
              React.createElement(
                'div',
                {
                  key: 'grid',
                  className: 'grid md:grid-cols-2 lg:grid-cols-3 gap-6'
                },
                featuredRecipes.map((recipe, index) =>
                  React.createElement(
                    'div',
                    {
                      key: recipe.id,
                      className: 'group rounded-xl overflow-hidden border glass-card hover-lift cursor-pointer animate-slide-up',
                      style: { animationDelay: `${0.3 + index * 0.05}s` }
                    },
                    [
                      React.createElement(
                        'div',
                        {
                          key: 'image',
                          className: 'aspect-[4/3] relative overflow-hidden'
                        },
                        [
                          React.createElement('img', {
                            key: 'img',
                            src: recipe.image || '/placeholder.svg',
                            alt: recipe.title,
                            className: 'w-full h-full object-cover transition-transform group-hover:scale-110'
                          }),
                          React.createElement(
                            'div',
                            {
                              key: 'badge',
                              className: 'absolute top-3 right-3'
                            },
                            React.createElement(
                              'span',
                              { className: 'badge badge-primary' },
                              recipe.cuisine
                            )
                          )
                        ]
                      ),
                      React.createElement(
                        'div',
                        { key: 'content', className: 'p-4 space-y-2' },
                        [
                          React.createElement(
                            'h3',
                            {
                              key: 'title',
                              className: 'font-semibold text-lg transition-colors group-hover:text-primary'
                            },
                            recipe.title
                          ),
                          React.createElement(
                            'div',
                            {
                              key: 'meta',
                              className: 'flex items-center gap-4 text-sm',
                              style: { color: 'var(--muted-foreground)' }
                            },
                            [
                              React.createElement(
                                'div',
                                { key: 'time', className: 'flex items-center gap-1' },
                                [
                                  React.createElement(Clock, { key: 'icon', size: 16 }),
                                  recipe.time
                                ]
                              ),
                              React.createElement(
                                'span',
                                {
                                  key: 'difficulty',
                                  className: 'badge badge-outline text-xs'
                                },
                                recipe.difficulty
                              )
                            ]
                          )
                        ]
                      )
                    ]
                  )
                )
              )
            ]
          )
        ]
      )
    )
  );
};

export default ExplorePage;