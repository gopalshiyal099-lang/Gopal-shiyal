
import React, { useState, useEffect, useRef } from 'react';
import { 
  Phone, 
  MessageSquare, 
  Search, 
  Home, 
  MapPin, 
  Bed, 
  Bath, 
  Maximize, 
  Send, 
  X, 
  Bot,
  Heart,
  Eye,
  TrendingUp
} from 'lucide-react';
import { PROPERTIES, CONTACT_CONFIG } from './constants';
import { Property, ChatMessage } from './types';
import { getRealEstateAdvice } from './services/gemini';

interface InteractionState {
  likes: number;
  views: number;
  isLiked: boolean;
}

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'All' | 'Sale' | 'Rent' | 'Commercial'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Local state to track interactions since constants are immutable
  const [propertyInteractions, setPropertyInteractions] = useState<Record<string, InteractionState>>(() => {
    const initial: Record<string, InteractionState> = {};
    PROPERTIES.forEach(p => {
      initial[p.id] = {
        likes: p.likes,
        views: p.views + Math.floor(Math.random() * 5), // Increment views slightly on load
        isLiked: false
      };
    });
    return initial;
  });

  const filteredProperties = PROPERTIES.filter(p => {
    const matchesTab = activeTab === 'All' || p.category === activeTab;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesTab && matchesSearch;
  });

  const handleLike = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setPropertyInteractions(prev => {
      const current = prev[id];
      const newIsLiked = !current.isLiked;
      return {
        ...prev,
        [id]: {
          ...current,
          isLiked: newIsLiked,
          likes: newIsLiked ? current.likes + 1 : current.likes - 1
        }
      };
    });
  };

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isChatOpen) scrollToBottom();
  }, [messages, isTyping]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    const userMsg: ChatMessage = { role: 'user', content: inputMessage };
    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsTyping(true);

    const history = messages.map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    const response = await getRealEstateAdvice(inputMessage, history);
    
    setMessages(prev => [...prev, { role: 'assistant', content: response }]);
    setIsTyping(false);
  };

  const openWhatsApp = () => {
    const url = `https://wa.me/${CONTACT_CONFIG.whatsapp}?text=${encodeURIComponent("Hi Mahuva Property, I'm interested in viewing your listings.")}`;
    window.open(url, '_blank');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Navigation */}
      <nav className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="bg-indigo-600 p-2 rounded-lg text-white">
                <Home size={24} />
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">MAHUVA <span className="text-indigo-600">PROPERTY</span></span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Residential</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Commercial</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Plots</a>
              <a href="#" className="text-sm font-medium text-slate-600 hover:text-indigo-600 transition-colors">Contact</a>
            </div>

            <div className="flex items-center gap-4">
              <button 
                onClick={() => window.location.href = `tel:${CONTACT_CONFIG.phone}`}
                className="hidden sm:flex items-center gap-2 px-4 py-2 text-indigo-600 font-medium hover:bg-indigo-50 rounded-full transition-all"
              >
                <Phone size={18} />
                <span>Call Agent</span>
              </button>
              <button 
                onClick={openWhatsApp}
                className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-full font-medium flex items-center gap-2 transition-all shadow-lg shadow-green-200"
              >
                <MessageSquare size={18} />
                <span className="hidden sm:inline">WhatsApp</span>
                <span className="sm:hidden">Chat</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 bg-indigo-900 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <img 
            src="https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=1200" 
            alt="Mahuva Property Background" 
            className="w-full h-full object-cover"
          />
        </div>
        <div className="relative max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-indigo-200 text-sm font-medium">
            <TrendingUp size={16} />
            Over 5,000+ views this month across Mahuva
          </div>
          <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
            Exclusive <span className="text-indigo-300 italic">Mahuva</span> Real Estate.
          </h1>
          <p className="text-lg md:text-xl text-indigo-100 max-w-2xl mx-auto">
            Find the best residential houses, commercial shops, and industrial plots in Mahuva with our local expertise.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-2xl mx-auto">
            <div className="relative w-full">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input 
                type="text" 
                placeholder="Search by area in Mahuva..."
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white text-slate-900 focus:outline-none focus:ring-4 focus:ring-indigo-500/30 transition-all text-lg"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <button className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 rounded-2xl font-bold transition-all whitespace-nowrap shadow-xl">
              Search Properties
            </button>
          </div>
        </div>
      </section>

      {/* Filter Tabs */}
      <div className="max-w-7xl mx-auto px-4 w-full mt-12 mb-8">
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 scrollbar-hide">
          {['All', 'Sale', 'Rent', 'Commercial'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${
                activeTab === tab 
                ? 'bg-slate-900 text-white shadow-lg' 
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Property Grid */}
      <main className="max-w-7xl mx-auto px-4 pb-20 flex-grow w-full">
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProperties.map((property) => {
              const interaction = propertyInteractions[property.id];
              return (
                <div 
                  key={property.id} 
                  className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-2xl transition-all duration-500 hover:-translate-y-2"
                >
                  <div className="relative h-64 overflow-hidden">
                    <img 
                      src={property.image} 
                      alt={property.title} 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    
                    {/* Floating Info Overlay */}
                    <div className="absolute top-4 left-4 flex gap-2">
                      <span className="bg-white/90 backdrop-blur-sm text-slate-900 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                        {property.category}
                      </span>
                    </div>

                    {/* Like & View Counters */}
                    <div className="absolute top-4 right-4 flex flex-col gap-2">
                      <button 
                        onClick={(e) => handleLike(e, property.id)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full backdrop-blur-md transition-all border ${
                          interaction.isLiked 
                          ? 'bg-red-500 border-red-400 text-white shadow-lg' 
                          : 'bg-white/20 border-white/30 text-white hover:bg-white/40'
                        }`}
                      >
                        <Heart size={14} fill={interaction.isLiked ? 'white' : 'transparent'} />
                        <span className="text-xs font-bold">{interaction.likes}</span>
                      </button>
                      
                      <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md border border-white/10 text-white">
                        <Eye size={14} />
                        <span className="text-xs font-bold">{interaction.views}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition-colors">
                        {property.title}
                      </h3>
                      <span className="text-lg font-bold text-indigo-600">{property.price}</span>
                    </div>

                    <div className="flex items-center text-slate-500 text-sm gap-1">
                      <MapPin size={16} />
                      <span>{property.location}</span>
                    </div>

                    <div className="flex items-center justify-between py-4 border-y border-slate-100">
                      <div className="flex items-center gap-2">
                        <Bed size={18} className="text-slate-400" />
                        <span className="font-semibold text-slate-700">{property.beds}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Bath size={18} className="text-slate-400" />
                        <span className="font-semibold text-slate-700">{property.baths}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Maximize size={18} className="text-slate-400" />
                        <span className="font-semibold text-slate-700">{property.sqft} <small>sqft</small></span>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 pt-2">
                      <button 
                        onClick={openWhatsApp}
                        className="flex items-center justify-center gap-2 py-3 bg-green-50 text-green-700 font-bold rounded-xl hover:bg-green-100 transition-colors"
                      >
                        <MessageSquare size={18} />
                        WhatsApp
                      </button>
                      <button 
                        onClick={() => window.location.href = `tel:${CONTACT_CONFIG.phone}`}
                        className="flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-700 font-bold rounded-xl hover:bg-indigo-100 transition-colors"
                      >
                        <Phone size={18} />
                        Call Agent
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="p-6 bg-slate-100 rounded-full text-slate-300">
              <Search size={48} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">No properties found in Mahuva</h2>
            <p className="text-slate-500">Try adjusting your search query or filters.</p>
            <button 
              onClick={() => {setSearchQuery(''); setActiveTab('All');}}
              className="text-indigo-600 font-bold hover:underline"
            >
              Show all listings
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-16 px-4">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-6">
            <div className="flex items-center gap-2 text-white">
              <Home size={24} />
              <span className="text-xl font-bold tracking-tight uppercase">Mahuva Property</span>
            </div>
            <p className="text-sm leading-relaxed">
              Mahuva Property is the leading digital real estate marketplace serving Mahuva, Bhavnagar, and surrounding Gujarat regions. 
            </p>
          </div>
          
          <div>
            <h4 className="text-white font-bold mb-6">Explore</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Residential Sales</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Rental Homes</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Commercial Shops</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Industrial Land</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Quick Links</h4>
            <ul className="space-y-4 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Post Property</a></li>
              <li><a href="#" className="hover:text-white transition-colors">About Mahuva</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-6">Contact Local Agent</h4>
            <div className="flex flex-col space-y-4">
              <a href={`tel:${CONTACT_CONFIG.phone}`} className="flex items-center gap-3 text-sm hover:text-white transition-colors">
                <div className="p-2 bg-slate-800 rounded-lg"><Phone size={16} /></div>
                {CONTACT_CONFIG.phone}
              </a>
              <a onClick={openWhatsApp} className="flex items-center gap-3 text-sm hover:text-white transition-colors cursor-pointer">
                <div className="p-2 bg-slate-800 rounded-lg"><MessageSquare size={16} /></div>
                WhatsApp Mahuva
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-slate-800 text-center text-xs tracking-widest uppercase">
          © 2024 Mahuva Property. All Rights Reserved.
        </div>
      </footer>

      {/* Floating AI Assistant Toggle */}
      <button 
        onClick={() => setIsChatOpen(!isChatOpen)}
        className={`fixed bottom-8 right-8 z-50 p-4 rounded-2xl shadow-2xl transition-all duration-300 flex items-center gap-3 ${
          isChatOpen ? 'bg-slate-800 text-white translate-y-2' : 'bg-indigo-600 text-white hover:bg-indigo-500 hover:scale-105'
        }`}
      >
        {isChatOpen ? <X size={24} /> : <Bot size={24} />}
        {!isChatOpen && <span className="font-bold pr-2">Mahuva AI Assistant</span>}
      </button>

      {/* AI Assistant Drawer */}
      {isChatOpen && (
        <div className="fixed bottom-24 right-8 z-50 w-[90vw] max-w-[400px] h-[600px] bg-white rounded-3xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-10 duration-300">
          <div className="bg-indigo-600 p-6 text-white">
            <div className="flex items-center gap-3 mb-1">
              <div className="p-2 bg-white/20 rounded-xl">
                <Bot size={20} />
              </div>
              <div>
                <h3 className="font-bold text-lg">Mahuva Property Assistant</h3>
                <p className="text-indigo-200 text-xs">AI Powered Real Estate Guide</p>
              </div>
            </div>
          </div>

          <div className="flex-grow p-6 overflow-y-auto space-y-4 scrollbar-thin scrollbar-thumb-indigo-100">
            {messages.length === 0 && (
              <div className="text-center py-10 space-y-4">
                <div className="w-16 h-16 bg-indigo-50 text-indigo-400 rounded-full flex items-center justify-center mx-auto">
                  <Bot size={32} />
                </div>
                <div className="space-y-2">
                  <p className="font-bold text-slate-800">Namaste! How can I help you today?</p>
                  <p className="text-slate-500 text-sm">Ask me about available properties in Mahuva or current market trends.</p>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {['Properties near Bunder Road', 'Budget homes in Mahuva', 'Tell me about business hub'].map(q => (
                    <button 
                      key={q}
                      onClick={() => setInputMessage(q)}
                      className="text-xs p-3 border border-slate-100 rounded-xl text-left hover:bg-indigo-50 hover:border-indigo-100 transition-colors text-slate-600"
                    >
                      "{q}"
                    </button>
                  ))}
                </div>
              </div>
            )}
            
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-4 rounded-2xl text-sm ${
                  m.role === 'user' 
                  ? 'bg-indigo-600 text-white rounded-tr-none shadow-md' 
                  : 'bg-slate-100 text-slate-800 rounded-tl-none'
                }`}>
                  {m.content}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-slate-100 p-4 rounded-2xl rounded-tl-none flex items-center gap-1">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          <div className="p-4 bg-slate-50 border-t border-slate-200">
            <div className="relative">
              <input 
                type="text" 
                placeholder="Type your question..."
                className="w-full pl-4 pr-12 py-3 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all text-sm"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <button 
                onClick={handleSendMessage}
                className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-indigo-600 hover:text-indigo-800 transition-colors"
              >
                <Send size={20} />
              </button>
            </div>
            <p className="text-[10px] text-center text-slate-400 mt-3 uppercase tracking-tighter">
              Powered by Mahuva Property Intelligence
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
