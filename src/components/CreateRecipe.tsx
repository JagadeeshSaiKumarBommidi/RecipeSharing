import React, { useState } from 'react';
import { X, Plus, Upload, Camera, Video, Clock, Users, ChefHat } from 'lucide-react';

interface CreateRecipeProps {
  onClose: () => void;
}

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

interface Instruction {
  step: number;
  instruction: string;
}

export const CreateRecipe: React.FC<CreateRecipeProps> = ({ onClose }) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [recipeData, setRecipeData] = useState({
    title: '',
    description: '',
    cookingTime: '',
    difficulty: 'Easy',
    category: 'Breakfast',
    images: [] as string[],
    videos: [] as string[]
  });
  
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: '', amount: '', unit: 'cups' }
  ]);
  
  const [instructions, setInstructions] = useState<Instruction[]>([
    { step: 1, instruction: '' }
  ]);

  const difficulties = ['Easy', 'Medium', 'Hard'];
  const categories = ['Breakfast', 'Lunch', 'Dinner', 'Dessert', 'Snack', 'Beverage'];
  const units = ['cups', 'tbsp', 'tsp', 'oz', 'lbs', 'grams', 'ml', 'liters', 'pieces', 'cloves'];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setRecipeData(prev => ({
          ...prev,
          images: [...prev.images, result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setRecipeData(prev => ({
          ...prev,
          videos: [...prev.videos, result]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: 'cups' }]);
  };

  const removeIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const updateIngredient = (index: number, field: keyof Ingredient, value: string) => {
    const updated = ingredients.map((ingredient, i) => 
      i === index ? { ...ingredient, [field]: value } : ingredient
    );
    setIngredients(updated);
  };

  const addInstruction = () => {
    setInstructions([...instructions, { step: instructions.length + 1, instruction: '' }]);
  };

  const removeInstruction = (index: number) => {
    const updated = instructions.filter((_, i) => i !== index);
    const reordered = updated.map((instruction, i) => ({ ...instruction, step: i + 1 }));
    setInstructions(reordered);
  };

  const updateInstruction = (index: number, value: string) => {
    const updated = instructions.map((instruction, i) => 
      i === index ? { ...instruction, instruction: value } : instruction
    );
    setInstructions(updated);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const payload = {
        ...recipeData,
        cookingTime: parseInt(recipeData.cookingTime),
        ingredients: ingredients.filter(ing => ing.name && ing.amount),
        instructions: instructions.filter(inst => inst.instruction)
      };

      const response = await fetch('http://localhost:5000/api/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        onClose();
        // Optionally refresh the feed or show success message
      }
    } catch (error) {
      console.error('Error creating recipe:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <ChefHat className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Recipe Basics</h3>
              <p className="text-gray-600">Let's start with the essentials</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Recipe Title</label>
              <input
                type="text"
                value={recipeData.title}
                onChange={(e) => setRecipeData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Give your recipe a delicious name..."
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
              <textarea
                value={recipeData.description}
                onChange={(e) => setRecipeData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe what makes this recipe special..."
                rows={4}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Cooking Time (minutes)</label>
                <div className="relative">
                  <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="number"
                    value={recipeData.cookingTime}
                    onChange={(e) => setRecipeData(prev => ({ ...prev, cookingTime: e.target.value }))}
                    placeholder="30"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Difficulty</label>
                <select
                  value={recipeData.difficulty}
                  onChange={(e) => setRecipeData(prev => ({ ...prev, difficulty: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Category</label>
                <select
                  value={recipeData.category}
                  onChange={(e) => setRecipeData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                >
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Camera className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Add Media</h3>
              <p className="text-gray-600">Show off your delicious creation</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Recipe Photos</label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                {recipeData.images.map((image, index) => (
                  <div key={index} className="relative aspect-square bg-gray-100 rounded-xl overflow-hidden">
                    <img src={image} alt={`Recipe ${index + 1}`} className="w-full h-full object-cover" />
                    <button
                      onClick={() => setRecipeData(prev => ({
                        ...prev,
                        images: prev.images.filter((_, i) => i !== index)
                      }))}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                  <Camera className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Add Photo</span>
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">Recipe Videos (Optional)</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                {recipeData.videos.map((video, index) => (
                  <div key={index} className="relative aspect-video bg-gray-100 rounded-xl overflow-hidden">
                    <video src={video} className="w-full h-full object-cover" controls />
                    <button
                      onClick={() => setRecipeData(prev => ({
                        ...prev,
                        videos: prev.videos.filter((_, i) => i !== index)
                      }))}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <label className="aspect-video border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:border-orange-500 hover:bg-orange-50 transition-colors">
                  <Video className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-500">Add Video</span>
                  <input
                    type="file"
                    accept="video/*"
                    multiple
                    onChange={handleVideoUpload}
                    className="hidden"
                  />
                </label>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <Users className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Ingredients</h3>
              <p className="text-gray-600">List everything needed for this recipe</p>
            </div>

            <div className="space-y-4">
              {ingredients.map((ingredient, index) => (
                <div key={index} className="flex space-x-3">
                  <input
                    type="text"
                    value={ingredient.name}
                    onChange={(e) => updateIngredient(index, 'name', e.target.value)}
                    placeholder="Ingredient name"
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <input
                    type="text"
                    value={ingredient.amount}
                    onChange={(e) => updateIngredient(index, 'amount', e.target.value)}
                    placeholder="Amount"
                    className="w-24 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  />
                  <select
                    value={ingredient.unit}
                    onChange={(e) => updateIngredient(index, 'unit', e.target.value)}
                    className="w-24 px-2 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                  {ingredients.length > 1 && (
                    <button
                      onClick={() => removeIngredient(index)}
                      className="p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addIngredient}
                className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-orange-500 hover:text-orange-600 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Ingredient
              </button>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <ChefHat className="w-12 h-12 text-orange-600 mx-auto mb-4" />
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Instructions</h3>
              <p className="text-gray-600">Step-by-step cooking directions</p>
            </div>

            <div className="space-y-4">
              {instructions.map((instruction, index) => (
                <div key={index} className="flex space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-orange-600 text-white rounded-full flex items-center justify-center font-semibold text-sm">
                    {instruction.step}
                  </div>
                  <textarea
                    value={instruction.instruction}
                    onChange={(e) => updateInstruction(index, e.target.value)}
                    placeholder={`Step ${instruction.step} instructions...`}
                    rows={3}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                  />
                  {instructions.length > 1 && (
                    <button
                      onClick={() => removeInstruction(index)}
                      className="flex-shrink-0 p-3 text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={addInstruction}
                className="flex items-center justify-center w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 hover:border-orange-500 hover:text-orange-600 transition-colors"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Step
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Create Recipe</h2>
            <p className="text-gray-600">Step {step} of 4</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between mb-2">
            {[1, 2, 3, 4].map((stepNum) => (
              <div
                key={stepNum}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                  stepNum <= step
                    ? 'bg-orange-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {stepNum}
              </div>
            ))}
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-orange-600 to-red-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(step / 4) * 100}%` }}
            ></div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderStep()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={() => setStep(Math.max(1, step - 1))}
            disabled={step === 1}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold"
          >
            Previous
          </button>
          
          <div className="flex space-x-3">
            {step < 4 ? (
              <button
                onClick={() => setStep(step + 1)}
                className="px-6 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 transition-all font-semibold"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="px-8 py-2 bg-gradient-to-r from-orange-600 to-red-600 text-white rounded-xl hover:from-orange-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-semibold"
              >
                {loading ? 'Publishing...' : 'Publish Recipe'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};