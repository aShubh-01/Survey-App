import { BrowserRouter, Router, Route} from 'react-router-dom';
import React, { Suspense } from 'react';
const AuthComponent = React.lazy(() => import('./components/Auth'))
import './App.css'

function App() {

  return (
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Router>
            <Route path='/' component={AuthComponent} />
          </Router>
        </Suspense>
      </BrowserRouter>
  );
}

export default App
