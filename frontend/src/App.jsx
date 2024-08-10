import { BrowserRouter, Routes, Route} from 'react-router-dom';
import React, { Suspense } from 'react';
import './App.css'

const AuthComponent = React.lazy(() => import('./components/pages/Auth'))
const DashboardComponent = React.lazy(() => import('./components/pages/Dashboard'))
const CreateSurveyComponent = React.lazy(() => import('./components/pages/CreateSurvey'))
const UnpublishedSurveysComponent = React.lazy(() => import('./components/pages/UnpublishedSurveys'))
const AnalyseSurveyComponent = React.lazy(() => import('./components/pages/AnalyseSurvey'))

function App() {

  return (
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path='/' element={<AuthComponent />} />
            <Route path='/dashboard' element={<DashboardComponent />} />
            <Route path='/create' element={<CreateSurveyComponent />} />
            <Route path='/unpublished' element={<UnpublishedSurveysComponent />} />
            <Route path='/analyse' element={<AnalyseSurveyComponent />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
  );
}

export default App
