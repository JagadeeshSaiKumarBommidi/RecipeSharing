import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config/api';

interface Recipe {
  title: string;
  description: string;
  cookingTime: string;
  difficulty: string;
  category: string;
  // Add more fields as needed
}

export const EditRecipe: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: '',
    description: '',
    cookingTime: '',
    difficulty: '',
    category: '',
    // Add more fields as needed
  });

  useEffect(() => {
    async function fetchRecipe() {
      try {
        const res = await fetch(API_ENDPOINTS.RECIPES.GET_BY_ID(id!), {
          headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
        });
        if (!res.ok) throw new Error('Failed to fetch recipe');
        const data = await res.json();
        setRecipe(data);
        setForm({
          title: data.title,
          description: data.description,
          cookingTime: data.cookingTime,
          difficulty: data.difficulty,
          category: data.category,
        });
      } catch (e: unknown) {
        if (e instanceof Error) {
          setError(e.message);
        } else {
          setError('An unknown error occurred');
        }
      } finally {
        setLoading(false);
      }
    }
    fetchRecipe();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(API_ENDPOINTS.RECIPES.UPDATE(id!), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form)
      });
      if (!res.ok) throw new Error('Failed to update recipe');
      navigate('/');
    } catch (e: unknown) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!recipe) return <div>Recipe not found</div>;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4">Edit Recipe</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-medium">Title</label>
          <input name="title" value={form.title} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-medium">Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-medium">Cooking Time (mins)</label>
          <input name="cookingTime" value={form.cookingTime} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-medium">Difficulty</label>
          <input name="difficulty" value={form.difficulty} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <div>
          <label className="block font-medium">Category</label>
          <input name="category" value={form.category} onChange={handleChange} className="w-full border p-2 rounded" />
        </div>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Save Changes</button>
      </form>
    </div>
  );
};
