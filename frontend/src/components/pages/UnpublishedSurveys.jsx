import { useEffect } from 'react';
import { useMediaQuery } from 'react-responsive';
import { useNavigate } from 'react-router-dom';
import unpublishedSurveysBackground from '../../assets/images/unpublishedSurveysBackground.png';
import { createAndAddSurveyAsync } from '../../state/features/surveySlice';
import { useDispatch } from 'react-redux';

export default function UnpublishedSurveysComponent(){
    let key = 1;
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const isSmallScreen = useMediaQuery({ query: '(max-width:768px)' });
    const surveys = JSON.parse(localStorage.getItem('unpublishedSurveys'))

    const createSurvey = async () => {
        localStorage.removeItem('survey');
        dispatch(createAndAddSurveyAsync({surveyTitle: 'Untitled Survey', questionLabel: 'Untitled Question', type: 'SINGLE_SELECT', optionLabel: 'Untitled Option'}))
        navigate('/create');
    }
   
    if(surveys.length < 1) {
        return <div className='h-screen flex justify-center'
        style={{
            backgroundSize: isSmallScreen ? '500px' : `1000px`,
            backgroundImage: `url(${unpublishedSurveysBackground})`
        }}>
        <span className='md:h-[50px] md:text-[25px] md:p-2 md:w-auto
            h-[65px] w-[300px] bg-white text-center my-96 p-1 text-[20px] font-bold rounded-md shadow-md shadow-black'>
            No Unpublished Surveys {':('} Create a <button className='px-2 rounded-md bg-black text-white' onClick={createSurvey}>New One!</button>
        </span>
        </div>
    }

    useEffect(() => {
        localStorage.removeItem('survey');
    })

    return (
        <>
            <div style={{
                    backgroundSize: isSmallScreen ? '500px' : `1000px`,
                    backgroundImage: `url(${unpublishedSurveysBackground})`
                }}
                className='flex justify-center bg-[#4dc1c1]'>
                <div className='h-screen overflow-y-auto bg-slate-400 my-4 p-4 px-2 rounded-md shadow-lg shadow-black'>
                    {
                        surveys.map((survey) => {
                            function insertSurvey(){
                                localStorage.setItem('survey', JSON.stringify(survey));
                                navigate('/create')
                            }

                            return <div key={key++} className='md:m-2 md:hover:translate-y-[-10px] 
                                m-[7px] shadow-md
                                tranform transition-transform duration-200 hover:translate-y-[-3px]'>
                                <SurveyCardComponent
                                    isSmallScreen={isSmallScreen}
                                    title={survey.surveyTitle} 
                                    description={survey.description || false} 
                                    questions={survey._count.questions}
                                    onClickDo={insertSurvey}
                                />
                            </div>
                        })
                    }
                </div>
            </div>
        </>
    )
}

const SurveyCardComponent = ({isSmallScreen, title, description, questions, onClickDo}) => {

    return <button className='bg-slate-200 border-black border-2 rounded-md' onClick={onClickDo}>
        <div className='md:w-[700px] md:p-4
            flex justify-between w-[280px] gap-[20px] py-1 px-2'>
            <div>
                <p className='md:text-[30px]
                    text-left text-[20px] font-bold'>
                    {
                        isSmallScreen ? (title.length > 15 ? title.slice(0, 15) + "..." : title) :
                        (title.length > 25 ? title.slice(0, 25) + "..." : title)
                    }
                    </p>
                <p className='md:text-[18px]
                    text-left pl-1'>
                    {
                        isSmallScreen ? (description.length > 20 ? description.slice(0, 19) + "..." : description) :
                        (description.length > 68 ? description.slice(0, 65) + "..." : description)
                    }
                </p>
            </div>
            <div>
                <p className='md:text-[30px]
                    flex justify-center text-[20px] font-bold'>{questions}</p>
                <p className='md:text-[18px]'>
                        {questions <= 1 &&
                        <span>question</span>
                    }
                    {questions > 1 && 
                        <span>questions</span>
                    }
                </p>
            </div>
        </div>
    </button>
}