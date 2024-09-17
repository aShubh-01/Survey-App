import { useParams } from 'react-router-dom';
import { useEffect, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthComponent from './Auth';
import { fetchSurveyAsync } from '../../state/features/submissionSlice'
import { useMediaQuery } from 'react-responsive';
import { HourGlassLoading, SubmitLoading } from '../AnimatedComponents';
import { editAnswer, toggleAnonymity } from '../../state/features/submissionSlice';
import submitSurveyBackgroundImage from '../../assets/images/submitSurveyBackgroundImage.png';
import useDebouncedCallback from '../../state/customHooks/debounceCallback';
import submitSurveyQueriousLogo from '../../assets/images/submitSurveyQueriousLogo.png'
import axios from 'axios';
import { backendUrl } from '../../config';

export default function SubmitSurveyComponent() {
    const { surveyId } = useParams()

    if(!localStorage.getItem('queriousToken')) return <AuthComponent navigateTo={`../../submit/${surveyId}`}/>
    
    return (
        <div>
            <SubmissionFormComponent surveyId={surveyId}/>
        </div>
    )
}

const SubmissionFormComponent = ({surveyId}) => {
    const submissionState = useSelector(state => state.submission);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(fetchSurveyAsync({surveyId: surveyId}))
    }, [])

    if(submissionState.loading) return <FormBackgroundWrapper
        component={
            <WhiteBgWrapper 
                component={
                    <div className='md:h-[200px] md:w-[200px] h-[100px] w-[100px]'><HourGlassLoading/></div>
                }
            />
        }
    />
    if(submissionState.error) return <FormBackgroundWrapper
        component={
            <WhiteBgWrapper 
                component={
                    <div className='md:text-[26px] p-1 font-bold'>Unable to fetch survey</div>
                }
            />
        }
    />
    if(submissionState.isAlreadySubmitted) return <FormBackgroundWrapper 
        component={
            <WhiteBgWrapper
                component={
                    <div>
                        <img src={submitSurveyQueriousLogo} 
                            className='md:h-[150px] h-[80px]'
                        />
                        <div className='md:text-[26px] 
                        text-[14px] flex justify-center font-bold'>You've submitted your response to this survey</div>
                    </div>
            }/>
        }
    />
    if(submissionState.isClosed) return <FormBackgroundWrapper 
        component={
            <WhiteBgWrapper
                component={
                    <div>
                        <img src={submitSurveyQueriousLogo} 
                            className='md:h-[150px] h-[80px]'
                        />
                        <div className='md:text-[26px]
                            flex justify-center text-[14px] font-bold'>This survey is not accepting responses currently</div>
                    </div>
                }
            />
        }
    />
    else if(submissionState.data) return <div> <FormBackgroundWrapper align='start' component={<SurveyComponent />}/> </div>
}

const SurveyComponent = () => {

    return <div className='md:w-[700px] md:p-2
            p-1 my-2 w-[320px] bg-white rounded-md'>
        <SurveyFormHeadingComponent />
        <hr className='border-black'/>
        <SurveyFormQuestionsComponent />
        <hr className='border-black'/>
        <SurveyFormFooterComponent />
    </div>
}

const SurveyFormHeadingComponent = () => {
    const { surveyTitle, description } = useSelector(state => state.submission.data.survey)
    return <div className='bg-blue-300  rounded-md m-1 px-1 pb-1'>
        <div className='md: md:text-[25px]
            px-1 font-bold'> {surveyTitle} </div>
        <div className='md: md:text-[18px] md:max-h-none md:h-auto
            p-1 mt-2 overflow-y-auto max-h-[85px] text-[14px] font-semibold'> {description} </div>
    </div>
}

const SurveyFormQuestionsComponent = () => {
    const dispatch = useDispatch();
    let key = 1;

    const updateTextResponse = useDebouncedCallback((questionId, currentAnswer) => {
        dispatch(editAnswer({questionId: questionId, questionType: 'TEXT', userAnswer: currentAnswer}))
    }, 1200)

    const updateOptionAnswer = useDebouncedCallback((questionId, questionType, optionId, isChecked) => {
        dispatch(editAnswer({questionId: questionId, questionType: questionType, optionId: optionId, isChecked: isChecked}))
    }, 0)

    const OptionsComponent = ({questionId}) => {
        let optionType, questionType, key = 1;
        const options = useSelector((state) => {
            const questionData = state.submission.data.survey.questions.filter((question) => question.id == questionId);
            questionType = questionData[0].type
            return questionData[0].options;
        })  

        switch (questionType) {
            case 'SINGLE_SELECT': optionType = 'radio'
            break;
        
            case 'MULTIPLE_SELECT': optionType = 'checkbox'
            break;
        }

        return <div className=''>
            {
                options.map((option) => {
                    return <div key={key++} className='flex justify-start'>
                        <div className='flex justify-start gap-1 hover:cursor-pointer' onClick={() => { updateOptionAnswer(questionId, questionType, option.id, option.isChecked) }}>
                            <input
                                onChange={() =>{ updateOptionAnswer(questionId, questionType, option.id, option.isChecked) }}
                                className='md:h-4 md:w-4 md:my-auto' type={optionType} id={option.id} checked={option.isChecked}
                            />
                            <div className='md:text-[18px] align-center hover:pointer'>{option.optionLabel}</div>
                        </div>
                    </div>
                })
            }
        </div>
    }

    const TextBoxComponent = ({questionId}) => {
        const userResponse = useSelector(state => {
            const response = state.submission.data.submissionPayload.userResponse.filter(response => response.questionId == questionId)
            return response[0].answer
        })

        const [currentResponse, setCurrentResponse] = useState(userResponse);

        return <div className='md:p-2 flex justify-center'>
            <textarea onChange={(e) => {
                    setCurrentResponse(e.target.value)
                    updateTextResponse(questionId, e.target.value)
                }}
                rows = '1' id={questionId} value={currentResponse}
                placeholder='Enter your answer'
                className='md:w-[670px] md:h-[40px] md:text-[20px] md:rounded-md
                border-[1px] p-1 text-[16px] border-black rounded-sm w-[295px]'
            />
        </div>
    }

    const QuestionComponent = ({serialNumber, questionId}) => {
        const question = useSelector((state) => {
            const questionData = state.submission.data.survey.questions.filter((question) => question.id == questionId)
            return questionData[0]
        })

        return <div className={`p-[2px] px-2 my-[5px] transition-colours duration-500 hover:bg-[#FFDBA4] ease-in-out bg-blue-300 rounded-md`}>
            <div>
                <div className='md:text-[20px] text-[15px] font-semibold'>{serialNumber + '. ' + question.questionLabel}</div>
            </div>
            <div>
                {(question.type !== 'TEXT') &&
                    <div className='md:p-2 p-1 my-1 flex justify-between rounded-md bg-slate-100'>
                        <div><OptionsComponent questionId={question.id} type={question.type}/></div>
                        {question.isRequired &&
                            <div className='mt-auto md:text-[15px] text-[12px] text-red-600'>*Required</div>
                        }
                    </div>
                }
                {(question.type === 'TEXT') && 
                    <div className='py-2'>
                        <TextBoxComponent questionId={question.id}/>
                        {question.isRequired &&
                            <div className='pt-1 flex justify-end md:text-[15px] text-[12px] text-red-500'>*Required</div>
                        }
                    </div>
                }
            </div>
        </div>
    }

    const { questions } = useSelector(state => state.submission.data.survey);

    return <div>
        {
            questions.map((question) => {
                return <QuestionComponent key={key++} serialNumber={key} questionId={question.id}/>
            })
        }
    </div>
}

const SurveyFormFooterComponent = () => {
    const dispatch = useDispatch();
    const { surveyId } = useParams();
    const isAnonymous = useSelector(state => state.submission.data.submissionPayload.isAnonymous)
    const { survey, submissionPayload } = useSelector(state => state.submission.data)
    const [currentIsAnonymous, setIsAnonymous] = useState(isAnonymous)
    const [isLoading, setIsLoading] = useState(false);
    const submitButtonData = isLoading ? <div className='md:max-h-[60px] md:min-w-[350px] max-h-[40px] max-w-[185px] flex justify-center' style={{transform: 'scale(1.5)', transformOrigin: 'center'}}><SubmitLoading /></div> : <div>Submit</div>
    const AnonymousButtonData = isAnonymous ? 
        <svg className={`md:size-6 size-4`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
        </svg> :  
        <svg className={`md:size-6 size-4`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
        </svg>;

    const toggleIsAnonymous = useCallback(() => {
        dispatch(toggleAnonymity(!currentIsAnonymous))
        setIsAnonymous(!currentIsAnonymous)
    })

    async function submitResponse () {
        setIsLoading(true)
        for(let index = 0; index < survey.questions.length; index++) {
            if(survey.questions[index].isRequired) {
                if(!survey.questions[index].isAnswered){
                    setIsLoading(false)
                    alert('Please attempt all the required questions');
                    return;
                }
            }
        }

        try {
            await axios({
                url: `${backendUrl}/submissions`,
                method: 'POST',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': localStorage.getItem('queriousToken')
                },
                data: submissionPayload
            })
    
            dispatch(fetchSurveyAsync({surveyId: surveyId}))
        } catch (err) {
            alert('Unable to submit your response')
            setIsLoading(false)
        }
    }

    return <div className={`md:p-2 m-[1px] my-1 p-1 rounded-md bg-blue-300 flex justify-between ${isLoading ? 'pointer-events-none' : 'pointer-events-auto'}`}>
        <button onClick={submitResponse}>
            <div className={`${isLoading ? '' : 'md:p-2 md:px-32 py-1 px-[60px]'} md:text-[30px] text-[20px] font-semibold hover:bg-white hover:text-blue-300
                bg-slate-900 text-white border-black rounded-md items-center transform-colours duration-100 ease-in`}>
                {submitButtonData}
            </div>
        </button>
        <div className='flex justify-start md:gap-1 gap-[7px] pr-1'>
            <div className='md:text-[20px] md:w-[210px] grid items-center
                text-[11px] w-[60px]'>Keep me Anonymous</div>
            <button onClick={toggleIsAnonymous}>
                <div className={`md:h-[30px] md:w-[70px] rounded-full flex items-center
                    h-[18px] w-9 transition duration-300 bg-${currentIsAnonymous ? 'white' : 'blue-400'}    
                `}>
                    <div className={`md:h-[35px] md:w-[35px] font-semibold md:text-[15px] flex justify-center place-items-center
                        h-[21px] w-[21px] transition-transform duration-300 text-[10px] rounded-full ${currentIsAnonymous ? 'text-white md:translate-x-[35px] translate-x-[18px] shadow-black shadow-sm bg-black' : 'translate-x-[-3px] bg-white'}`}>
                            {AnonymousButtonData}
                    </div>
                </div>
            </button>
        </div>
    </div>
}

const FormBackgroundWrapper = ({align = 'center', component}) => {
    const isSmallScreen = useMediaQuery({ query: '(max-width:768px)' });
    return <div className={`bg-slate-200 flex justify-center items-${align}`}
        style={{
            minHeight: '100vh',
            backgroundSize: isSmallScreen ? '500px' : `1000px`,
            backgroundImage: `url(${submitSurveyBackgroundImage})`
        }}
    >
        <div>{component}</div>
    </div>
}

const WhiteBgWrapper = ({component}) => {
    return <div className='w-fit p-1 rounded-md bg-[#F2F7F4]'>
        {component}
    </div>
}