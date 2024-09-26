import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { useMediaQuery } from 'react-responsive';
import { PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
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
                component={<AnalysisComponent 
                    analysisData={responseAnalysisData.analysisData}
                />}
                align='start'
            />
        </>
    )
}

const AnalysisComponent = ({analysisData}) => {
    const [currentPage, setCurrentPage] = useState('Responses');
    const [currentPageData, setCurrentPageData] = useState(<ResponsesComponent responsesData={analysisData.responsesData} />)

    const buttonStyle = (page) => {
        return `md:p-2 md:w-[300px] md:text-[20px] md:font-semibold md:rounded-[30px] md:rounded-b-none 
        p-1 text-[15px] w-[113px] bg-white rounded-[18px] rounded-b-none border-[2px] ${currentPage == page ? 'border-black border-b-white' : 'border-black'}`
    };
    
    return <div className='md:max-w-[900px] max-w-[340px]'>
        <div>
            <div className='flex justify-between md:gap-[1px]'>
                <button onClick={() => {
                    setCurrentPage('Responses')
                    setCurrentPageData(<ResponsesComponent 
                        responsesData={analysisData.responsesData} 
                    />)
                }}
                    className={buttonStyle('Responses')}
                    >Responses
                </button>

                <button onClick={() => {
                    setCurrentPage('Statistics')
                    setCurrentPageData(<StatisticsComponent 
                        statisticsData={analysisData.statisticsData}
                    />)
                }}
                    className={buttonStyle('Statistics')}
                    >Statistics
                </button>
                
                <button onClick={() => {
                    setCurrentPage('Settings')
                    setCurrentPageData(<SettingsComponent 
                        surveyId={analysisData.surveyInfo.surveyId}
                    />)
                }}
                    className={buttonStyle('Settings')}
                    >Settings
                </button>
            </div>
            <div className='p-1 bg-white rounded-lg rounded-t-none border-black border-[2px] border-t-0'>
                {currentPageData}
            </div>
        </div>
    </div>
}

const ResponsesComponent = ({responses}) => {
    return <div>
        responses
    </div>
}

const StatisticsComponent = ({statisticsData}) => {
    const isSmallScreen = useMediaQuery({ query: '(max-width:768px)' });
    let key = 1;

    const QuestionInfo = ({question, serialNo}) => {
        return <div className='md:m-2 md:text-[20px] font-bold
            bg-white m-1 my-2 p-2 py-1 text-[13px] rounded-md border-[1px] border-black'>
            <div className='flex justify-between place-items-center'>
                <div>{serialNo}. {question.questionLabel}</div>
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
        const colourCodes = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'];
        const chartSize = isSmallScreen ? 150 : 260;
        const outerRadius = isSmallScreen ? 40 : 100; 
    
        useEffect(() => {
            const updatedOptions = options.map((optionData, index) => ({
                ...optionData,
                colour: colourCodes[index % colourCodes.length]
            }));
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
                            label
                        >
                            {optionsData.map((optionData, index) => (
                                <Cell key={`cell-${index}`} fill={optionData.colour} />
                            ))}
                        </Pie>
                        <Tooltip />
                    </PieChart>
                </div>
                <div className='w-[400px] flex place-items-center'>
                    <div className="p-1 legend mt-4 text-left">
                        <ul className='md:text-[16px] text-[9px] font-semibold'>
                            {optionsData.map((optionData, index) => {
                                return <li key={index} className='flex justify-start gap-1'>
                                    <div className={`flex my-auto md:h-[12px] md:w-[12px] h-[7px] w-[7px] border-black border-[1px]`}
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

    console.log(statisticsData);
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

    return <div className='p-1 px-2'>
        <div className='md:text-[20px] my-2 flex justify-between place-items-center'>
            <div>Accept Responses</div>
            <div className='mr-3'>
                <button onClick={() => {
                    dispatch(setIsClosed({isClosed: !isClosed}))
                    toggleAcceptResponses(!isClosed)
                }}>
                    <div className={`md:w-20 md:h-9
                    w-12 h-6 flex items-center border-black border-[1px] rounded-full p-1
                    transition duration-300 ${isClosed ? 'bg-white' : 'bg-[#FFDAB9]'}
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