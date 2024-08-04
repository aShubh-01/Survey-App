import dashboardLogo from '../../assets/images/dashboardLogo.png'

export default function DashboardComponent() {
    return (
        <div>
            <div className='flex justify-center py-[30px]'><Heading /></div>
            <div className='flex justify-center'>
                <div className='grid md:grid-cols-2 md:gap-[50px] grid-cols-1'>
                    <div><ButtonComponent label="New Survey" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="md:size-10 size-7"><path stroke-linecap="round" stroke-linejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>}/></div>
                    <div><ButtonComponent label="Draft Surveys" icon={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="md:size-10 size-7"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 3.75V16.5L12 14.25 7.5 16.5V3.75m9 0H18A2.25 2.25 0 0 1 20.25 6v12A2.25 2.25 0 0 1 18 20.25H6A2.25 2.25 0 0 1 3.75 18V6A2.25 2.25 0 0 1 6 3.75h1.5m9 0h-9" /></svg> } /></div>
                </div>
            </div>
            <div className='flex justify-center'>
                <PublishedBlogComponent />
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
    return <div className='md:rounded-[20px]
                m-[5px] bg-slate-300 rounded-[10px]'>
        <button className='md:p-[40px] md:px-[50px] gap-[10px]
                p-[10px] px-[80px] flex justify-center gap-[5px]' onClick={onClickDo}>
            <div>{icon}</div>
            <div className='md:text-[25px] md:font-bold
                p-[3px] text-[18px] font-semibold'>{label}</div>
        </button>
    </div>
}

const PublishedBlogComponent = () => {
    return <div>
        publishedBlog
    </div>   
}