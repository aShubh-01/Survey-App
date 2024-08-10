import { useState, useEffect } from 'react';
import axios from 'axios';
import queriousLogo from '../../assets/images/queriousLogo.png';
import { backendUrl } from '../../config.js'
import { useNavigate } from 'react-router-dom';

export default function AuthComponent() {
    const [isEmailSent, setIsEmailSent] = useState(false);
    const [userEmail, setUserEmail] = useState('');
    
    return (
        <div className='bg-[#2887CC] h-screen'>
            <div className='flex justify-center'>
                <div><Heading /></div>
            </div>
            <div className='my-[10px] flex justify-center'>
                <div className='md:p-[5px] md:border-[3px] md:rounded-[10px]
                        align-center p-[5px] border-white border-[1px] rounded-[6px]'>
                    {!isEmailSent &&
                        <div><EmailInput email={userEmail} setEmail={setUserEmail} setIsEmailSent={setIsEmailSent} /></div>
                    }
                    {isEmailSent &&
                        <div><CodeInput  email={userEmail}/></div>
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

const EmailInput = ({email, setEmail, setIsEmailSent}) => {

    function handleEnterEvent (event) {
        if (event.key === 'Enter') sendEmail();
    }

    const sendEmail = async () => {
        const response = await axios({
            url: `${backendUrl}/users/send`,
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            data: {
                'email': email
            }

        })
        
        console.log(response);
        if(response.status === 200){
            alert('Email Sent');
            setIsEmailSent(true);
        }
    }

    return <div className='flex justify-center gap-[5px]'>
        <div>
            <input className='md:py-[10px] md:pl-[10px] md:w-[360px] md:text-[18px]
                p-[4px] pl-[5px] w-[220px] border-black border-[2px] text-[15px] rounded-[5px]'
                placeholder='Enter your email' type='email' onKeyDown={handleEnterEvent}
                onChange={(event) => { setEmail(event.target.value) }}
            />
        </div>
        <div>
            <button onClick={sendEmail} className='md:py-[8px] md:px-[40px] md:text-[20px] md:rounded-[8px] md:border-[2px] md:font-semibold
                p-[2px] px-[20px] bg-green-400 text-[18px] text-white border-black border-[2px] font-semibold rounded-[5px]'>
                Send
            </button>
        </div>
    </div>
}

const SendingMailLoading = () => {
    return <div>

    </div>
}

const CodeInput = ({email}) => {
    const [userCode, setUserCode] = useState('');
    const navigate = useNavigate();

    function handleEnterEvent (event) {
        if (event.key === 'Enter') verifyCode();
    }

    async function resendEmail () {
        const response = await axios({
            url: `${backendUrl}/users/send`,
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            data: {
                'email': email
            }
            
        })
        console.log(response);
        if(response.status === 200){
            alert('Email Sent');
        }
    }

    async function verifyCode () {
        const response = await axios({
            url: `${backendUrl}/users/verify`,
            method: 'POST',
            headers: {
                'Content-Type': "application/json"
            },
            data: {
                'email': email,
                'code': userCode 
            }
        })

        console.log(response);
        if(response.status === 200) {
<<<<<<< HEAD
            alert('Code Valid');
            navigate('/dashboard');
        }
    }

    return <div>
        <div className='flex justify-center'>
            <div>
                <input className='md:p-[8px] md:w-[350px] md:pl-[10px] md:text-[18px]
                    p-[5px] pl-[5px] text-[15px] w-[300px] rounded-[5px] border-black border-[2px]' type='text' placeholder='Enter your code'
                    onChange={(event) => {setUserCode(event.target.value)}} onKeyDown={handleEnterEvent}
                />
            </div>    
        </div>
        <div className='flex justify-between py-[5px]'>
            <div><button className='md:p-[10px] md:px-[45px] md:text-[23px] md:font-bold md:tracking-wide md:border-[3px] md:rounded-[10px]
                    p-[5px] px-[44px] bg-green-400 text-[18px] text-white font-semibold tracking-tight border-black border-[2px] rounded-[5px]'
                    onClick={resendEmail}>
                Resend
                </button>
            </div>
            <div><button className='md:p-[10px] md:px-[45px] md:text-[23px] md:font-bold md:tracking-wide md:border-[3px] md:rounded-[10px]
                    p-[5px] px-[44px] bg-blue-400 text-[18px] text-white font-semibold tracking-tight border-black border-[2px] rounded-[5px]'
                    onClick={verifyCode}>
                Verify
                </button>
            </div>
        </div>
    </div>
}
