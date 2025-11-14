import React, { useState, useEffect } from 'react';
import { Plus, Edit, Trash2, FileText } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const PostsManager = () => {
  const [posts, setPosts] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingPost, setEditingPost] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: ''
  });
  const { user } = useAuth();

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/posts/my-posts', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.ok) {
        const postsData = await response.json();
        setPosts(postsData);
      }
    } catch (error) {
      console.error('Erreur récupération posts:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingPost 
        ? `http://localhost:5000/api/posts/${editingPost.id}`
        : 'http://localhost:5000/api/posts';
      
      const method = editingPost ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        setShowForm(false);
        setEditingPost(null);
        setFormData({ title: '', content: '' });
        fetchPosts();
      }
    } catch (error) {
      console.error('Erreur sauvegarde post:', error);
    }
  };

  const handleDelete = async (postId) => {
    if (!window.confirm('Supprimer ce post ?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/posts/${postId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        fetchPosts();
      }
    } catch (error) {
      console.error('Erreur suppression post:', error);
    }
  };

  const handleEdit = (post) => {
    setEditingPost(post);
    setFormData({
      title: post.title,
      content: post.content
    });
    setShowForm(true);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Gestion des Posts</h2>
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>Nouveau Post</span>
        </button>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl">
            <h3 className="text-lg font-semibold mb-4">
              {editingPost ? 'Modifier le post' : 'Nouveau post'}
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label">Titre</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="input"
                  placeholder="Titre du post"
                />
              </div>
              
              <div>
                <label className="label">Contenu</label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  className="input"
                  rows="6"
                  placeholder="Contenu de votre post..."
                />
              </div>
              
              <div className="flex space-x-2 justify-end">
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingPost(null);
                    setFormData({ title: '', content: '' });
                  }}
                  className="btn btn-outline"
                >
                  Annuler
                </button>
                <button type="submit" className="btn btn-primary">
                  {editingPost ? 'Modifier' : 'Créer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {posts.map((post) => (
          <div key={post.id} className="border rounded-lg p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-gray-900">{post.title}</h3>
                <p className="text-gray-600 mt-2 whitespace-pre-wrap">{post.content}</p>
                <div className="flex items-center space-x-4 mt-3 text-sm text-gray-500">
                  <span>Créé le {new Date(post.created_at).toLocaleDateString('fr-FR')}</span>
                  {post.updated_at !== post.created_at && (
                    <span>Modifié le {new Date(post.updated_at).toLocaleDateString('fr-FR')}</span>
                  )}
                </div>
              </div>
              <div className="flex space-x-2 ml-4">
                <button
                  onClick={() => handleEdit(post)}
                  className="text-blue-600 hover:text-blue-800 p-1"
                >
                  <Edit className="h-4 w-4" />
                </button>
                <button
                  onClick={() => handleDelete(post.id)}
                  className="text-red-600 hover:text-red-800 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
        
        {posts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Aucun post pour le moment</p>
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 btn btn-primary"
            >
              Créer votre premier post
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostsManager;