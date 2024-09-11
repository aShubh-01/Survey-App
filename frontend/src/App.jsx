import { BrowserRouter, Routes, Route} from 'react-router-dom';
import React, { Suspense } from 'react';
import './App.css'

import AuthComponent from './components/pages/Auth'
import DashboardComponent from './components/pages/Dashboard'
import CreateSurveyComponent from './components/pages/CreateSurvey'
import AnalyseSurveyComponent from './components/pages/AnalyseSurvey'
import UnpublishedSurveysComponent from './components/pages/UnpublishedSurveys'
import SubmitSurveyComponent from './components/pages/SubmitSurvey'

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
            <Route path='/submit/:surveyId' element={<SubmitSurveyComponent />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
  );
}

export default App
