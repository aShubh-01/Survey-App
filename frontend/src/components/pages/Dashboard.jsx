import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchAllSurveys } from '../../state/features/fetchSurveysSlice';
import dashboardLogo from '../../assets/images/dashboardLogo.png';
import { useMediaQuery } from 'react-responsive';

export default function DashboardComponent() {
    return (
        <div className='h-screen bg-[#FFDAB9] text-white'>
            <div className='flex justify-center py-[30px]'><Heading /></div>
            <div className='flex justify-center'>
                <div className='grid md:grid-cols-2 md:gap-[50px] grid-cols-1'>
                    <div><ButtonComponent label="New Survey" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="md:size-10 size-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}/></div>
                    <div><ButtonComponent label="Saved Surveys" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="md:size-10 size-7"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" /></svg> } /></div>
                </div>
            </div>
            <div className='md:m-[50px] my-[60px] flex justify-center'>
                <PublishedSurveysComponent />
            </div>
        </div>
    )
}

const Heading = () => {
    return <div>
        <img className='md:h-[150px] h-[80px]' src={dashboardLogo}/>
    </div>
}

const ButtonComponent = ({label, icon, onClickDo}) => {
    return <div className='flex justify-center md:rounded-[20px]
                m-[5px] bg-slate-300 rounded-[10px] bg-slate-900'>
        <button className='md:p-[40px] md:px-[50px] gap-[10px]
                p-[10px] px-[75px] flex justify-center gap-[5px]' onClick={onClickDo}>
            <div>{icon}</div>
            <div className='md:p-[2px] md:text-[25px] md:font-bold
                p-[1px] text-[18px] font-semibold'>{label}</div>
        </button>
    </div>
}

const PublishedSurveysComponent = () => {
    let key = 1;
    const isSmallScreen = useMediaQuery({ query: '(max-width:768px)' });
    const dispatch = useDispatch();
    const { loading, data : surveys, error } = useSelector((state) => state.allSurveys);

    useEffect(() => {
        dispatch(fetchAllSurveys())
    }, [dispatch])

    if(loading) return <div>Loading</div>
    if(error) return <div>Unable to fetch published surveys</div>

    return <div className='md:text-[21px]'>
        <table className='md:w-[1000px] md:border-4 bg-black
            border-2 border-black'>
            <thead>
                <tr>
                    <th className='md:p-2 md:pl-[25px]
                        w-1/2 pl-[15px] text-left p-1'>Title</th>
                    <th className='md:p-2 md:text-center
                        w-1/3 text-right p-1'>Responses</th>
                    <th className='p-2 text-right
                        w-1/3 pr-[12px] md:text-center p-1'>Status</th>
                </tr>
            </thead>
        </table>
  
        <div className='md:max-h-[400px] bg-slate-900
            my-[5px] overflow-y-auto max-h-[180px] border-black border-2'>
            <table>
                <tbody>
                    {
                        surveys.publishedSurveys.map((survey) => {
                            const surveyTitle = survey.surveyTitle;

                            return <div key={key++} className='md:m-[10px] md:text-[23px] md:border-2
                                        m-[3px] border-white border-[1px] rounded-lg bg-black'>
                                <td className='md:w-[500px]
                                    w-[140px] px-[5px] py-[7px] text-left'>{(isSmallScreen ? 
                                    (surveyTitle.length > 15 ? surveyTitle.slice(0, 15) + "..." : surveyTitle) :
                                    (surveyTitle.length > 32 ? surveyTitle.slice(0, 32) + "..." : surveyTitle.slice(0, 35)))}
                                </td>
                                <td className='md:w-[300px]
                                    w-[115px] px-[5px]  py-[7px] text-center'> {survey._count.submission > 99 ? 99 + "+" : survey._count.submission}
                                </td>
                                <td className='md:text-center md:w-[170px] md:pl-[28px]
                                    w-right px-[5px] py-[7px]'> {survey.isClosed ? 
                                    <div>Closed</div> :
                                    <div>Open</div>
                                    }
                                </td>
                            </div>
                        })
                    }
                    <tr>
                        
                    </tr>
                </tbody>
            </table>
        </div>
    </div> 
}