
import * as React from 'react';
import { Sparkles, Users, TrendingUp } from 'lucide-react';

export function Logo(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex items-center gap-3" {...props}>
      <div className="relative">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl primary-bg shadow-lg">
          <Users className="h-6 w-6 text-white" />
        </div>
        <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full accent-bg flex items-center justify-center">
          <Sparkles className="h-2.5 w-2.5 text-white" />
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xl font-bold primary-text">TalentFlow</span>
        <span className="text-xs text-muted-foreground -mt-1">AI Recruitment</span>
      </div>
    </div>
  );
}

    