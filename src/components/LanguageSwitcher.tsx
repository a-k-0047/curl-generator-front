import { Globe } from 'lucide-react';
import React from 'react';

import {
    Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';

import { useLanguage } from './LanguageContext';

const LanguageSwitcher: React.FC = () => {
  const { setLang } = useLanguage();
  type Language = "en" | "ja";

  return (
    <div className="flex items-center gap-1">
      <Select onValueChange={(value: Language) => setLang(value)}>
        <SelectTrigger className="w-[140px] bg-background">
          <Globe className="text-primary" />
          <SelectValue placeholder="Language" className="text-primary" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="en">English</SelectItem>
          <SelectItem value="ja">日本語</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
};

export default LanguageSwitcher;
