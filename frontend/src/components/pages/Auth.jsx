import queriousLogo from '../../assets/images/queriousLogo.png';

export default function AuthComponent() {
    return (
        <div className='bg-[#FAE593] h-screen'>
            <div className='flex justify-center'>
                <div><Heading /></div>
            </div>
            <div className='md:max-w-[500px] md:p-[15px] md:border-[2px] md:rounded-[5px]
                    max-w-[350px] p-[5px] bg-[#FFF6D9] border-black border-[1px] rounded-[5px]'>
                <div><EmailInput /></div>
                <div><CodeInput /></div>
            </div>
        </div>
    )
}

const Heading = () => {
    return <div>
        <img className='h-[320px] md:h-[380px]' src={queriousLogo} alt="Querious Logo" />
    </div>
}

const EmailInput = () => {

    function handleEnterEvent (event) {
        if (event.key === 'Enter') sendEmail();
    }

    async function sendEmail () {

    }

    return <div className='flex justify-center gap-[5px] md:gap-[20px]'>
        <div>
            <input className='md:pl-[10px] md:w-[360px] md:text-[18px]
                p-[2px] pl-[5px] w-[250px] h-[38px] border-black border-[2px] text-[15px] rounded-[5px]'
                placeholder='Enter your email' type='email' onKeyDown={handleEnterEvent}
            />
        </div>
        <div>
            <button onClick={sendEmail} className='md:p-[2px] md:w-[100px] md:text-[20px] md:border-[2px] md:font-semibold
                p-[2px] w-[80px] bg-[#FED688] text-[20px] border-black border-[2px] font-semibold rounded-[7px]'>
                Send
            </button>
        </div>
    </div>
}

const SendingMailLoading = () => {
    return <div>

    </div>
}

const CodeInput = () => {
    return <div>

    </div>
}