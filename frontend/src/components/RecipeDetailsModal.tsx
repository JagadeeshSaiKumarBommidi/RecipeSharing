import React from 'react';

interface Ingredient {
  name: string;
  amount: string;
  unit: string;
}

interface Instruction {
  step: number;
  instruction: string;
}

interface RecipeDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipe: {
    title: string;
    description: string;
    images: string[];
    ingredients: Ingredient[];
    instructions: Instruction[];
    author: { fullName: string; username: string };
    cookingTime: number;
    difficulty: string;
    category: string;
  };
  canEdit: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  // Inline edit props
  editingRecipe?: RecipeDetailsModalProps['recipe'];
  editForm?: {
    title: string;
    description: string;
    cookingTime: number;
    difficulty: string;
    category: string;
    // Add other fields if needed
  };
  editError?: string | null;
  editLoading?: boolean;
  onEditFormChange?: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onEditFormSubmit?: (e: React.FormEvent) => void;
  onCancelEdit?: () => void;
}

export const RecipeDetailsModal: React.FC<RecipeDetailsModalProps> = ({
  isOpen, onClose, recipe, canEdit, onEdit, onDelete,
  editingRecipe, editForm, editError, editLoading, onEditFormChange, onEditFormSubmit, onCancelEdit
}) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto relative">
        <button onClick={onClose} className="absolute top-4 right-4 p-2 bg-gray-100 rounded-full hover:bg-gray-200">
          ×
        </button>
        <div className="p-6">
          {editingRecipe ? (
            <form onSubmit={onEditFormSubmit} className="space-y-4">
              <h2 className="text-2xl font-bold mb-2">Edit Recipe</h2>
              <div>
                <label className="block font-medium">Title</label>
                <input name="title" value={editForm?.title ?? ''} onChange={onEditFormChange} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block font-medium">Description</label>
                <textarea name="description" value={editForm?.description ?? ''} onChange={onEditFormChange} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block font-medium">Cooking Time (mins)</label>
                <input name="cookingTime" value={editForm?.cookingTime ?? ''} onChange={onEditFormChange} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block font-medium">Difficulty</label>
                <input name="difficulty" value={editForm?.difficulty ?? ''} onChange={onEditFormChange} className="w-full border p-2 rounded" />
              </div>
              <div>
                <label className="block font-medium">Category</label>
                <input name="category" value={editForm?.category ?? ''} onChange={onEditFormChange} className="w-full border p-2 rounded" />
              </div>
              {editError && <div className="text-red-500">{editError}</div>}
              <div className="flex space-x-2 mt-4">
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700" disabled={editLoading}>{editLoading ? 'Saving...' : 'Save'}</button>
                <button type="button" onClick={onCancelEdit} className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400">Cancel</button>
              </div>
            </form>
          ) : (
            <>
              <h2 className="text-2xl font-bold mb-2">{recipe.title}</h2>
              <p className="text-gray-600 mb-4">{recipe.description}</p>
              {recipe.images && recipe.images.length > 0 && (
                <img src={recipe.images[0]} alt={recipe.title} className="w-full h-64 object-cover rounded-xl mb-4" />
              )}
              <div className="mb-4">
                <span className="text-sm text-gray-500 mr-4">By {recipe.author.fullName} (@{recipe.author.username})</span>
                <span className="text-sm text-gray-500 mr-4">{recipe.cookingTime} mins</span>
                <span className="text-sm text-gray-500 mr-4">{recipe.difficulty}</span>
                <span className="text-sm text-gray-500">{recipe.category}</span>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Ingredients</h3>
                <ul className="list-disc pl-6">
                  {recipe.ingredients.map((ing, i) => (
                    <li key={i}>{ing.amount} {ing.unit} {ing.name}</li>
                  ))}
                </ul>
              </div>
              <div className="mb-6">
                <h3 className="text-lg font-semibold mb-2">Steps</h3>
                <ol className="list-decimal pl-6">
                  {recipe.instructions.map((step, i) => (
                    <li key={i} className="mb-2">{step.instruction}</li>
                  ))}
                </ol>
              </div>
              {canEdit && (
                <div className="flex space-x-2 mt-4">
                  <button onClick={onEdit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Edit</button>
                  <button onClick={onDelete} className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600">Delete</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};
