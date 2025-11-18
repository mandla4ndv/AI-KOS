import React from 'react';
import { ChefHat, Sparkles, Heart, Users } from 'lucide-react';
import '../styles/AboutPage.css';

const AboutPage = () => {
  return React.createElement(
    'div',
    { className: 'min-h-screen flex flex-col' },
    React.createElement(
      'main',
      { className: 'flex-1' },
      React.createElement(
        'div',
        { className: 'container py-12 md:py-16' },
        [
          React.createElement(
            'div',
            {
              key: 'hero',
              className: 'max-w-4xl mx-auto text-center mb-16 animate-fade-in'
            },
            [
              React.createElement(
                'h1',
                {
                  key: 'title',
                  className: 'text-4xl md:text-5xl font-bold mb-6 text-balance'
                },
                'About ',
                React.createElement(
                  'span',
                  { style: { color: 'var(--primary)' } },
                  'RecipeAI'
                )
              ),
              React.createElement(
                'p',
                {
                  key: 'description',
                  className: 'text-lg leading-relaxed max-w-2xl mx-auto',
                  style: { color: 'var(--muted-foreground)' }
                },
                "We're on a mission to make cooking more accessible, creative, and enjoyable for everyone through the power of AI."
              )
            ]
          ),
          React.createElement(
            'div',
            {
              key: 'content',
              className: 'max-w-5xl mx-auto space-y-16'
            },
            [
              React.createElement(
                'div',
                {
                  key: 'mission',
                  className: 'grid md:grid-cols-2 gap-12 items-center animate-slide-up'
                },
                [
                  React.createElement(
                    'div',
                    { key: 'text', className: 'space-y-6' },
                    [
                      React.createElement(
                        'div',
                        {
                          key: 'icon',
                          className: 'inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4',
                          style: { backgroundColor: 'var(--primary)', opacity: 0.1, color: 'var(--primary)' }
                        },
                        React.createElement(Heart, { size: 32 })
                      ),
                      React.createElement(
                        'h2',
                        {
                          key: 'title',
                          className: 'text-3xl font-bold'
                        },
                        'Our Mission'
                      ),
                      React.createElement(
                        'p',
                        {
                          key: 'p1',
                          className: 'leading-relaxed',
                          style: { color: 'var(--muted-foreground)' }
                        },
                        'At RecipeAI, we believe that great cooking should not be complicated. Our AI-powered platform transforms your available ingredients into delicious, personalized recipes, reducing food waste and inspiring culinary creativity.'
                      ),
                      React.createElement(
                        'p',
                        {
                          key: 'p2',
                          className: 'leading-relaxed',
                          style: { color: 'var(--muted-foreground)' }
                        },
                        "Whether you're a seasoned chef or a cooking beginner, RecipeAI adapts to your skill level and dietary preferences, making every meal an opportunity for discovery."
                      )
                    ]
                  ),
                  React.createElement(
                    'div',
                    {
                      key: 'image',
                      className: 'rounded-2xl p-8 h-96 flex items-center justify-center glass-card',
                      style: { 
                        background: 'linear-gradient(135deg, var(--primary) 20%, var(--secondary) 100%)',
                        opacity: 0.2
                      }
                    },
                    React.createElement(ChefHat, { size: 128, style: { color: 'var(--primary)' } })
                  )
                ]
              ),
              React.createElement(
                'div',
                {
                  key: 'features',
                  className: 'grid md:grid-cols-3 gap-8 animate-slide-up',
                  style: { animationDelay: '0.2s' }
                },
                [
                  {
                    icon: Sparkles,
                    title: 'AI-Powered',
                    description: 'Advanced artificial intelligence analyzes your ingredients and generates perfectly balanced, delicious recipes tailored to what you have on hand.'
                  },
                  {
                    icon: ChefHat,
                    title: 'Interactive Cooking',
                    description: 'Hands-free voice guidance, automatic timers, and step-by-step instructions make cooking effortless and enjoyable, even for complex recipes.'
                  },
                  {
                    icon: Users,
                    title: 'Community Driven',
                    description: 'Save your favorite recipes, share with friends, and join a community of home cooks discovering new flavors every day.'
                  }
                ].map((feature, index) =>
                  React.createElement(
                    'div',
                    {
                      key: feature.title,
                      className: 'space-y-4 p-6 rounded-xl border glass-card hover-lift'
                    },
                    [
                      React.createElement(
                        'div',
                        {
                          key: 'icon',
                          className: 'inline-flex items-center justify-center w-12 h-12 rounded-xl',
                          style: { backgroundColor: 'var(--primary)', opacity: 0.1, color: 'var(--primary)' }
                        },
                        React.createElement(feature.icon, { size: 24 })
                      ),
                      React.createElement(
                        'h3',
                        {
                          key: 'title',
                          className: 'text-xl font-semibold'
                        },
                        feature.title
                      ),
                      React.createElement(
                        'p',
                        {
                          key: 'desc',
                          className: 'text-sm leading-relaxed',
                          style: { color: 'var(--muted-foreground)' }
                        },
                        feature.description
                      )
                    ]
                  )
                )
              ),
              React.createElement(
                'div',
                {
                  key: 'story',
                  className: 'rounded-2xl p-8 md:p-12 animate-slide-up',
                  style: { 
                    backgroundColor: 'var(--muted)',
                    animationDelay: '0.3s'
                  }
                },
                [
                  React.createElement(
                    'h2',
                    {
                      key: 'title',
                      className: 'text-2xl md:text-3xl font-bold mb-6 text-center'
                    },
                    'Our Story'
                  ),
                  React.createElement(
                    'div',
                    {
                      key: 'content',
                      className: 'max-w-3xl mx-auto space-y-4 leading-relaxed',
                      style: { color: 'var(--muted-foreground)' }
                    },
                    [
                      React.createElement(
                        'p',
                        { key: 'p1' },
                        'RecipeAI was born from a simple observation: too many people struggle with what to cook, leading to food waste and repetitive meals. We saw an opportunity to combine cutting-edge AI technology with culinary expertise to solve this everyday challenge.'
                      ),
                      React.createElement(
                        'p',
                        { key: 'p2' },
                        'Our team of food enthusiasts, developers, and AI researchers came together with a shared passion for making cooking more accessible. We spent countless hours training our AI on diverse cuisines, cooking techniques, and nutritional science to create a tool that truly understands food.'
                      ),
                      React.createElement(
                        'p',
                        { key: 'p3' },
                        'Today, RecipeAI helps thousands of home cooks turn their ingredients into inspiring meals, reducing food waste and expanding culinary horizons one recipe at a time.'
                      )
                    ]
                  )
                ]
              )
            ]
          )
        ]
      )
    )
  );
};

export default AboutPage;