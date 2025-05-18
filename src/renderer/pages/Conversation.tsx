import React, { useState } from 'react';

const Conversation: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: 1, role: 'user', content: 'Tell me about your latest mission, Captain Elara.' },
    { id: 2, role: 'character', content: 'We\'ve been patrolling the outer rim for the past three cycles. There have been reports of unusual activity near the Proxima Nebula. I\'ve ordered long-range scans, but so far nothing conclusive. The crew is on edge though - they can feel something\'s not right out here.' },
    { id: 3, role: 'user', content: 'Do you think it could be related to your previous encounter with the Void Collective?' },
    { id: 4, role: 'character', content: 'That thought has crossed my mind more than once. The Void Collective doesn\'t leave survivors, and we escaped by the skin of our teeth last time. If they\'ve found us again... well, let\'s just say I\'ve been running battle drills twice as often. I won\'t lose another ship, not to them.' },
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleSendMessage = () => {
    if (!newMessage.trim()) return;
    
    // Add user message
    const userMessageId = messages.length + 1;
    setMessages([...messages, { id: userMessageId, role: 'user', content: newMessage }]);
    setNewMessage('');
    
    // Simulate AI processing
    setIsProcessing(true);
    
    // Simulate response delay (would be replaced with actual API call)
    setTimeout(() => {
      // Mock responses based on keywords
      let response = "I'm not sure I understand what you're asking. Could you clarify?";
      
      const lowercaseMessage = newMessage.toLowerCase();
      
      if (lowercaseMessage.includes('mission') || lowercaseMessage.includes('nebula')) {
        response = "The mission is proceeding according to protocol, though I've ordered additional security measures. Something about this region of space feels wrong - call it captain's intuition. We've detected unusual energy signatures that don't match any known species or phenomena.";
      } else if (lowercaseMessage.includes('crew') || lowercaseMessage.includes('ship')) {
        response = "The crew is performing admirably under the circumstances. Tension is high, but that's to be expected on the frontier. The Stellar Horizon might not be the newest vessel in the fleet, but she's got heart. We've been through worse together.";
      } else if (lowercaseMessage.includes('void') || lowercaseMessage.includes('collective')) {
        response = "The Void Collective... *pauses* We lost good people when they ambushed us near Tau Ceti. Their technology was unlike anything we'd encountered. If they're back, we need to alert Command immediately. The entire sector could be at risk.";
      } else if (lowercaseMessage.includes('past') || lowercaseMessage.includes('history')) {
        response = "My past isn't something I discuss freely. The colony where I grew up was... challenging. Resources were scarce, authority was corrupt. It taught me to rely on myself and to value those who prove their loyalty. It's why I run such a tight ship now.";
      }
      
      // Add AI response
      setMessages(prev => [...prev, { id: prev.length + 1, role: 'character', content: response }]);
      setIsProcessing(false);
    }, 1500);
  };
  
  return (
    <div className="container mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden flex flex-col h-[calc(100vh-12rem)]">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center">
          <div className="w-10 h-10 rounded-full bg-indigo-600 flex items-center justify-center text-white font-bold mr-3">
            CE
          </div>
          <div>
            <h1 className="text-xl font-semibold dark:text-white">Captain Elara</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Space Opera Series</p>
          </div>
        </div>
        
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div 
              key={message.id} 
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div 
                className={`max-w-md p-3 rounded-lg ${
                  message.role === 'user' 
                    ? 'bg-indigo-100 dark:bg-indigo-900 text-indigo-800 dark:text-indigo-100' 
                    : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-gray-800 dark:text-gray-200'
                }`}
              >
                <p className="text-sm">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isProcessing && (
            <div className="flex justify-start">
              <div className="max-w-md p-3 rounded-lg bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-300 animate-bounce"></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-300 animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 rounded-full bg-gray-400 dark:bg-gray-300 animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="p-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center">
            <input
              type="text"
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 dark:border-gray-600 rounded-l-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              disabled={isProcessing}
            />
            <button 
              className={`py-2 px-4 rounded-r-md ${
                isProcessing 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
              onClick={handleSendMessage}
              disabled={isProcessing}
            >
              Send
            </button>
          </div>
          
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white">
                <option value="accurate">Accurate to character</option>
                <option value="concise">Concise responses</option>
                <option value="detailed">Detailed and elaborate</option>
                <option value="creative">Creative and unexpected</option>
              </select>
              
              <div className="flex items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400 mr-2">Memory:</span>
                <select className="text-sm border border-gray-300 dark:border-gray-600 rounded-md py-1 px-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-700 dark:text-white">
                  <option value="3">Important only</option>
                  <option value="1">All memories</option>
                  <option value="5">Critical only</option>
                </select>
              </div>
            </div>
            
            <button className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">
              Save Conversation
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Conversation;
