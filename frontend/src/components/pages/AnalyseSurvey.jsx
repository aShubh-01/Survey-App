import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useMediaQuery } from 'react-responsive';
import { PieChart, Pie, Cell, Tooltip } from 'recharts';
import axios from 'axios';
import { setIsClosed } from '../../state/features/analyseSurvey';
import { useSelector, useDispatch } from 'react-redux';
import useGetAnalysisData from '../../state/customHooks/getAnalysisData';
import useDebouncedCallback  from '../../state/customHooks/debounceCallback';
import { backendUrl } from '../../config';

export default function AnalyseComponent() {
    const responseAnalysisData = useGetAnalysisData(localStorage.getItem('surveyId'));

    if(responseAnalysisData.isLoading) return <BackgroundWrapperComponent component={<div>Loading</div>} />

    return (
        <>
            <BackgroundWrapperComponent 
                component={
                    <div>
                        <SurveyComponent
                            surveyId={responseAnalysisData.analysisData.surveyInfo.surveyId}
                            title={responseAnalysisData.analysisData.surveyInfo.surveyTitle}
                            description={responseAnalysisData.analysisData.surveyInfo.description}
                            analysisData={responseAnalysisData.analysisData}
                        />

                    </div>
                }
                align='start'
            />
        </>
    )
}

const SurveyComponent = ({surveyId, title, description, analysisData}) => {
    let fillSurveyLink = window.location.href;
    fillSurveyLink = fillSurveyLink.split('/analyse').join('') + `/submit/${surveyId}`

    const copyLink = () => {
        navigator.clipboard.writeText(fillSurveyLink)
    }
    
    return <div className='md:p-4 p-2 md:max-w-[900px] max-w-[340px] bg-white rounded-lg my-4'>
        <div className='md:text-[25px] text-[17px] font-bold'>{title}</div>
        <div className='md:text-[18px] md:pr-0 md:pl-2 pl-1 pr-6 text-[12px]'>
            <div>{description}</div>
            <div className='my-2 md:flex md:justify-start gap-1'>
                <span className='font-bold'>Submit Link </span> {' : '} 
                <span className='md:mt-0 mt-1 flex justify-start'>
                    <span>
                        <a className='p-[2px] px-2 rounded-l-lg border-[1px] border-black bg-slate-200 text-slate-800' 
                        href={fillSurveyLink}>
                            {fillSurveyLink}
                        </a>
                    </span>
                    <span>
                        <button onClick={copyLink} 
                            className='bg-slate-200 rounded-r-lg border-[1px] border-black'>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="md:size-6 size-4">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 17.25v3.375c0 .621-.504 1.125-1.125 1.125h-9.75a1.125 1.125 0 0 1-1.125-1.125V7.875c0-.621.504-1.125 1.125-1.125H6.75a9.06 9.06 0 0 1 1.5.124m7.5 10.376h3.375c.621 0 1.125-.504 1.125-1.125V11.25c0-4.46-3.243-8.161-7.5-8.876a9.06 9.06 0 0 0-1.5-.124H9.375c-.621 0-1.125.504-1.125 1.125v3.5m7.5 10.375H9.375a1.125 1.125 0 0 1-1.125-1.125v-9.25m12 6.625v-1.875a3.375 3.375 0 0 0-3.375-3.375h-1.5a1.125 1.125 0 0 1-1.125-1.125v-1.5a3.375 3.375 0 0 0-3.375-3.375H9.75" />
                            </svg>
                        </button>
                    </span>
                </span>
            </div>
        </div>
        <div>
            <AnalysisComponent analysisData={analysisData}/>
        </div>
    </div>
}

const AnalysisComponent = ({analysisData}) => {
    const [currentPage, setCurrentPage] = useState('Responses');
    const buttonStyle = (page) => {
        return `md:p-2 md:w-[300px] md:text-[20px] md:font-semibold md:rounded-[30px] md:rounded-b-none 
        p-1 text-[15px] w-[113px] bg-white rounded-[18px] rounded-b-none border-[2px] ${currentPage == page ? 'border-black border-b-white' : 'border-black'}`
    };

    return (
        <div className='md:max-w-[900px] max-w-[340px]'>
            <div>
                <div className='flex justify-between md:gap-[1px]'>
                    <button onClick={() => setCurrentPage('Responses')} className={buttonStyle('Responses')}>
                        Responses
                    </button>

                    <button onClick={() => setCurrentPage('Statistics')} className={buttonStyle('Statistics')}>
                        Statistics
                    </button>

                    <button onClick={() => setCurrentPage('Settings')} className={buttonStyle('Settings')}>
                        Settings
                    </button>
                </div>

                <div className='p-1 bg-white rounded-lg rounded-t-none border-black border-[2px] border-t-0'>
                    {currentPage === 'Responses' && (
                        <ResponsesComponent
                            responsesData={analysisData.responsesData}
                            questionsData={analysisData.surveyInfo.questions}
                        />
                    )}

                    {currentPage === 'Statistics' && (
                        <StatisticsComponent 
                            statisticsData={analysisData.statisticsData}
                        />
                    )}

                    {currentPage === 'Settings' && (
                        <SettingsComponent 
                            surveyId={analysisData.surveyInfo.surveyId}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}

const ResponsesComponent = ({responsesData, questionsData}) => {
    const [userResponseId, setUserResponseId] = useState(0);

    if(responsesData.length < 1) return <div className='md:text-[25px] rounded-lg p-2 grid place-items-center bg-[#FFDAB9] font-bold'>
        <div className='bg-white rounded-md p-2 px-4'>No Responses!</div>
    </div>

    const userName = responsesData[userResponseId].isAnonymous ? (userResponseId+1 + '.' + 'Anonymous') : (userResponseId+1 + '.' + responsesData[userResponseId].userEmail); 

    const updateUserId = (updateAction) => {
        switch (updateAction) {
            case 'increement': {
                if(userResponseId == responsesData.length - 1) break;
                setUserResponseId(userResponseId + 1)
            } break;

            case 'decrement': {
                if(userResponseId == 0) break;
                setUserResponseId(userResponseId - 1)
            } break
        }
    } 

    const QuestionResponseAnswer = ({userAnswer, questionLabel, type}) => {
        let key = 1;

        return <div className='md:text-[20px] md:my-2 p-2 font-semibold my-1 rounded-lg border-[2px] border-black'>
            <div className=''>
                {questionLabel}
            </div>
            <div className='md:m-1 md:text-[18px] p-2 text-[15px] rounded-lg bg-white'>
                {(type == 'MULTIPLE_SELECT') &&
                    <div className='md:gap-10 flex justify-start gap-4'>
                        {userAnswer.map((option) => {
                            return <div key={key++} className='flex justify-start gap-1'>
                                <div>•</div>
                                <div>{option}</div>
                            </div>
                        })}
                    </div>
                }
                {(type != 'MULTIPLE_SELECT') && 
                    <div className='flex justify-start gap-1'>
                        {(type == 'SINGLE_SELECT') && <div>•</div>} {userAnswer}
                    </div>
                }
            </div>
        </div>
    }

    const ResponseComponent = ({userResponseId, questionsData}) => {
        const userResponseData = responsesData[userResponseId]
        let userResponseAnswerIndex = 0;
        let key = 1

        return <div>
            {
                questionsData.map((question) => {
                    const userResponseAnswer = userResponseData.answers[userResponseAnswerIndex];
                    if(question.id == userResponseAnswer.questionId) {
                        userResponseAnswerIndex += 1;
                        return <QuestionResponseAnswer key={key++} userAnswer={userResponseAnswer.userAnswer} questionLabel={question.questionLabel} type={question.type} />
                    } else {
                        return <QuestionResponseAnswer key={key++} userAnswer={<i>Not Attempted</i>} questionLabel={question.questionLabel} type={'TEXT'} />
                    }
                })
            }
        </div>
    }

    return <div className='p-2 rounded-md bg-[#FFDAB9]'>
        <div className='flex justify-between'>
            <button onClick={() => {updateUserId('decrement')}}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="p-[1px] rounded-md bg-white md:size-8 size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                </svg>
            </button>
            <div className='md:text-[20px] md:font-bold mt-[1px] font-semibold font-mono'>
                {userName}
            </div>
            <button onClick={() => {updateUserId('increement')}}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="p-[1px] rounded-md bg-white md:size-8 size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                </svg>
            </button>
        </div>
        <div>
            <ResponseComponent userResponseId={userResponseId} questionsData={questionsData} />
        </div>
    </div>
}

const StatisticsComponent = ({statisticsData}) => {
    const isSmallScreen = useMediaQuery({ query: '(max-width:768px)' });
    let key = 1;

    const QuestionInfo = ({question, serialNo}) => {
        let questionType;
        switch(question.type) {
            case 'TEXT': { questionType = 'Text Response' } break;
            case 'SINGLE_SELECT': { questionType = 'Multiple Choice' } break;
            case 'MULTIPLE_SELECT': { questionType = 'Check Boxes' } break;
        }
        return <div className='md:m-2 md:text-[20px] font-bold
            bg-white m-1 my-2 md:px-4 p-2 text-[13px] rounded-md border-[1px] border-black'>
            <div className='flex justify-between place-items-center'>
                <div>
                    {serialNo}.
                    <span className='md:text-[15px] md:p-2 mx-1 p-1 rounded-md font-semibold bg-slate-200 text-[10px]'>{questionType}</span> 
                    {question.questionLabel}
                </div>
                <div className='grid place-items-center'>
                    <div>{question.attempts}</div>
                    <div className='md:text-[18px] text-[10px]'>Attempts</div>
                    
                </div>
            </div>
            {(question.type != 'TEXT') &&
                <div>
                    <OptionResponsesInfo options={question.options}  type={question.type}/>
                </div>
            }
            {(question.type == 'TEXT') &&
                <div>
                    <TextResponses textResponses={question.textResponses} />
                </div>
            }
        </div>
    }
    
    const OptionResponsesInfo = ({ options, type }) => {
        const [optionsData, setOptionsData] = useState(options);
        const colourCodes = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40', '#B4FF38', '#FF5733', '#C70039', '#8E44AD'];
        const chartSize = isSmallScreen ? 100 : 250;
        const outerRadius = isSmallScreen ? 45 : 100; 
        let totalVotes = 0;
    
        useEffect(() => {
            totalVotes = options.reduce((total, option) => total + option.votes, 0);
            const updatedOptions = options.map((optionData, index) => ({
                ...optionData,
                colour: colourCodes[index % colourCodes.length]
            }));
            if(totalVotes == 0) updatedOptions.push({optionLabel: <i>No Votes</i>, votes: 1, colour: '#e0e0e0'}); 
            setOptionsData(updatedOptions);
        }, [options]);
    
        return (
            <div className='flex justify-between'>
                <div className='flex place-items-center'>
                    <PieChart width={chartSize} height={chartSize}>
                        <Pie
                            data={optionsData}
                            dataKey="votes"
                            nameKey="optionLabel"
                            cx="50%"
                            cy="50%"
                            outerRadius={outerRadius}
                            fill="#8884d8"
                        >
                            {optionsData.map((optionData, index) => (
                                <Cell key={`cell-${index}`} fill={optionData.colour} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>
                <div className='md:w-[350px] w-[150px] flex place-items-center'>
                    <div className="p-1 legend text-left">
                        <ul className='md:text-[16px] text-[9px] font-semibold'>
                            {optionsData.map((optionData, index) => {
                                return <li key={index} className='flex justify-start gap-1'>
                                    <div className={`flex my-auto md:h-[12px] md:w-[12px] h-[7px] rounded-full w-[7px] border-black border-[1px]`}
                                        style={{backgroundColor: optionData.colour}}
                                    ></div>
                                    <div>
                                        {optionData.optionLabel} - {optionData.votes}
                                    </div>
                                </li>
                            })}
                        </ul>
                    </div>
                </div>
            </div>
        );
    };

    const TextResponses = ({textResponses}) => {
        let key = 1;
        return <div className='md:text-[18px] md:max-h-[200px] text-[12px] overflow-y-auto max-h-[100px]'>
            {
                textResponses.map((textResponse) => {
                    return <div key={key++} className='m-1 p-1'>
                        <hr className='m-1 border-1 border-slate-300'/>
                        <div>
                            "{textResponse}"
                        </div>
                    </div>
                })
            }
        </div>
    }

    return <div className='m-1 p-1 bg-[#FFDAB9] rounded-lg'>
        {
            statisticsData.map((question) => {
                return <QuestionInfo
                    serialNo={key} 
                    key={key++}
                    question={question}
                />
            })
        }
    </div>
}

const SettingsComponent = ({surveyId}) => {
    const isClosed = useSelector(state => state.analyseSurvey.isClosed);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const toggleAcceptResponses = useDebouncedCallback((isClosed) => {
        axios({
            url: `${backendUrl}/surveys/${surveyId}`,
            method: 'PUT',
            headers: {
                'Authorization': localStorage.getItem('queriousToken'),
                'Content-Type': "application/json"
            },
            data: {
                isClosed: isClosed
            }
        })
    }, 0)

    const deleteSurvey = useDebouncedCallback(async (surveyId) => {
        await axios({
            url: `${backendUrl}/surveys/${surveyId}`,
            method: 'DELETE',
            headers: {
                'Authorization': localStorage.getItem('queriousToken'),
                'Content-Type': "application/json"
            }
        })
        navigate('/dashboard')

    }, 0)

    return <div className='p-1 px-2 bg-[#FFDAB9] rounded-lg'>
        <div className='md:text-[20px] my-2 flex justify-between place-items-center'>
            <div>Accept Responses</div>
            <div className='mr-3'>
                <button onClick={() => {
                    dispatch(setIsClosed({isClosed: !isClosed}))
                    toggleAcceptResponses(!isClosed)
                }}>
                    <div className={`md:w-20 md:h-9
                    w-12 h-6 flex items-center border-black border-[1px] rounded-full p-1
                    transition duration-300 ${isClosed ? 'bg-[#FFDAB9]' : 'bg-white'}
                    `}>
                        <div className={`md:w-[40px] md:h-[40px]
                            w-[25px] h-[25px] rounded-full transitions 
                            transition-transform duration-300 ${isClosed ? 'translate-x-[-6px] bg-black' : 'md:translate-x-[40px] translate-x-[22px] bg-black shadow-black shadow-sm'}`}>
                        </div>
                    </div>
                </button>
            </div>
        </div>
        <div className='md:text-[20px] my-2 flex justify-between place-items-center'>
            <div>Delete Survey</div>
            <div>
                <button onClick={() => {deleteSurvey(surveyId)}}
                    className='md:p-2 md:px-4 
                        text-white font-semibold bg-red-500 p-1 px-2 rounded-md'
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
}

const BackgroundWrapperComponent = ({component, align = 'center'}) => {
    return <div className={`flex justify-center place-items-${align} bg-[#FFDAB9] h-screen overflow-y-auto`}>
        {component}
    </div>
} 