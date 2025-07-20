import { useState } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/router';

interface SearchBarProps {
  placeholder?: string;
  size?: 'small' | 'medium' | 'large';
  showSuggestions?: boolean;
}

export default function SearchBar({ 
  placeholder = "Search for appliances...", 
  size = 'medium',
  showSuggestions = false 
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestionsList, setShowSuggestionsList] = useState(false);
  const router = useRouter();

  const sampleSuggestions = [
    'Samsung refrigerator',
    'KitchenAid mixer',
    'LG washer',
    'Whirlpool dryer',
    'GE dishwasher',
    'Ninja blender',
    'Instant Pot',
    'Dyson vacuum'
  ];

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    
    if (showSuggestions && value.length > 1) {
      const filtered = sampleSuggestions.filter(item =>
        item.toLowerCase().includes(value.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestionsList(true);
    } else {
      setShowSuggestionsList(false);
    }
  };

  const handleSearch = (searchQuery?: string) => {
    const searchTerm = searchQuery || query;
    if (searchTerm.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchTerm.trim())}`);
      setShowSuggestionsList(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const selectSuggestion = (suggestion: string) => {
    setQuery(suggestion);
    setShowSuggestionsList(false);
    handleSearch(suggestion);
  };

  const sizeClasses = {
    small: 'h-10 text-sm',
    medium: 'h-12 text-base',
    large: 'h-14 text-lg'
  };

  const iconSizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-5 h-5',
    large: 'w-6 h-6'
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <MagnifyingGlassIcon className={`${iconSizeClasses[size]} text-neutral-400`} />
        </div>
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          onFocus={() => showSuggestions && query.length > 1 && setShowSuggestionsList(true)}
          onBlur={() => setTimeout(() => setShowSuggestionsList(false), 200)}
          placeholder={placeholder}
          className={`
            w-full ${sizeClasses[size]} pl-12 pr-24 
            border border-neutral-300 rounded-xl 
            focus:ring-2 focus:ring-primary-500 focus:border-primary-500 
            placeholder-neutral-500 text-neutral-900
            shadow-sm hover:shadow-md transition-all duration-200
          `}
        />
        <button
          onClick={() => handleSearch()}
          className={`
            absolute inset-y-0 right-0 mr-2 my-1
            px-4 bg-primary-600 text-white rounded-lg 
            hover:bg-primary-700 active:bg-primary-800
            transition-colors duration-200
            flex items-center justify-center
            ${size === 'small' ? 'text-sm' : size === 'large' ? 'text-base' : 'text-sm'}
            font-medium
          `}
        >
          Search
        </button>
      </div>

      {/* Suggestions Dropdown */}
      {showSuggestions && showSuggestionsList && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-lg border border-neutral-200 max-h-60 overflow-y-auto">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => selectSuggestion(suggestion)}
              className="w-full px-4 py-3 text-left hover:bg-neutral-50 transition-colors border-b border-neutral-100 last:border-b-0 focus:bg-neutral-50 focus:outline-none"
            >
              <div className="flex items-center space-x-3">
                <MagnifyingGlassIcon className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <span className="text-neutral-900">{suggestion}</span>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
} 