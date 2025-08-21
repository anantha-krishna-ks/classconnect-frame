import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Home, ArrowLeft, Sparkles, Clock, Zap } from 'lucide-react';

const ParentComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* Animated illustration */}
        <div className="relative mb-8">
          <div className="w-64 h-64 mx-auto relative">
            {/* Main circle with gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full opacity-20 animate-pulse"></div>
            
            {/* Floating elements */}
            <div className="absolute top-8 left-8 w-4 h-4 bg-yellow-400 rounded-full animate-bounce [animation-delay:0s]"></div>
            <div className="absolute top-12 right-12 w-3 h-3 bg-pink-400 rounded-full animate-bounce [animation-delay:0.5s]"></div>
            <div className="absolute bottom-16 left-16 w-5 h-5 bg-green-400 rounded-full animate-bounce [animation-delay:1s]"></div>
            <div className="absolute bottom-8 right-8 w-3 h-3 bg-blue-400 rounded-full animate-bounce [animation-delay:1.5s]"></div>
            
            {/* Central icon */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl transform rotate-12 hover:rotate-0 transition-transform duration-500">
                <Clock className="w-12 h-12 text-white" />
              </div>
            </div>
            
            {/* Sparkles */}
            <Sparkles className="absolute top-4 right-4 w-6 h-6 text-yellow-500 animate-pulse" />
            <Sparkles className="absolute bottom-4 left-4 w-5 h-5 text-pink-500 animate-pulse [animation-delay:1s]" />
            <Zap className="absolute top-1/2 left-2 w-4 h-4 text-blue-500 animate-pulse [animation-delay:0.5s]" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-6">
          <div className="space-y-3">
            <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              Coming Soon
            </h1>
            <h2 className="text-2xl font-semibold text-gray-700">
              Parent Tools Are Being Built
            </h2>
            <p className="text-lg text-gray-600 max-w-md mx-auto leading-relaxed">
              We're working hard to bring you insights into your child's learning journey. These features will be available soon!
            </p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button 
              onClick={() => navigate('/parent-dashboard')}
              variant="outline"
              className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border-gray-200 hover:bg-white"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Bottom decorative elements */}
        <div className="mt-16 flex justify-center items-center gap-2 text-sm text-gray-500">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse [animation-delay:0.5s]"></div>
            <div className="w-2 h-2 bg-pink-400 rounded-full animate-pulse [animation-delay:1s]"></div>
          </div>
          <span>Stay tuned for updates</span>
        </div>
      </div>
    </div>
  );
};

export default ParentComingSoon;