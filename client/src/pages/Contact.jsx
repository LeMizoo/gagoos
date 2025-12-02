import React, { useState, useRef, useEffect } from 'react';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [visibleSections, setVisibleSections] = useState({});
  const sectionRefs = useRef([]);

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email',
      value: 'positifaid@live.fr',
      link: 'mailto:positifaid@live.fr',
      color: 'from-blue-500 to-blue-600',
      animation: 'bounceIn'
    },
    {
      icon: '📱',
      title: 'WhatsApp',
      value: '+261 34 43 359 30',
      link: 'https://wa.me/261344335930',
      color: 'from-green-500 to-green-600',
      animation: 'bounceIn'
    },
    {
      icon: '📞',
      title: 'Téléphone',
      value: '+261 34 07 004 05',
      link: 'tel:+261340700405',
      color: 'from-purple-500 to-purple-600',
      animation: 'bounceIn'
    }
  ];

  const socialNetworks = [
    { name: 'Facebook', icon: '📘', color: 'hover:bg-blue-500', link: '#' },
    { name: 'Instagram', icon: '📷', color: 'hover:bg-pink-500', link: '#' },
    { name: 'LinkedIn', icon: '💼', color: 'hover:bg-blue-700', link: '#' }
  ];

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({
              ...prev,
              [entry.target.dataset.section]: true
            }));
          }
        });
      },
      { threshold: 0.1, rootMargin: '-50px' }
    );

    sectionRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => observer.disconnect();
  }, []);

  const addToRefs = (el, index) => {
    if (el && !sectionRefs.current.includes(el)) {
      el.dataset.section = index;
      sectionRefs.current.push(el);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Animation de soumission
    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('Formulaire envoyé:', formData);
    alert('🎉 Message envoyé avec succès! Nous vous répondrons dans les plus brefs délais.');
    setFormData({ name: '', email: '', subject: '', message: '' });
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section
        ref={el => addToRefs(el, 'hero')}
        className={`relative py-20 transition-all duration-1000 ${visibleSections['hero'] ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
          }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-black text-gray-900 mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent animate-gradient">
              Contactez-nous
            </h1>
            <p className="text-xl md:text-2xl text-gray-600 max-w-2xl mx-auto leading-relaxed transform hover:scale-105 transition-transform duration-300">
              Une question, un projet, ou simplement envie d'échanger ?
              <span className="text-blue-600 font-semibold"> Nous serions ravis de vous entendre.</span>
            </p>
          </div>
        </div>

        {/* Animation de fond */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {[...Array(15)].map((_, i) => (
            <div
              key={i}
              className="absolute w-3 h-3 bg-blue-300 rounded-full opacity-20 animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${i * 0.3}s`,
                animationDuration: `${4 + Math.random() * 3}s`
              }}
            />
          ))}
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Formulaire de contact */}
          <div
            ref={el => addToRefs(el, 'form')}
            className={`transition-all duration-1000 delay-300 ${visibleSections['form'] ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'
              }`}
          >
            <div className="card bg-white/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500">
              <div className="card-body p-8">
                <div className="text-center mb-8">
                  <h2 className="text-3xl font-bold text-gray-900 mb-3">
                    Envoyez-nous un message
                  </h2>
                  <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full animate-pulse"></div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="group">
                      <label htmlFor="name" className="label group-hover:text-blue-600 transition-colors duration-300">
                        Votre nom *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="input transform group-hover:scale-105 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        placeholder="Votre nom complet"
                      />
                    </div>

                    <div className="group">
                      <label htmlFor="email" className="label group-hover:text-blue-600 transition-colors duration-300">
                        Votre email *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="input transform group-hover:scale-105 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        required
                        placeholder="votre@email.com"
                      />
                    </div>
                  </div>

                  <div className="group">
                    <label htmlFor="subject" className="label group-hover:text-blue-600 transition-colors duration-300">
                      Sujet *
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="input transform group-hover:scale-105 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                    >
                      <option value="">Choisissez un sujet</option>
                      <option value="Question générale">Question générale</option>
                      <option value="Support technique">Support technique</option>
                      <option value="Partenariat">Partenariat</option>
                      <option value="Autre">Autre</option>
                    </select>
                  </div>

                  <div className="group">
                    <label htmlFor="message" className="label group-hover:text-blue-600 transition-colors duration-300">
                      Votre message *
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={6}
                      className="input resize-none transform group-hover:scale-105 transition-all duration-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      required
                      placeholder="Décrivez votre projet ou votre question..."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-500 transform hover:scale-105 ${isSubmitting
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl'
                      } text-white relative overflow-hidden group`}
                  >
                    <span className={`relative z-10 ${isSubmitting ? 'opacity-0' : 'opacity-100'}`}>
                      {isSubmitting ? 'Envoi en cours...' : 'Envoyer le message ✨'}
                    </span>

                    {isSubmitting && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      </div>
                    )}

                    {/* Effet de brillance */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000"></div>
                  </button>
                </form>
              </div>
            </div>
          </div>

          {/* Informations de contact */}
          <div
            ref={el => addToRefs(el, 'info')}
            className={`space-y-8 transition-all duration-1000 delay-500 ${visibleSections['info'] ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'
              }`}
          >
            {/* Méthodes de contact */}
            <div className="card bg-white/80 backdrop-blur-sm border-0 shadow-2xl hover:shadow-3xl transform hover:-translate-y-2 transition-all duration-500">
              <div className="card-body p-8">
                <h3 className="text-2xl font-bold text-gray-900 mb-8 text-center">
                  Autres moyens de contact
                </h3>

                <div className="space-y-6">
                  {contactMethods.map((method, index) => (
                    <a
                      key={index}
                      href={method.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={`flex items-center p-4 rounded-2xl bg-gradient-to-r ${method.color} text-white transform hover:scale-105 hover:shadow-xl transition-all duration-500 group ${visibleSections['info'] ? 'animate-bounceIn' : 'opacity-0'
                        }`}
                      style={{ animationDelay: `${index * 200}ms` }}
                    >
                      <span className="text-3xl mr-4 transform group-hover:scale-125 group-hover:rotate-12 transition-transform duration-500">
                        {method.icon}
                      </span>
                      <div className="flex-1">
                        <h4 className="font-semibold text-lg">{method.title}</h4>
                        <p className="text-white/90">{method.value}</p>
                      </div>
                      <span className="text-2xl transform group-hover:translate-x-2 transition-transform duration-300">
                        →
                      </span>
                    </a>
                  ))}
                </div>

                {/* Réseaux sociaux */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h4 className="font-semibold text-gray-900 mb-4 text-center">Réseaux sociaux</h4>
                  <div className="flex justify-center space-x-4">
                    {socialNetworks.map((network, index) => (
                      <a
                        key={index}
                        href={network.link}
                        className={`w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center text-xl transform hover:scale-110 transition-all duration-300 ${network.color} text-gray-700 hover:text-white shadow-lg hover:shadow-xl`}
                      >
                        {network.icon}
                      </a>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Horaires d'ouverture */}
            <div className="card bg-gradient-to-br from-blue-500 to-purple-600 border-0 shadow-2xl transform hover:scale-105 transition-all duration-500">
              <div className="card-body p-8 text-white">
                <h3 className="text-2xl font-bold mb-6 text-center">Horaires d'ouverture</h3>
                <div className="space-y-4">
                  {[
                    { day: 'Lundi - Vendredi', hours: '8h00 - 18h00', icon: '🏢' },
                    { day: 'Samedi', hours: '9h00 - 12h00', icon: '🌅' },
                    { day: 'Dimanche', hours: 'Fermé', icon: '🎉' }
                  ].map((schedule, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-3 bg-white/10 rounded-xl transform hover:scale-105 transition-transform duration-300"
                    >
                      <div className="flex items-center">
                        <span className="text-2xl mr-3">{schedule.icon}</span>
                        <span className="font-medium">{schedule.day}</span>
                      </div>
                      <span className="font-semibold bg-white/20 px-3 py-1 rounded-full">
                        {schedule.hours}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Temps de réponse */}
            <div className="card bg-gradient-to-br from-green-500 to-emerald-600 border-0 shadow-2xl transform hover:scale-105 transition-all duration-500">
              <div className="card-body p-8 text-white text-center">
                <div className="text-4xl mb-4">⚡</div>
                <h3 className="text-xl font-bold mb-4">Temps de réponse</h3>
                <p className="text-white/90 leading-relaxed">
                  Nous nous engageons à répondre à tous les messages dans un délai de{' '}
                  <span className="font-bold text-yellow-300">24 heures ouvrées</span>.
                  Pour les demandes urgentes, privilégiez le contact WhatsApp.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-700">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-xl text-white/90 mb-8">
            Contactez-nous dès aujourd'hui et donnons vie à vos idées ensemble
          </p>
          <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl animate-pulse">
            🚀 Commencer Maintenant
          </button>
        </div>
      </section>
    </div>
  );
};

export default Contact;