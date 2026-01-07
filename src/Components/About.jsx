import React, { useState } from 'react';
import './About.css';

const features = [
  {
    title: 'Neon-inspired UI',
    details: [
      'Features glowing outlines and vibrant highlights for futuristic appeal.',
      'Creates an immersive interface with dynamic lighting effects.',
      'Uses smooth transitions and animations to enhance user experience.',
      'Inspired by sci-fi control panels and high-tech command centers.'
    ]
  },
  {
    title: 'Voice Commands ',
    details: [
      'Enables hands-free interaction using built-in microphone access.',
      'Processes spoken commands in real time using AI.',
      'Executes tasks like map navigation, report generation, or alerts.',
      'Makes the system intuitive and accessible for all users.'
    ]
  },
  {
    title: 'Real-Time Chat ',
    details: [
      'Integrates a dynamic chat interface for AI interaction.',
      'Allows users to ask questions, get reports, or raise alerts.',
      'Supports natural language processing for human-like responses.',
      'Provides instant communication for faster decision-making.'
    ]
  },
  {
    title: 'Responsive Design',
    details: [
      'Adapts seamlessly to phones, tablets, and desktops.',
      'Maintains visual consistency and performance across devices.',
      'Ensures all users get a smooth experience regardless of screen size.',
      'Uses flexible grids and media queries for layout optimization.'
    ]
  },
  {
    title: 'Sci-Fi Theming',
    details: [
      'Inspired by futuristic control centers and space interfaces.',
      'Includes glowing frames, neon accents, and animated pulses.',
      'Immerses users in a high-tech, cinematic experience.',
      'Balances form and function with a creative visual edge.'
    ]
  },
 
];

const About = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleDetail = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="about-wrapper">
      <h2>About the System</h2>
      <ul className="feature-list">
        {features.map((feature, index) => (
          <li key={index} onClick={() => toggleDetail(index)}>
            <strong>{feature.title}</strong>
            {activeIndex === index && (
              <div className="feature-detail">
                {feature.details.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default About;
