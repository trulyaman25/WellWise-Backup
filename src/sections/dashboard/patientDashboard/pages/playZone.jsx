import React from 'react';
import { Leaf } from 'lucide-react';

const projects = [
  {
    title: "Snake Game",
    link: "https://wellwise-snake-game.netlify.app/",
    image: "1.jpg",
    description: "Enhance focus and quick decision-making skills with this classic game."
  },
  {
    title: "Jigsaw Puzzle",
    link: "https://wellwise-jigsaw-puzzle.netlify.app/",
    image: "2.jpg",
    description: "Improve spatial awareness and patience through piecing together beautiful images."
  },
  {
    title: "Sketch It",
    link: "https://wellwise-sketch-it.netlify.app/",
    image: "3.png",
    description: "Unleash creativity and reduce stress through digital drawing."
  },
  {
    title: "Flipcard Game",
    link: "https://wellwise-flipcard-game.netlify.app/",
    image: "4.jpg",
    description: "Boost memory and concentration by matching pairs of cards."
  },
];

// Summary of the WellWise Cognitive Play Zone
const playzoneInfo = {
  title: "WellWise Cognitive Play Zone",
  description: "A safe space designed to help you engage your mind, uplift your spirits, and regain focus through interactive games.",
  benefits: [
    "Boost Your Mood: Release stress and foster happiness through playful interaction.",
    "Strengthen Your Mind: Sharpen cognitive and memory skills while enjoying yourself.",
    "Mindful Diversion: Shift focus from overwhelming emotions to engaging challenges.",
    "Self-Care in Action: Take simple, enjoyable steps toward better mental well-being."
  ]
};

/**
 * ProjectCard component to display individual game information
 */
const ProjectCard = ({ title, link, image, description }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-lg transform transition duration-300 hover:scale-105 border border-green-200">
      <img src={image} alt={title} className="w-full h-48 object-cover" />
      <div className="p-6">
        <h2 className="text-xl font-bold text-green-800 mb-2">{title}</h2>
        <p className="text-gray-600 text-sm mb-4">{description}</p>
        <a 
          href={link} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="inline-block bg-green-500 text-white font-bold py-2 px-4 rounded hover:bg-green-600 transition duration-300"
        >
          Play Game
        </a>
      </div>
    </div>
  );
};

/**
 * ProjectGrid component to display all game projects
 */
const ProjectGrid = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
      {projects.map((project, index) => (
        <ProjectCard
          key={index}
          title={project.title}
          link={project.link}
          image={project.image}
          description={project.description}
        />
      ))}
    </div>
  );
};

/**
 * CognitivePlayZone component that combines introduction and project grid
 */
const CognitivePlayZone = () => {
  return (
    <div className="min-h-screen bg-green-50">
      <div className="container mx-auto px-4 py-12">
        <header className="text-center mb-12">
          <Leaf className="inline-block text-green-500 mb-4" size={48} />
          <h1 className="text-4xl font-bold text-green-800 mb-4">{playzoneInfo.title}</h1>
          <p className="text-xl text-green-700 max-w-2xl mx-auto">{playzoneInfo.description}</p>
        </header>
        
        <section className="bg-white rounded-lg shadow-lg p-8 mb-12">
          <h2 className="text-2xl font-semibold text-green-800 mb-6">Why Play Our Games?</h2>
          <ul className="space-y-4">
            {playzoneInfo.benefits.map((benefit, index) => (
              <li key={index} className="flex items-start">
                <span className="inline-block bg-green-500 rounded-full p-1 mr-3 mt-1">
                  <Leaf className="text-white" size={16} />
                </span>
                <span className="text-gray-700">{benefit}</span>
              </li>
            ))}
          </ul>
        </section>
        
        <section className="mb-12">
          <h2 className="text-3xl font-semibold text-green-800 mb-8 text-center">Our Games</h2>
          <ProjectGrid />
        </section>
        
        <footer className="text-center bg-white rounded-lg shadow-lg p-8">
          <h2 className="text-2xl font-semibold text-green-800 mb-4">Let's Begin!</h2>
          <p className="text-gray-700 mb-4">Take a moment for yourself—because you deserve it. Choose a game, immerse yourself in the experience, and feel the positive shift as you play.</p>
          <p className="text-green-700 font-semibold">Your journey to better mental health starts with a single click. Let's play!</p>
        </footer>
      </div>
    </div>
  );
};

export default CognitivePlayZone;