import React from 'react';
import { ChefHat, Sparkles, Heart, Users, Target, Globe, Shield, MapPin, Phone, Mail, Facebook, MessageCircle, Building, Utensils, Brain, Target as TargetIcon, Globe2, ShieldCheck } from 'lucide-react';
import '../styles/AboutPage.css';

const AboutPage = () => {
  const features = [
    {
      icon: Brain,
      title: 'AI-Powered Recipes',
      description: 'Our advanced AI analyzes your ingredients and creates perfectly balanced, delicious recipes tailored to what you have available, reducing food waste and inspiring creativity.'
    },
    {
      icon: Utensils,
      title: 'Interactive Cooking',
      description: 'Step-by-step voice guidance, automatic timers, and hands-free instructions make cooking effortless and enjoyable for both beginners and experienced chefs.'
    },
    {
      icon: Users,
      title: 'Community Driven',
      description: 'Save your favorite recipes, share creations with friends, and join a growing community of home cooks discovering new flavors and techniques every day.'
    },
    {
      icon: TargetIcon,
      title: 'Personalized Experience',
      description: 'Customize recipes based on dietary preferences, skill level, and available equipment. AI-KOS adapts to your unique cooking style and needs.'
    },
    {
      icon: Globe2,
      title: 'Global Cuisine',
      description: 'Explore recipes from around the world. Our AI draws from diverse culinary traditions to bring international flavors to your kitchen.'
    },
    {
      icon: ShieldCheck,
      title: 'Food Safety First',
      description: 'Intelligent food pairing and cooking temperature recommendations ensure every meal is not only delicious but also safe and properly prepared.'
    }
  ];

  const handleShare = (platform) => {
    const url = window.location.href;
    const text = "Check out AI-KOS - Amazing AI-powered cooking assistant!";
    
    switch(platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(text)}&body=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      default:
        break;
    }
  };

  return React.createElement(
    'div',
    { className: 'min-h-screen flex flex-col' },
    [
      React.createElement(
        'main',
        { 
          key: 'main',
          className: 'flex-1 about-main' 
        },
        React.createElement(
          'div',
          { className: 'container about-container' },
          [
            React.createElement(
              'div',
              {
                key: 'hero',
                className: 'about-hero'
              },
              [
                React.createElement(
                  'h1',
                  {
                    key: 'title',
                    className: 'about-hero-title'
                  },
                  'Revolutionizing Home Cooking with '
                ),
                React.createElement(
                  'span',
                  {
                    key: 'brand',
                    className: 'about-brand-gradient'
                  },
                  'Artificial Intelligence'
                ),
                React.createElement(
                  'p',
                  {
                    key: 'description',
                    className: 'about-hero-description'
                  },
                  "AI-KOS transforms how people cook by leveraging cutting-edge AI to create personalized recipes, reduce food waste, and make every meal an opportunity for culinary discovery."
                )
              ]
            ),

            React.createElement(
              'div',
              {
                key: 'mission',
                className: 'about-mission-section'
              },
              [
                React.createElement(
                  'div',
                  {
                    key: 'mission-content',
                    className: 'about-mission-grid'
                  },
                  [
                    React.createElement(
                      'div',
                      { key: 'text', className: 'about-mission-text' },
                      [
                        React.createElement(
                          'div',
                          {
                            key: 'icon',
                            className: 'about-mission-icon'
                          },
                          React.createElement(Building, { 
                            size: 32,
                            className: 'urban-icon'
                          })
                        ),
                        React.createElement(
                          'h2',
                          {
                            key: 'title',
                            className: 'about-mission-title'
                          },
                          'Our Mission'
                        ),
                        React.createElement(
                          'p',
                          {
                            key: 'p1',
                            className: 'about-mission-paragraph'
                          },
                          'At AI-KOS, we believe that great cooking should be accessible to everyone. We\'re committed to eliminating the stress of meal planning and reducing global food waste through intelligent technology.'
                        ),
                        React.createElement(
                          'p',
                          {
                            key: 'p2',
                            className: 'about-mission-paragraph'
                          },
                          'Our platform empowers home cooks of all skill levels to create restaurant-quality meals using ingredients they already have, fostering creativity and confidence in the kitchen.'
                        ),
                        React.createElement(
                          'div',
                          {
                            key: 'stats',
                            className: 'about-mission-stats'
                          },
                          [
                            React.createElement(
                              'div',
                              { key: 'stat1', className: 'about-stat' },
                              [
                                React.createElement(
                                  'div',
                                  { key: 'number', className: 'about-stat-number' },
                                  '10K+'
                                ),
                                React.createElement(
                                  'div',
                                  { key: 'label', className: 'about-stat-label' },
                                  'Recipes Generated'
                                )
                              ]
                            ),
                            React.createElement(
                              'div',
                              { key: 'stat2', className: 'about-stat' },
                              [
                                React.createElement(
                                  'div',
                                  { key: 'number', className: 'about-stat-number' },
                                  '85%'
                                ),
                                React.createElement(
                                  'div',
                                  { key: 'label', className: 'about-stat-label' },
                                  'Reduced Food Waste'
                                )
                              ]
                            ),
                            React.createElement(
                              'div',
                              { key: 'stat3', className: 'about-stat' },
                              [
                                React.createElement(
                                  'div',
                                  { key: 'number', className: 'about-stat-number' },
                                  '50K+'
                                ),
                                React.createElement(
                                  'div',
                                  { key: 'label', className: 'about-stat-label' },
                                  'Happy Cooks'
                                )
                              ]
                            )
                          ]
                        )
                      ]
                    ),
                    React.createElement(
                      'div',
                      {
                        key: 'visual',
                        className: 'about-mission-visual'
                      },
                      React.createElement('img', {
                        src: '/logoKos.png',
                        alt: 'AI-KOS Mission',
                        className: 'mission-image'
                      })
                    )
                  ]
                )
              ]
            ),

            React.createElement(
              'div',
              {
                key: 'features',
                className: 'about-features-section'
              },
              [
                React.createElement(
                  'h2',
                  {
                    key: 'title',
                    className: 'about-features-title'
                  },
                  'Why Choose AI-KOS?'
                ),
                React.createElement(
                  'div',
                  {
                    key: 'grid',
                    className: 'about-features-grid'
                  },
                  features.map((feature, index) =>
                    React.createElement(
                      'div',
                      {
                        key: feature.title,
                        className: 'about-feature-card'
                      },
                      [
                        React.createElement(
                          'div',
                          {
                            key: 'icon',
                            className: 'about-feature-icon'
                          },
                          React.createElement(feature.icon, { 
                            size: 32,
                            className: 'urban-icon'
                          })
                        ),
                        React.createElement(
                          'h3',
                          {
                            key: 'title',
                            className: 'about-feature-title'
                          },
                          feature.title
                        ),
                        React.createElement(
                          'p',
                          {
                            key: 'desc',
                            className: 'about-feature-description'
                          },
                          feature.description
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
                key: 'story',
                className: 'about-story-section'
              },
              [
                React.createElement(
                  'h2',
                  {
                    key: 'title',
                    className: 'about-story-title'
                  },
                  'Our Story'
                ),
                React.createElement(
                  'div',
                  {
                    key: 'text',
                    className: 'about-story-text'
                  },
                  [
                    React.createElement(
                      'p',
                      { key: 'p1', className: 'about-story-paragraph' },
                      'AI-KOS was founded in 2023 by a team of food scientists, AI researchers, and culinary experts who shared a common frustration: the disconnect between available ingredients and meal inspiration. We noticed that despite abundance, many households struggled with food waste and repetitive meals.'
                    ),
                    React.createElement(
                      'p',
                      { key: 'p2', className: 'about-story-paragraph' },
                      'Leveraging cutting-edge machine learning and natural language processing, we developed a platform that understands ingredients, flavors, and cooking techniques. Our AI doesn\'t just generate recipes—it understands culinary principles, nutritional balance, and cultural cooking traditions.'
                    ),
                    React.createElement(
                      'p',
                      { key: 'p3', className: 'about-story-paragraph' },
                      'Today, AI-KOS serves thousands of home cooks worldwide, helping transform ordinary ingredients into extraordinary meals while promoting sustainable cooking practices and reducing food waste by up to 85%.'
                    )
                  ]
                )
              ]
            )
          ]
        )
      ),

      // Floating Share Buttons
      React.createElement(
        'div',
        {
          key: 'floating-buttons',
          className: 'floating-share-buttons'
        },
        [
          React.createElement(
            'button',
            {
              key: 'whatsapp',
              className: 'floating-button whatsapp-button',
              onClick: () => handleShare('whatsapp'),
              title: 'Share on WhatsApp'
            },
            React.createElement(MessageCircle, { 
              size: 20,
              className: 'floating-icon'
            })
          ),
          React.createElement(
            'button',
            {
              key: 'facebook',
              className: 'floating-button facebook-button',
              onClick: () => handleShare('facebook'),
              title: 'Share on Facebook'
            },
            React.createElement(Facebook, { 
              size: 20,
              className: 'floating-icon'
            })
          ),
          React.createElement(
            'button',
            {
              key: 'email',
              className: 'floating-button email-button',
              onClick: () => handleShare('email'),
              title: 'Share via Email'
            },
            React.createElement(Mail, { 
              size: 20,
              className: 'floating-icon'
            })
          )
        ]
      ),

      // Footer
      React.createElement(
        'footer',
        {
          key: 'footer',
          className: 'about-footer'
        },
        React.createElement(
          'div',
          { className: 'container' },
          [
            React.createElement(
              'div',
              {
                key: 'footer-content',
                className: 'footer-content'
              },
              [
                React.createElement(
                  'div',
                  {
                    key: 'info',
                    className: 'footer-info'
                  },
                  [
                    React.createElement(
                      'h3',
                      {
                        key: 'title',
                        className: 'footer-title'
                      },
                      'AI-KOS'
                    ),
                    React.createElement(
                      'p',
                      {
                        key: 'desc',
                        className: 'footer-description'
                      },
                      'Transforming home cooking with artificial intelligence. Create amazing meals with what you have, reduce food waste, and discover new culinary possibilities.'
                    ),
                    React.createElement(
                      'div',
                      {
                        key: 'contact',
                        className: 'footer-contact'
                      },
                      [
                        React.createElement(
                          'div',
                          {
                            key: 'phone',
                            className: 'contact-item'
                          },
                          [
                            React.createElement(Phone, { 
                              key: 'icon', 
                              size: 16,
                              className: 'contact-icon'
                            }),
                            React.createElement(
                              'span',
                              { key: 'text' },
                              '+1 (555) 123-4567'
                            )
                          ]
                        ),
                        React.createElement(
                          'div',
                          {
                            key: 'email',
                            className: 'contact-item'
                          },
                          [
                            React.createElement(Mail, { 
                              key: 'icon', 
                              size: 16,
                              className: 'contact-icon'
                            }),
                            React.createElement(
                              'span',
                              { key: 'text' },
                              'hello@ai-kos.com'
                            )
                          ]
                        ),
                        React.createElement(
                          'div',
                          {
                            key: 'address',
                            className: 'contact-item'
                          },
                          [
                            React.createElement(MapPin, { 
                              key: 'icon', 
                              size: 16,
                              className: 'contact-icon'
                            }),
                            React.createElement(
                              'span',
                              { key: 'text' },
                              '123 Culinary Street, Food City'
                            )
                          ]
                        )
                      ]
                    )
                  ]
                ),
                React.createElement(
                  'div',
                  {
                    key: 'map',
                    className: 'footer-map'
                  },
                  [
                    React.createElement(
                      'h4',
                      {
                        key: 'title',
                        className: 'map-title'
                      },
                      'Visit Us'
                    ),
                    React.createElement(
                      'div',
                      {
                        key: 'map-container',
                        className: 'map-container'
                      },
                      React.createElement('iframe', {
                        src: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3024.177631294649!2d-74.00594908459418!3d40.71274377933085!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c25a316e12bcdd%3A0x5bc9c2e76a1b4b0!2sTimes%20Square%2C%20New%20York%2C%20NY%2010036%2C%20USA!5e0!3m2!1sen!2sza!4v1700000000000!5m2!1sen!2sza",
                        width: "100%",
                        height: "100%",
                        style: { border: 0 },
                        allowFullScreen: true,
                        loading: "lazy",
                        referrerPolicy: "no-referrer-when-downgrade",
                        title: "AI-KOS Location"
                      })
                    )
                  ]
                )
              ]
            ),
            React.createElement(
              'div',
              {
                key: 'copyright',
                className: 'footer-copyright'
              },
              `© ${new Date().getFullYear()} AI-KOS. All rights reserved.`
            )
          ]
        )
      )
    ]
  );
};

export default AboutPage;