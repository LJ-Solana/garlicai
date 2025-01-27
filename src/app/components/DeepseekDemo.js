"use client"
import React, { useState, useEffect } from 'react';
import { Brain, MessageSquare, TrendingUp, Loader } from 'lucide-react';

const DeepseekDemo = () => {
  const [message, setMessage] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const callDeepseek = async () => {
    setLoading(true);
    setError(null);
    
    console.log('Starting API call...');
    console.log('Message:', message);
    
    try {
      const requestBody = {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are GarlicGPT, an AI assistant that loves garlic and cryptocurrency. Always include garlic-themed metaphors in your responses."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7,
        max_tokens: 500
      };

      console.log('Request body:', JSON.stringify(requestBody, null, 2));

      const response = await fetch('/api/deepseek', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody)
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorData = await response.json().catch(e => {
          console.error('Error parsing error response:', e);
          return { error: { message: response.statusText } };
        });
        console.error('API error data:', errorData);
        throw new Error(errorData.error?.message || `API call failed: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API response data:', data);
      setResponse(data.choices[0].message.content);
    } catch (err) {
      console.error('API Error:', err);
      console.error('Error stack:', err.stack);
      
      let errorMessage = 'Failed to connect to the API. ';
      if (err.message.includes('Failed to fetch')) {
        errorMessage += 'Please try again later.';
      } else {
        errorMessage += err.message;
      }
      
      setError(errorMessage);
    } finally {
      setLoading(false);
      console.log('API call completed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-yellow-50/50 rounded-lg shadow-lg">
      {/* Header */}
      <div className="flex items-center justify-center mb-8 space-x-4">
        <Brain className="h-8 w-8 text-yellow-500" />
        <h1 className="text-2xl font-bold text-black">GarlicSeek AI</h1>
      </div>

      {/* Main Chat Interface */}
      <div className="space-y-6">
        {/* Input Section */}
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="flex items-center mb-4">
            <MessageSquare className="h-6 w-6 text-yellow-600 mr-2" />
            <h2 className="text-lg font-semibold text-gray-900">Ask GarlicSeek</h2>
          </div>
          
          <div className="space-y-4">
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full p-3 rounded-lg border border-yellow-200 focus:ring-2 focus:ring-yellow-500 focus:border-transparent text-gray-900"
              placeholder="Ask anything about garlic, crypto, or both..."
              rows={4}
            />
            
            <button
              onClick={callDeepseek}
              disabled={loading || !message}
              className={`w-full py-2 px-4 rounded-lg font-medium ${
                loading || !message 
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-yellow-500 hover:bg-yellow-600 text-white'
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center">
                  <Loader className="animate-spin h-5 w-5 mr-2" />
                  Processing...
                </span>
              ) : (
                'Get AI Response'
              )}
            </button>
          </div>
        </div>

        {/* Response Section */}
        {(response || error) && (
          <div className="bg-white/80 backdrop-blur-sm border border-yellow-100 rounded-lg p-6 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-900">AI Response:</h3>
            {error ? (
              <div className="text-red-500">
                Error: {error}
              </div>
            ) : (
              <div className="prose max-w-none text-gray-900">
                {response}
              </div>
            )}
          </div>
        )}
      </div>

      {/* API Status */}
      <div className="mt-8 text-center text-sm text-gray-700">
        Powered by DeepSeek API • Status: {loading ? 'Processing' : 'Ready'}
      </div>
    </div>
  );
};

export default DeepseekDemo;