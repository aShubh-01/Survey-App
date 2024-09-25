import { useState, useEffect } from 'react';
import axios from 'axios';
import { useGetAnalysisData } from '../../state/customHooks/getAnalysisData';
import { backendUrl } from '../../config';

export default function AnalyseComponent() {
    const responseAnalysisData = useGetAnalysisData(localStorage.getItem('surveyId'));

    if(responseAnalysisData.isLoading) return <BackgroundWrapperComponent component={<div>Loading</div>} />
    console.log(responseAnalysisData.analysisData)

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
    
    return <div>
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
                        stats={analysisData.statisticsData}
                    />)
                }}
                    className={buttonStyle('Statistics')}
                    >Statistics
                </button>
                
                <button onClick={() => {
                    setCurrentPage('Settings')
                    setCurrentPageData(<SettingsComponent 
                        surveyId={analysisData.surveyInfo.surveyId} 
                        isClosed={analysisData.surveyInfo.isClosed} 
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

const StatisticsComponent = ({stats}) => {
    return <div>
        stats
    </div>
}

const SettingsComponent = ({surveyId, isClosed}) => {
    return <div className='p-1'>
        <div className='my-1 flex justify-between'>
            <div>Accept Responses</div>
            <div><button>close</button></div>
        </div>
        <div className='my-1 flex justify-between'>
            <div>Delete Survey</div>
            <div><button>delete</button></div>
        </div>
    </div>
}

const BackgroundWrapperComponent = ({component, align = 'center'}) => {
    return <div className={`flex justify-center place-items-${align} bg-[#FFDAB9] h-screen`}>
        {component}
    </div>
} 