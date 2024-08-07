import dashboardLogo from '../../assets/images/dashboardLogo.png'
import { useGetTodos } from '../../state/customHooks/getTodos'

export default function DashboardComponent() {
    return (
        <div>
            <div className='flex justify-center py-[30px]'><Heading /></div>
            <div className='flex justify-center'>
                <div className='grid md:grid-cols-2 md:gap-[50px] grid-cols-1'>
                    <div><ButtonComponent label="New Survey" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="md:size-10 size-7"><path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}/></div>
                    <div><ButtonComponent label="Saved Surveys" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="md:size-10 size-7"><path strokeLinecap="round" strokeLinejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" /></svg> } /></div>
                </div>
            </div>
            <div className='m-[15px] flex justify-center'>
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
                m-[5px] bg-slate-300 rounded-[10px]'>
        <button className='md:p-[40px] md:px-[50px] gap-[10px]
                p-[10px] px-[70px] flex justify-center gap-[5px]' onClick={onClickDo}>
            <div>{icon}</div>
            <div className='md:p-[2px] md:text-[25px] md:font-bold
                p-[1px] text-[18px] font-semibold'>{label}</div>
        </button>
    </div>
}

const PublishedSurveysComponent = () => {
    const surveys = useGetTodos();
    let key = 1;

    if(surveys.isLoading) return <div>Loading</div>

    console.log(surveys.surveys.publishedSurveys);
    return <div>
        <table className='w-[305px] border-2 border-black'>
            <thead>
                <tr className='border-2 border-black'>
                    <th className='w-1/2 text-left p-1'>Title</th>
                    <th className='w-1/3 text-right p-1'>Responses</th>
                    <th className='w-1/3 text-right p-1'>Status</th>
                </tr>
            </thead>
        </table>
        <div className='my-[5px] border-black border-2 overflow-y-auto max-h-[180px]'>
            <table>
            <tbody>
                    <tr>
                        <td className='w-[140px] px-[5px] text-left'>Survey first</td>
                        <td className='w-[105px] px-[5px] text-center'>4</td>
                        <td className='w-[53px] text-left'>Closed</td>
                    </tr>
                    <tr>
                        <td className='w-[140px] px-[5px] text-left'>Survey first</td>
                        <td className='w-[105px] px-[5px] text-center'>4</td>
                        <td className='w-[53px] text-left'>Closed</td>
                    </tr>
                    <tr>
                        <td className='w-[140px] px-[5px] text-left'>Survey first</td>
                        <td className='w-[105px] px-[5px] text-center'>4</td>
                        <td className='w-[53px] text-left'>Closed</td>
                    </tr>
                    <tr>
                        <td className='w-[140px] px-[5px] text-left'>Survey first</td>
                        <td className='w-[105px] px-[5px] text-center'>4</td>
                        <td className='w-[53px] text-left'>Closed</td>
                    </tr>
                    <tr>
                        <td className='w-[140px] px-[5px] text-left'>Survey first</td>
                        <td className='w-[105px] px-[5px] text-center'>4</td>
                        <td className='w-[53px] text-left'>Closed</td>
                    </tr>
                    <tr>
                        <td className='w-[140px] px-[5px] text-left'>Survey first</td>
                        <td className='w-[105px] px-[5px] text-center'>4</td>
                        <td className='w-[53px] text-left'>Closed</td>
                    </tr>
                    <tr>
                        <td className='w-[140px] px-[5px] text-left'>Survey first</td>
                        <td className='w-[105px] px-[5px] text-center'>4</td>
                        <td className='w-[53px] text-left'>Closed</td>
                    </tr>
                    <tr>
                        <td className='w-[140px] px-[5px] text-left'>Survey first</td>
                        <td className='w-[105px] px-[5px] text-center'>4</td>
                        <td className='w-[53px] text-left'>Closed</td>
                    </tr>
                    <tr>
                        <td className='w-[140px] px-[5px] text-left'>Survey first</td>
                        <td className='w-[105px] px-[5px] text-center'>4</td>
                        <td className='w-[53px] text-left'>Closed</td>
                    </tr>
                    <tr>
                        <td className='w-[140px] px-[5px] text-left'>Survey first</td>
                        <td className='w-[105px] px-[5px] text-center'>4</td>
                        <td className='w-[53px] text-left'>Closed</td>
                    </tr>
                    <tr>
                        <td className='w-[140px] px-[5px] text-left'>Survey first</td>
                        <td className='w-[105px] px-[5px] text-center'>4</td>
                        <td className='w-[53px] text-left'>Closed</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
}