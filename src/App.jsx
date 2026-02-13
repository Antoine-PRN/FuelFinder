import React, { Suspense } from 'react';
import { Toaster } from 'sonner'
const Map = React.lazy(() => import('./components/interractive-map/Map.jsx'));
import Sidebar from './components/sidebar/Sidebar.jsx';

const App = () => {
  return (
    <div className="app">
      <Suspense fallback={<div>Loading map...</div>}>
        <Toaster />
        <Map />
        <Sidebar />
      </Suspense>
    </div>
  );
};

export default App;
