import { useEffect, useState } from 'react';
import Sidebar from './Sidebar';
import { UserButton } from '@clerk/nextjs';

const RecipeSuggestions = ({ handleOpen, handleOpenCamera }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [parsedRecipe, setParsedRecipe] = useState(null);
  const [loadingMessage, setLoadingMessage] = useState("Your recipe suggestions will appear here");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const [isWideScreen, setIsWideScreen] = useState(true);

  useEffect(() => {
    const handleResize = () => {
      setIsWideScreen(window.innerWidth >= 825);
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const savedRecipe = localStorage.getItem('savedRecipe');
    if (savedRecipe) {
      setParsedRecipe(JSON.parse(savedRecipe));
    }
  }, []);

  const generateRecipe = async () => {
    setParsedRecipe(null);
    setLoadingMessage("Generating.");
    let dots = 1;
    const intervalId = setInterval(() => {
      setLoadingMessage(`Generating${'.'.repeat(dots)}`);
      dots = (dots % 3) + 1;
    }, 500);

    try {
      const response = await fetch('/api/GenerateRecipe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      const data = await response.text();
      parseRecipe(data);
      clearInterval(intervalId);
    } catch (error) {
      console.error('Error generating recipe:', error);
      clearInterval(intervalId);
      setLoadingMessage("Error generating recipe.");
    }
  };

  const parseRecipe = (data) => {
    const lines = data.split('\n');
    const title = lines[0].replace('Generated Recipe:', '').trim();
    const difficulty = lines[2].replace('**Difficulty:**', '').trim();
    const time = lines[3].replace('**Time:**', '').trim();
    const servings = lines[4].replace('**Servings:**', '').trim();

    const ingredientsStartIndex = lines.findIndex(line => line.trim() === '**Ingredients:**') + 1;
    const instructionsStartIndex = lines.findIndex(line => line.trim() === '**Instructions:**') + 1;

    const ingredients = lines.slice(ingredientsStartIndex, instructionsStartIndex - 1).map(line => line.trim().replace('-', '').trim()).filter(line => line);
    const instructions = lines.slice(instructionsStartIndex).map(line => line.replace(/^\d+\.\s*/, '').trim()).filter(line => line);

    const instructionSections = [];
    let currentSection = null;
    instructions.forEach((instruction) => {
      if (instruction.startsWith('**') && instruction.endsWith('**')) {
        if (currentSection) {
          instructionSections.push(currentSection);
        }
        currentSection = { title: instruction.replace(/\*\*/g, ''), steps: [] };
      } else if (currentSection) {
        currentSection.steps.push(instruction.replace('-', '').trim());
      }
    });
    if (currentSection) {
      instructionSections.push(currentSection);
    }

    const noteIndex = instructions.findIndex(instruction => instruction.startsWith('This'));
    const note = noteIndex !== -1 ? instructions[noteIndex] : '';

    const recipe = { title, difficulty, time, servings, ingredients, instructionSections, note };
    setParsedRecipe(recipe);
    localStorage.setItem('savedRecipe', JSON.stringify(recipe));
  };

  return (
    <div className="overflow-x-hidden text-neutral-300 antialiased">
      <div className="fixed top-0 left-0 w-full z-20 shadow-md">
        <div className={`bg-blue-200 text-gray-700 py-4 px-8 flex items-center shadow-sm transition-all duration-300 ${isSidebarOpen && isWideScreen ? 'ml-64' : 'ml-0'}`}>
          <div className="flex items-center">
            <button
              className="p-2 bg-gray-700 text-white rounded-md mr-4"
              onClick={toggleSidebar}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
              </svg>
            </button>
            <h1 className="text-3xl font-bold hidden sm:block">Pantry Tracker</h1>
          </div>
          <div className="ml-auto">
            <UserButton />
          </div>
        </div>
      </div>
      <div className="fixed top-0 -z-10 h-full w-full">
        <div className="absolute top-0 z-[-2] h-screen w-screen bg-white bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.3),rgba(255,255,255,0))]"></div>
      </div>
      <div className="flex flex-col items-center h-screen pt-20">
        <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} handleOpen={handleOpen} handleOpenCamera={handleOpenCamera} />
        <div className={`flex-1 p-6 transition-all duration-300 ${isSidebarOpen && isWideScreen ? 'ml-64' : 'ml-0'}`}>
          <div className="w-full flex flex-col items-center gap-2">
            <div className="w-full sm:w-[430px] md:w-[640px] lg:w-[800px] xl:w-[1050px] bg-white rounded-lg shadow-lg p-8 mx-auto">
              <h1 className="text-2xl font-bold text-gray-700 text-center">Recipe Suggestions</h1>
              <hr className="my-4" />
              <div className="text-gray-500">
                {parsedRecipe ? (
                  <div>
                    <h2 className="text-3xl font-bold text-center">{parsedRecipe.title}</h2>
                    <div className="flex justify-center my-4 flex-wrap gap-2">
                      <div className="flex items-center bg-gray-200 px-3 py-1 rounded">
                        <span>{parsedRecipe.difficulty}</span>
                      </div>
                      <div className="flex items-center bg-gray-200 px-3 py-1 rounded">
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3"></path>
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 2a10 10 0 100 20 10 10 0 000-20z"></path>
                        </svg>
                        <span className="ml-1">Time: {parsedRecipe.time}</span>
                      </div>
                      <div className="flex items-center bg-gray-200 px-3 py-1 rounded">
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5c-1.93 0-3.68.74-5 2m10 0c-1.32-1.26-3.07-2-5-2m-1 10v-4h2v4m-6 0v-4h2v4m-8 0V7h18v10H2z"></path>
                        </svg>
                        <span className="ml-1">Servings: {parsedRecipe.servings}</span>
                      </div>
                    </div>
                    <hr className="my-4" />
                    <h3 className="text-lg font-bold mt-3 mb-2">Ingredients</h3>
                    <ul className="list-disc ml-5">
                      {parsedRecipe.ingredients.map((ingredient, index) => (
                        <li key={index}>{ingredient}</li>
                      ))}
                    </ul>
                    <h3 className="text-lg font-bold mt-3 mb-2">Instructions</h3>
                    <ol className="list-decimal ml-5 space-y-4">
                      {parsedRecipe.instructionSections.map((section, index) => (
                        <li key={index}>
                          <strong>{section.title}</strong>
                          <ul className="list-disc ml-5 space-y-2">
                            {section.steps.map((step, stepIndex) => (
                              <li key={stepIndex}>{step}</li>
                            ))}
                          </ul>
                        </li>
                      ))}
                    </ol>
                    <p className="mt-4">{parsedRecipe.note}</p>
                  </div>
                ) : (
                  <div className="h-32 bg-gray-200 rounded-lg flex items-center justify-center overflow-hidden">
                    <span className="text-gray-700 px-4 text-xl">{loadingMessage}</span>
                  </div>
                )}
              </div>
              <button onClick={generateRecipe} className="bg-gradient-to-r from-blue-200 to-blue-400 
                hover:from-blue-400 hover:to-blue-600 text-white px-4 py-2 rounded mt-4">
                Generate Recipe
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecipeSuggestions;
