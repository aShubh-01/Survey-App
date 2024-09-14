import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AuthComponent from './Auth';
import { fetchSurveyAsync } from '../../state/features/submissionSlice'
import { useMediaQuery } from 'react-responsive';
import { HourGlassLoading } from '../AnimatedComponents';
import { editAnswer } from '../../state/features/submissionSlice';
import submitSurveyBackgroundImage from '../../assets/images/submitSurveyBackgroundImage.png';
import useDebouncedCallback from '../../state/customHooks/debounceCallback';
import submitSurveyQueriousLogo from '../../assets/images/submitSurveyQueriousLogo.png'

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
            <WhiteBgWrapper component={
                <div>
                <img src={submitSurveyQueriousLogo} 
                    className='md:h-[150px] h-[75px]'
                />
                <div className='md:text-[26px] md:pl-6
                    pl-1 text-[14px] font-bold'>You've submitted your response to this survey</div>
            </div>
            }/>
        }
    />
    else if(submissionState.data) return <div> <FormBackgroundWrapper component={<SurveyComponent />}/> </div>
}

const SurveyComponent = () => {
    const { survey: surveyData } = useSelector(state => state.submission.data)

    return <div className=''>
        <div className='md:w-[700px]
                p-1 mx-auto w-[320px] bg-white'>
            <SurveyFormHeadingComponent />
            <hr className='border-black'/>
            <SurveyFormQuestionsComponent />
            <hr className='border-black'/>
            <SurveyFormFooterComponent />
        </div>
    </div>
}

const SurveyFormHeadingComponent = () => {
    const { surveyTitle, description } = useSelector(state => state.submission.data.survey)
    return <div>
        <div className='md:p-[2px] md:text-[25px]
            p-[1px] m-1 font-bold bg-slate-300'> {surveyTitle} </div>
        <div className='md:p-[2px] md:text-[18px] md:max-h-none md:h-auto
            overflow-y-auto max-h-[85px] m-1 p-[1px] text-[14px] font-semibold bg-slate-300'> {description} </div>
    </div>
}

const SurveyFormQuestionsComponent = () => {
    const dispatch = useDispatch();
    let key = 1;
    
    const OptionsComponent = ({questionId, options, type}) => {
        let optionType, key = 1;

        function updateAnswer (questionId, questionType, optionId, isChecked) {
            dispatch(editAnswer({questionId: questionId, questionType: questionType, optionId: optionId, isChecked: isChecked}))
        }

        switch (type) {
            case 'SINGLE_SELECT': optionType = 'radio'
            break;
        
            case 'MULTIPLE_SELECT': optionType = 'checkbox'
            break;
        }

        return <div className=''>
            {
                options.map((option) => {
                    return <div key={key++} className='flex justify-start'>
                        <div className='flex justify-start gap-1 hover:cursor-pointer' onClick={() => { updateAnswer(questionId, type, option.id, option.isChecked) }}>
                            <input
                                onChange={() =>{ updateAnswer(questionId, type, option.id, option.isChecked) }}
                                className='md:h-4 md:w-4 md:my-auto' type={optionType} id={option.id} checked={option.isChecked}
                            />
                            <div className='md:text-[18px] align-center hover:pointer'>{option.optionLabel}</div>
                        </div>
                    </div>
                })
            }
        </div>
    }

    const TextBoxComponent = ({questionId, userAnswer}) => {
        const [currentResponse, setCurrentResponse] = useState(userAnswer);

        const updateUserAnswer = useDebouncedCallback((questionId, currentAnswer) => {
            dispatch(editAnswer({questionId: questionId, questionType: 'TEXT', userAnswer: currentAnswer}))
        }, 1500)

        return <div className='md:p-2 flex justify-center'>
            <textarea onChange={(e) => {
                    setCurrentResponse(e.target.value)
                    updateUserAnswer(questionId, e.target.value)
                }}
                rows = '1' id={questionId} value={currentResponse}
                className='md:w-[670px] md:h-[40px] md:text-[20px] md:rounded-md
                border-[1px] p-1 text-[16px] border-black rounded-sm w-[295px]'
            />
        </div>
    }

    const QuestionComponent = ({question}) => {
        return <div className='p-1 m-1 bg-slate-300'>
            <div>
                <div className='md:text-[20px] font-semibold'>{question.questionLabel}</div>
            </div>
            <div>
                {(question.type !== 'TEXT') &&
                    <div className='flex justify-between'>
                        <div className='p-1'><OptionsComponent questionId={question.id} options={question.options} type={question.type}/></div>
                        {question.isRequired &&
                            <div className='mt-auto p-1'>Required</div>
                        }
                    </div>
                }
                {(question.type === 'TEXT') && 
                    <div>
                        <TextBoxComponent questionId={question.id} userAnswer={question.answer}/>
                        {question.isRequired &&
                            <div className='p-1 flex justify-end'>Required</div>
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
                return <QuestionComponent key={key++} question={question}/>
            })
        }
    </div>
}

const SurveyFormFooterComponent = () => {
    return <div>
        submit
    </div>
}

const FormBackgroundWrapper = ({component}) => {
    const isSmallScreen = useMediaQuery({ query: '(max-width:768px)' });
    return <div className='bg-slate-200 grid'
        style={{
            minHeight: '100vh',
            backgroundSize: isSmallScreen ? '500px' : `1000px`,
            backgroundImage: `url(${submitSurveyBackgroundImage})`,
            placeItems: 'center'
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