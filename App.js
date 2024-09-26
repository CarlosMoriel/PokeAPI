import Navigation from './context/Navigation';
import { FavoritesProvider } from './context/Favorites';

export default function App() {
  return (
    <FavoritesProvider>
      <Navigation />
    </FavoritesProvider>

  );
}
