import { Outlet } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function App() {
  return (
    <div className="App w-full h-[100dvh] overflow-hidden bg-background touch-none overscroll-none">
      <ErrorBoundary>
        <Outlet />
      </ErrorBoundary>
    </div>
  );
}

export default App;
