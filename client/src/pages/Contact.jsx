import React, { useState } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulaire envoyé:', formData);
    alert('Message envoyé avec succès! Nous vous répondrons dans les plus brefs délais.');
    setFormData({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="fade-in">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* En-tête */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Une question, un projet, ou simplement envie d'échanger ? Nous serions ravis de vous entendre.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Formulaire de contact */}
          <div>
            <div className="card">
              <div className="card-body">
                <h2 className="text-2xl font-semibold mb-6">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <label htmlFor="name" className="label">Votre nom *</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="email" className="label">Votre email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="subject" className="label">Sujet *</label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input"
                      required
                    >
                      <option value="">Choisissez un sujet</option>
                      <option value="Question générale">Question générale</option>
                      <option value="Support technique">Support technique</option>
                      <option value="Partenariat">Partenariat</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="message" className="label">Votre message *</label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="input resize-none"
                      required
                    ></textarea>
                  </div>

                  <button type="submit" className="btn btn-primary w-full">
                    Envoyer le message
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Informations de contact */}
          <div className="space-y-8">
            {/* Autres moyens de contact */}
            <div className="card">
              <div className="card-body">
                <h3 className="text-xl font-semibold mb-6">Autres moyens de contact</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <span className="text-2xl mr-4">📧</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email</h4>
                      <a href="mailto:positifaid@live.fr" className="text-blue-600 hover:text-blue-700">
                        positifaid@live.fr
                      </a>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-2xl mr-4">📱</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">WhatsApp</h4>
                      <div className="space-y-1">
                        <a href="https://wa.me/261344335930" className="block text-green-600 hover:text-green-700">
                          +261 34 43 359 30
                        </a>
                        <a href="https://wa.me/261340700405" className="block text-green-600 hover:text-green-700">
                          +261 34 07 004 05
                        </a>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start">
                    <span className="text-2xl mr-4">🌐</span>
                    <div>
                      <h4 className="font-semibold text-gray-900">Réseaux sociaux</h4>
                      <div className="flex space-x-4 mt-2">
                        <a href="#" className="text-blue-800 hover:text-blue-900">
                          Facebook
                        </a>
                        <a href="#" className="text-pink-600 hover:text-pink-700">
                          Instagram
                        </a>
                        <a href="#" className="text-blue-600 hover:text-blue-700">
                          LinkedIn
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Horaires d'ouverture */}
            <div className="card">
              <div className="card-body">
                <h3 className="text-xl font-semibold mb-6">Horaires d'ouverture</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Lundi - Vendredi</span>
                    <span className="font-semibold">8h00 - 18h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Samedi</span>
                    <span className="font-semibold">9h00 - 12h00</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimanche</span>
                    <span className="font-semibold">Fermé</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Temps de réponse */}
            <div className="card bg-blue-50 border-blue-200">
              <div className="card-body">
                <h3 className="text-lg font-semibold mb-4 text-blue-900">Temps de réponse</h3>
                <p className="text-blue-800">
                  Nous nous engageons à répondre à tous les messages dans un délai de 24 heures ouvrées. 
                  Pour les demandes urgentes, privilégiez le contact WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;