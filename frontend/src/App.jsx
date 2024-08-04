import { BrowserRouter, Routes, Route} from 'react-router-dom';
import React, { Suspense } from 'react';
import './App.css'

const AuthComponent = React.lazy(() => import('./components/pages/Auth'))
const DashboardComponent = React.lazy(() => import('./components/pages/Dashboard'))

function App() {

  return (
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/' element={<AuthComponent />} />
            <Route path='/dashboard' element={<DashboardComponent />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
  );
}

export default App
