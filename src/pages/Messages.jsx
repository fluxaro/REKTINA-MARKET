import { useState, useEffect, useRef } from 'react';
import { FiSend, FiSearch } from 'react-icons/fi';
import { useApp } from '../context/AppContext';
import { MESSAGES } from '../data/mockData';

export default function Messages() {
  const { setUnreadMessages } = useApp();
  const [conversations, setConversations] = useState(MESSAGES);
  const [activeId, setActiveId] = useState(MESSAGES[0]?.id);
  const [input, setInput] = useState('');
  const [search, setSearch] = useState('');
  const bottomRef = useRef(null);

  const active = conversations.find(c => c.id === activeId);

  useEffect(() => {
    setUnreadMessages(0);
    setConversations(prev => prev.map(c => c.id === activeId ? { ...c, unread: 0 } : c));
  }, [activeId, setUnreadMessages]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [active?.messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    const msg = { id: Date.now(), from: 'buyer', text: input.trim(), time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setConversations(prev => prev.map(c => c.id === activeId ? { ...c, messages: [...c.messages, msg] } : c));
    setInput('');
    setTimeout(() => {
      const reply = { id: Date.now() + 1, from: 'seller', text: "Thanks for your message! I'll get back to you shortly.", time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setConversations(prev => prev.map(c => c.id === activeId ? { ...c, messages: [...c.messages, reply] } : c));
    }, 1500);
  };

  const filtered = conversations.filter(c => c.sellerName.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 py-8">
          <h1 className="text-2xl font-bold text-gray-900">Messages</h1>
        </div>
      </div>
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="flex rounded-2xl border border-gray-100 bg-white shadow-sm overflow-hidden h-[600px]">
          {/* Sidebar */}
          <div className="w-72 shrink-0 border-r border-gray-100 flex flex-col">
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                  className="w-full pl-8 pr-3 py-2 rounded-xl text-sm border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 transition-colors" />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto">
              {filtered.map(c => {
                const last = c.messages[c.messages.length - 1];
                return (
                  <button key={c.id} onClick={() => setActiveId(c.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-colors border-b border-gray-50
                      ${activeId === c.id ? 'bg-blue-50' : 'hover:bg-gray-50'}`}>
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center shrink-0">
                      <span className="text-blue-600 font-bold text-sm">{c.sellerName[0]}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm text-gray-900 truncate">{c.sellerName}</p>
                        {c.unread > 0 && (
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
                            {c.unread}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-400 truncate">{last?.text}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat area */}
          {active ? (
            <div className="flex-1 flex flex-col">
              <div className="flex items-center gap-3 px-5 py-3 border-b border-gray-100 bg-white">
                <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">{active.sellerName[0]}</span>
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{active.sellerName}</p>
                  <p className="text-xs text-blue-500">Online</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {active.messages.map(msg => (
                  <div key={msg.id} className={`flex ${msg.from === 'buyer' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm ${
                      msg.from === 'buyer'
                        ? 'bg-blue-600 text-white rounded-br-sm'
                        : 'bg-white text-gray-900 rounded-bl-sm shadow-sm border border-gray-100'
                    }`}>
                      <p>{msg.text}</p>
                      <p className={`text-[10px] mt-1 ${msg.from === 'buyer' ? 'text-blue-100' : 'text-gray-400'}`}>{msg.time}</p>
                    </div>
                  </div>
                ))}
                <div ref={bottomRef} />
              </div>

              <form onSubmit={sendMessage} className="flex gap-2 p-3 border-t border-gray-100 bg-white">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2.5 rounded-xl text-sm border border-gray-200 bg-gray-50 outline-none focus:border-blue-500 transition-colors"
                />
                <button type="submit" disabled={!input.trim()}
                  className="p-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white disabled:opacity-50 transition-colors">
                  <FiSend size={16} />
                </button>
              </form>
            </div>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-400 text-sm">
              Select a conversation
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
