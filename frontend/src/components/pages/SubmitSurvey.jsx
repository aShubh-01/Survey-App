import { useParams } from 'react-router-dom';
import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthComponent from './Auth';
import { fetchSurveyAsync } from '../../state/features/submissionSlice'

export default function SubmitSurveyComponent() {
    const { surveyId } = useParams()

    if(!localStorage.getItem('queriousToken')) return <AuthComponent navigateTo={`../../submit/${surveyId}`}/>
    
    return (
        <div>
            <SubmissionInfoComponent surveyId={surveyId}/>
        </div>
    )
}

const SubmissionInfoComponent = ({surveyId}) => {
    const submissionState = useSelector(state => state.submission);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSurveyAsync({surveyId: surveyId}))
    }, [])

    if(submissionState.loading) return <div>Loading Survey</div>
    if(submissionState.error) return <div>Error occured while fetching survey</div>
    if(submissionState.isAlreadySubmitted) return <div> You've submitted your response to this survey</div>
    else if(submissionState.data) return <div> <FormBackgroundWrapper component={<SubmissionFormComponent />}/> </div>
}

const SubmissionFormComponent = () => {
    const { survey: surveyData } = useSelector(state => state.submission.data)

    useEffect(() => {
        console.log(surveyData)
    }, []);

    return <div className=''>
        <div className='md:w-[700px]
                p-1 mx-auto w-[320px] bg-white'>
            <SurveyFormHeadingComponent title={surveyData.surveyTitle} description={surveyData.description} />
            <SurveyFormBodyComponent />
            <SurveyFormFooterComponent />
        </div>
    </div>
}

const SurveyFormHeadingComponent = ({title, description}) => {
    return <div>
        <div className='md:p-[2px] md:text-[25px]
            p-[1px] m-1 font-bold bg-slate-300'> {title} </div>
        <div className='md:p-[2px] md:text-[18px] md:h-auto
            overflow-y-auto h-[85px] m-1 p-[1px] text-[14px] font-semibold bg-slate-300'> {description} </div>
    </div>
}

const SurveyFormBodyComponent = () => {
    return <div>
        questions
    </div>
}

const SurveyFormFooterComponent = () => {
    return <div>
        submit
    </div>
}

const FormBackgroundWrapper = ({component}) => {
    return <div className='bg-slate-200 h-screen'>
        {component}
    </div>
}