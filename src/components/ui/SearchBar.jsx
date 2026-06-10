import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X } from 'lucide-react';
import { searchAPI } from '../../services/api';

export default function SearchBar({ className = '', large = false }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const navigate = useNavigate();
  const ref = useRef(null);

  useEffect(() => {
    const handler = setTimeout(async () => {
      if (query.length >= 2) {
        try {
          const { data } = await searchAPI.suggestions(query);
          setSuggestions(data.suggestions);
          setShowSuggestions(true);
        } catch {
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [query]);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query.trim())}`);
      setShowSuggestions(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    if (suggestion.type === 'note') {
      navigate(`/notes/${suggestion.id}`);
    } else if (suggestion.type === 'subject') {
      navigate(`/subjects/${suggestion.id}`);
    } else if (suggestion.type === 'chapter') {
      navigate(`/chapters/${suggestion.id}`);
    } else {
      navigate(`/search?q=${encodeURIComponent(suggestion.text)}`);
    }
    setQuery('');
    setShowSuggestions(false);
  };

  return (
    <div ref={ref} className={`relative ${className}`}>
      <form onSubmit={handleSearch}>
        <div className="relative">
          <Search className={`absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 ${large ? 'w-5 h-5' : 'w-4 h-4'}`} />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
            placeholder="Search notes, lectures, subjects..."
            className={`w-full pl-11 pr-10 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all ${large ? 'py-4 text-base' : 'py-2.5 text-sm'}`}
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-xl overflow-hidden">
          {suggestions.map((s, i) => (
            <button
              key={i}
              onClick={() => handleSuggestionClick(s)}
              className="w-full px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-3 transition-colors"
            >
              <span className="text-xs uppercase font-medium text-primary-600 bg-primary-50 dark:bg-primary-900/30 px-2 py-0.5 rounded">
                {s.type}
              </span>
              <span className="text-sm text-slate-700 dark:text-slate-300">{s.text}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
