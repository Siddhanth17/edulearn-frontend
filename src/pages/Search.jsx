import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import { searchAPI } from '../services/api';
import NoteCard from '../components/notes/NoteCard';
import Loading from '../components/ui/Loading';

export default function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!query || query.length < 2) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const { data } = await searchAPI.search({ q: query });
        setNotes(data.notes);
      } catch {
        setNotes([]);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [query]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex items-center gap-3 mb-8">
        <SearchIcon className="w-6 h-6 text-primary-600" />
        <h1 className="text-2xl font-bold">
          Search Results {query && <span className="text-slate-500 font-normal">for "{query}"</span>}
        </h1>
      </div>

      {loading ? (
        <Loading />
      ) : notes.length === 0 ? (
        <div className="text-center py-20 text-slate-500">
          {query ? 'No notes found. Try different keywords.' : 'Enter a search term to find notes.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note, i) => <NoteCard key={note._id} note={note} index={i} />)}
        </div>
      )}
    </div>
  );
}
