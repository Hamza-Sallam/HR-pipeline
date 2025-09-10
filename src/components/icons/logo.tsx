import * as React from 'react';
import { Sparkles, Users, TrendingUp } from 'lucide-react';

export function Logo(props: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className="flex items-center gap-3" {...props}>
      <div className="relative">
        <div className="flex h-20 w-20 items-center justify-center rounded-xl  shadow-lg overflow-hidden">
          <img src="/talent.gif" alt="TalentFlow" className="h-15 w-15 object-contain" />
        </div>
        {/* <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full accent-bg flex items-center justify-center">
          <Sparkles className="h-2.5 w-2.5 text-white" />
        </div> */}
      </div>
      <div className="flex flex-col my-4">
        <span className="text-xl font-bold primary-text">TalentFlow</span>
        <span className="text-xs text-muted-foreground -mt-1">AI Recruitment</span>
      </div>
    </div>
  );
}