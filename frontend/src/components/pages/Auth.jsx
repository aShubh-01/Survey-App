import { useState } from 'react';
import queriousLogo from '../../assets/images/queriousLogo.png';

export default function AuthComponent() {
    const [isEmailSent, setIsEmailSent] = useState(false);
    
    return (
        <div className='bg-[#2887CC] h-screen'>
            <div className='flex justify-center'>
                <div><Heading /></div>
            </div>
            <div className='my-[10px] flex justify-center'>
                <div className='md:p-[10px] md:border-[5px] md:rounded-[10px]
                        align-center p-[5px] border-white border-[3px] rounded-[5px]'>
                    {!isEmailSent &&
                        <div onClick={() => {setIsEmailSent(true)}}><EmailInput /></div>
                    }
                    {isEmailSent &&
                        <div onClick={() => {setIsEmailSent(false)}}><CodeInput /></div>
                    }
                </div>
            </div>
        </div>
    )
}

const Heading = () => {
    return <div>
        <img className='h-[250px] md:h-[450px]' src={queriousLogo} alt="Querious Logo" />
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
            <input className='md:py-[10px] md:pl-[10px] md:w-[360px] md:text-[18px]
                p-[4px] pl-[5px] w-[230px] border-black border-[2px] text-[15px] rounded-[5px]'
                placeholder='Enter your email' type='email' onKeyDown={handleEnterEvent}
            />
        </div>
        <div>
            <button onClick={sendEmail} className='md:py-[8px] md:w-[100px] md:text-[20px] md:rounded-[25px] md:border-[2px] md:font-semibold
                p-[2px] w-[80px] bg-green-400 text-[18px] text-white border-black border-[2px] font-semibold rounded-[5px]'>
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
            <div><input className='md:p-[8px] md:pl-[10px] md:text-[18px]
                p-[5px] pl-[5px] text-[15px] w-[315px] rounded-[5px] border-black border-[2px]' type='text' placeholder='Enter your code' /></div>    
        </div>
        <div className='flex justify-around py-[5px]'>
            <div><button className='md:p-[5px] md:px-[20px] md:text-[20px] md:font-bold md:tracking-wide md:border-[4px] md:rounded-[20px]
                    p-[5px] px-[45px] bg-green-400 text-[18px] text-white font-semibold tracking-tight border-black border-[2px] rounded-[5px]'>
                Resend
                </button>
            </div>
            <div><button className='md:p-[5px] md:px-[20px] md:text-[20px] md:font-bold md:tracking-wide md:border-[4px] md:rounded-[20px]
                    p-[5px] px-[45px] bg-blue-400 text-[18px] text-white font-semibold tracking-tight border-black border-[2px] rounded-[5px]'>
                Verify
                </button>
            </div>
        </div>
    </div>
}
