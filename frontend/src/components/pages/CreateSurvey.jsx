import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';
import { useMediaQuery } from 'react-responsive';

export default function CreateSurveyComponent() {
    const isSmallScreen = useMediaQuery({ query: '(max-width:768px)' });
    const { survey } = useSelector(state => state.survey)

    useEffect(() => console.log(survey), [survey]);

    return (
        <>
            <div className='flex justify-center h-screen bg-slate-600'>
                <div className='m-2 p-2 rounded-md md:w-[700px] w-[300px] bg-slate-500'>
                    <TitleCardComponent id={survey.id} title={survey.surveyTitle} description={survey.description} />
                    <QuestionsComponent questions={survey.questions} />
                    <FooterComponent />
                </div>
            </div>
        </>
    )
}

const TitleCardComponent = ({id, title, description}) => {
    const [currentTitle, setCurrentTitle] = useState(title);
    const [currentDesc, setCurrentDesc] = useState(description);

    return <div className='mb-2 md:text-[25px]'>
        <div className='p-2 bg-slate-300 rounded-md grid gap-2'>
            <span>
                <input type='text' value={currentTitle}
                    className='md:w-[450px] md:pl-[5px]
                        pl-[2px] w-[200px] focus:outline-none border-black border-b-[1px]'
                    onChange={(event) => {
                        setCurrentTitle(event.target.value)
                    }}
                />
            </span>
            <span>
                <input type='text' value={currentDesc}
                    className='md:pl-[5px] md:w-[670px] md:text-[20px]
                        pl-[2px] w-[270px] border-black border-b-[1px] focus:outline-none'
                    onChange={(event) => {
                        setCurrentDesc(event.target.value)
                    }}
                />
            </span>
        </div>
    </div>
}

const QuestionsComponent = ({questions}) => {

    const questionTypeOptions = [
        {value: "SINGLE_SELECT", label: "Multiple Choice"},
        {value: "MULTIPLE_SELECT", label: "Check Boxes"},
        {value: "TEXT", label: "Text Response"}
    ]

    const SelectQuestionTypeComponent = ({currentQuestionType}) => {
        const [selectedQuestionTypeValue, setCurrentQuestionTypeValue] = useState(currentQuestionType);

        const selectedQuestionTypeLabel = useMemo(() => {
            switch(selectedQuestionTypeValue) {
                case questionTypeOptions[0].value : return questionTypeOptions[0].label
                case questionTypeOptions[1].value : return questionTypeOptions[1].label
                case questionTypeOptions[2].value : return questionTypeOptions[2].label
            }
        }, [selectedQuestionTypeValue])
    
        return <div>
            <select className='
                bg-white py-[3px] mt-[2px] text-center'
                value={selectedQuestionTypeLabel}
                onChange={(event) => {
                    questionTypeOptions.forEach((questionType) => {
                        if(questionType.label === event.target.value) {
                            setCurrentQuestionTypeValue(questionType.value)
                        }
                    })
                }}
            >
        {
            questionTypeOptions.map((questionType) => {
                return <option key={questionType.value} value={questionType.label}>
                    {questionType.label}
                </option>
            })
        }
            </select>
        </div>
    }

    const OptionsComponent = ({type, options}) => {
        let icon;
        switch (type) {
            case 'SINGLE_SELECT': icon =  <svg className='size-4' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 19.5C16.1421 19.5 19.5 16.1421 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5ZM12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" fill="#080341"></path> </g></svg>
            break;
        
            case 'MULTIPLE_SELECT': icon = <svg className='size-4' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Checkbox_Unchecked"> <path id="Vector" d="M4 7.2002V16.8002C4 17.9203 4 18.4801 4.21799 18.9079C4.40973 19.2842 4.71547 19.5905 5.0918 19.7822C5.5192 20 6.07899 20 7.19691 20H16.8031C17.921 20 18.48 20 18.9074 19.7822C19.2837 19.5905 19.5905 19.2842 19.7822 18.9079C20 18.4805 20 17.9215 20 16.8036V7.19691C20 6.07899 20 5.5192 19.7822 5.0918C19.5905 4.71547 19.2837 4.40973 18.9074 4.21799C18.4796 4 17.9203 4 16.8002 4H7.2002C6.08009 4 5.51962 4 5.0918 4.21799C4.71547 4.40973 4.40973 4.71547 4.21799 5.0918C4 5.51962 4 6.08009 4 7.2002Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg>
            break;
        }

        return <div className='text-[15px] '>
            <div>
                {
                    options.map((option) => {
                        return <div key={option.id} className='m-[1px] flex justify-start gap-[1px]'>
                            <div className='pt-[3px]'>
                                { icon }
                            </div>
                            <div>
                                {option.optionLabel}
                            </div>
                        </div>
                    })
                }
            </div>
            <div className='px-1 pb-1'>
                <button>
                    + Add Option
                </button>
            </div>
        </div>
    }

    const ToggleSwitchComponent = ({currentIsRequired}) => {
        const [isRequired, setIsRequired] = useState(currentIsRequired);
        
        const toggleIsRequired = () => {
            setIsRequired(!isRequired);
        }

        return <div className='flex justify-around'>
            <span>
                Required
            </span>
            <button onClick={toggleIsRequired}>
                <div className={`w-10 h-4 flex items-center border-black border-[1px] rounded-full p-1
                    transition duration-300 ${isRequired ? 'bg-gray-200' : 'bg-gray-700'}
                `}>

                    <div className={`w-[20px] h-[20px] rounded-full shadow-black shadow-sm transitions 
                        transition-transform duraction-300 ${isRequired ? 'translate-x-[15px] bg-gray-700' : 'translate-x-[-5px] bg-white'}`}>

                    </div>
                </div>
            </button>
        </div>
    }

    const QuestionFootComponent = () => {

        return <div className='flex justify-end gap-2'>
            <button>
                <svg className="size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                </svg>
            </button>
            <div>
                <ToggleSwitchComponent />
            </div>
        </div>
    }

    const AddQuestionComponent = () => {

        return <div>    
            add
        </div>  
    }

    return <div className='my-1 p-2 rounded-md bg-slate-300'>
        {
            questions.map((question) => {
                const [currentQuestion, setCurrentQuestion] = useState(question.questionLabel);

                return <div key={question.id}>
                    <div className=''>
                        <div className='flex justify-between gap-[6px]'>
                            <span className=''>
                                <input type='text' value={currentQuestion}
                                    className='md:pl-2 md:text-[23px] md:w-[500px]
                                        pl-[2px] mt-[2px] text-[15px] w-[160px] focus:outline-none border-black border-b-[1px]'
                                    onChange={(event) => setCurrentQuestion(event.target.value)}
                                />
                            </span>
                            <span className='md:text-[20px]
                                text-[12px]'>
                               <SelectQuestionTypeComponent currentQuestionType={question.type}/>
                            </span>
                        </div>
                        <div>
                            {question.type !== 'TEXT' &&
                                <OptionsComponent type={question.type} options={question.options}/>
                            }
                        </div>
                        <div>
                            <QuestionFootComponent />
                        </div>
                    </div>
                </div>
            })
        }
        <AddQuestionComponent />
    </div>
}

const FooterComponent = () => {
    return <div>
        foot
    </div>
}