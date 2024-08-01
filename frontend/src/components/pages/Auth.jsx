import queriousLogo from '../../assets/images/queriousLogo.png';

export default function AuthComponent() {
    return (
        <div className='bg-[#2887CC] h-screen'>
            <div className='flex justify-center'>
                <div><Heading /></div>
            </div>
            <div className='my-[10px] flex justify-center'>
                <div className='md:p-[10px] md:border-[2px] md:rounded-[5px]
                        align-center p-[5px] bg-[#C0C0C0] border-white border-[1px] rounded-[5px]'>
                    <div><EmailInput /></div>
                    <div><CodeInput /></div>
                </div>
            </div>
        </div>
    )
}

const Heading = () => {
    return <div>
        <img className='h-[300px] md:h-[450px]' src={queriousLogo} alt="Querious Logo" />
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
                p-[2px] w-[80px] bg-[#FED688] text-[20px] border-black border-[2px] font-semibold rounded-[20px]'>
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
        <div className='flex justify-center'>
            <div><input className='pl-[5px] text-[15px] w-[335px] rounded-[5px] border-black border-[2px]' type='text' placeholder='Enter your code' /></div>    
        </div>
        <div className='flex justify-around'>
            <div><button className='p-[5px] px-[20px] bg-blue-400 text-white'>
                Verify
                </button>
            </div>
            <div><button>
                Resend
                </button>
            </div>
        </div>
    </div>
}
