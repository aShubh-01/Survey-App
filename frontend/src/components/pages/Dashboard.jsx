import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchAllSurveys } from '../../state/features/fetchSurveysSlice';
import dashboardLogo from '../../assets/images/dashboardLogo.png';
import queriousBackground from '../../assets/images/queriousBackground.png';
import { useMediaQuery } from 'react-responsive';

export default function DashboardComponent() {
    const navigate = useNavigate();
    const isSmallScreen = useMediaQuery({ query: '(max-width:768px)' });

    return (
        <div className='h-screen w-full bg-cover bg-center text-white'
            style={{
                backgroundSize: isSmallScreen ? '500px' : `1000px`,
                backgroundImage: `url(${queriousBackground})`
            }}
        >
        <div className='flex justify-center py-[30px]'><Heading /></div>
        <div className='flex justify-center'>
            <div className='grid md:grid-cols-2 md:gap-[50px] grid-cols-1'>
                <div><ButtonComponent label="New Survey" onClickDo={() => navigate('/create')} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="md:size-10 size-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}/></div>
                <div><ButtonComponent label="Unpublished" onClickDo={() => navigate('/unpublished')} icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="md:size-10 size-7"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" /></svg> } /></div>
            </div>
        </div>
        <div className='md:m-[50px] my-[60px] flex justify-center'>
            <PublishedSurveysComponent isSmallScreen={isSmallScreen}/>
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
    return <div className='flex justify-center md:rounded-[20px] md:shadow-md
                m-[5px] bg-slate-300 rounded-[10px] bg-slate-900 shadow-sm shadow-black'>
        <button className='md:p-[40px] md:px-[60px] gap-[10px]
                p-[10px] px-[85px] flex justify-center gap-[5px]' onClick={onClickDo}>
            <div>{icon}</div>
            <div className='md:p-[2px] md:text-[25px] md:font-bold
                p-[1px] text-[18px] font-semibold'>{label}</div>
        </button>
    </div>
}

const PublishedSurveysComponent = ({isSmallScreen}) => {
    let key = 1;
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, data : surveys, error } = useSelector((state) => state.allSurveys);

    useEffect(() => {
        dispatch(fetchAllSurveys())
    }, [dispatch])

    if(loading) return <div>Loading</div>
    if(error) return <div>Unable to fetch published surveys</div>
    if(surveys.publishedSurveys.length < 1) return <div>You have not published any surveys yet</div>

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
        <div className='md:max-h-[400px] bg-slate-800 rounded-lg
            my-[5px] overflow-y-auto max-h-[180px] border-black border-2'>
            <table>
                <tbody>
                    {
                        surveys.publishedSurveys.map((survey) => {
                            const surveyTitle = survey.surveyTitle;

                            function analyseSurvey() {
                                //localStorage.setItem('surveyId', survey.id);
                                navigate('/analyse')
                            }

                            return <div key={key++}>
                                <button onClick={analyseSurvey}
                                    className='md:m-[10px] md:text-[23px] md:border-2
                                    m-[3px] border-white border-[1px] rounded-lg bg-black
                                    transform translate-transform duration:300 hover:translate-y-[-2px]'>
                                        <td className='md:w-[500px] md:p-[15px]
                                            w-[140px] px-[5px] py-[7px] text-left'>{(isSmallScreen ? 
                                            (surveyTitle.length > 15 ? surveyTitle.slice(0, 15) + "..." : surveyTitle) :
                                            (surveyTitle.length > 32 ? surveyTitle.slice(0, 32) + "..." : surveyTitle.slice(0, 35)))}
                                        </td>
                                        <td className='md:w-[300px]
                                            w-[115px] px-[5px]  py-[7px] text-center'> {survey._count.submission > 99 ? 99 + "+" : survey._count.submission}
                                        </td>
                                        <td className='md:text-center md:w-[170px] md:pl-[28px]
                                            w-[60px] text-left px-[5px] py-[7px]'> {survey.isClosed ? 
                                            <div className='text-[#FF0000]'>Closed</div> :
                                            <div className='text-[#00FF00]'>Open</div>
                                            }
                                        </td>
                                    </button>
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