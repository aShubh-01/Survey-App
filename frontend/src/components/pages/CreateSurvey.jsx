import { useSelector, useDispatch } from 'react-redux';
import { useEffect, useState, useMemo } from 'react';
import axios from 'axios';
import { backendUrl } from '../../config';
import { useMediaQuery } from 'react-responsive';
import createSurveyBackgroundImage from '../../assets/images/createSurveyBackgroundImage.png';
import { initiateSurvey, deleteQuestion, deleteSurvey, setQuestionFocusesState, setFocus, setQuesionLabel, 
    setQuestionType, setOptionLabel, deleteOption, setDescription, setTitle, addOptionAsync,
    addQuestionAsync, createAndAddSurveyAsync, toggleRequirementAsync} from '../../state/features/surveySlice';
import { fetchAllSurveys } from '../../state/features/fetchSurveysSlice';
import useDebouncedCallback from '../../state/customHooks/debounceCallback';
import { useNavigate } from 'react-router-dom';

export default function CreateSurveyComponent() {
    const isSmallScreen = useMediaQuery({ query: '(max-width:768px)' });
    const dispatch = useDispatch();
    const colourPalette = ['bg-[#FF007F]', 'bg-[#FFDBA4]', 'bg-white']
    const { survey } = useSelector(state => state.survey) 

    useEffect(() => {
        const currentSurvey = JSON.parse(localStorage.getItem('survey'));
        if(currentSurvey) {
            dispatch(initiateSurvey(currentSurvey));
            dispatch(setQuestionFocusesState())
        } else {
            dispatch(createAndAddSurveyAsync());
        }
    }, []);

    if(survey === null) return <div>Loading survey</div>

    useEffect(() => {
        dispatch(fetchAllSurveys());
    }, [survey])

    return (
        <>
            <div className={`flex justify-center min-h-screen ${colourPalette[0]}`}
                style={{
                    backgroundSize: isSmallScreen ? '500px' : `1000px`,
                    backgroundImage: `url(${createSurveyBackgroundImage})`,
                    alignItems: 'flex-start',
                }}
            >
                    <div className='md:p-4
                        m-4 mb-10 p-3 rounded-md md:w-[800px] w-[315px] bg-white'>
                    <TitleCardComponent bgColour={colourPalette[1]}/>
                    <QuestionsComponent bgColour={colourPalette[1]} bgColour2={colourPalette[2]} />
                    <FooterComponent bgColour={colourPalette[1]}/>
                </div>
            </div>
        </>
    )
}

const TitleCardComponent = ({bgColour}) => {
    const dispatch = useDispatch();
    const { id, surveyTitle, description } = useSelector(state => {
        return state.survey.survey;
    });

    const updateTitleBackend = useDebouncedCallback((surveyId, surveyTitle) => {
        axios({
            url: `${backendUrl}/surveys/${surveyId}`,
            method: 'PUT',
            headers: {
                'Content-Type': "application/json",
                'Authorization': localStorage.getItem('queriousToken')
            },
            data: {
                surveyTitle
            } 
        })
    }, 1500)

    const updateDescriptionBackend = useDebouncedCallback((surveyId, description) => {
        axios({
            url: `${backendUrl}/surveys/${surveyId}`,
            method: 'PUT',
            headers: {
                'Content-Type': "application/json",
                'Authorization': localStorage.getItem('queriousToken')
            },
            data: {
                description
            } 
        })
    }, 1500)

    return <div className='mb-2 md:text-[25px]'>
        <div className={`p-2 ${bgColour} rounded-md grid gap-2`}>
            <span>
                <input type='text' value={surveyTitle} placeholder='Title'
                    className={`md:w-[600px] md:pl-[5px] font-bold
                        ${bgColour}
                        pl-[2px] w-[210px] focus:outline-none border-black border-b-[1px]`}
                    onChange={(event) => {
                        dispatch(setTitle(event.target.value))
                        updateTitleBackend(id, event.target.value);
                    }}
                />
            </span>
            <span>
                <textarea rows="2" maxLength="500" value={description} placeholder='Description'
                    className={`md:pl-[5px] md:w-[750px] md:text-[20px] font-semibold 
                        ${bgColour}
                        pl-[2px] w-[270px] border-black border-b-[1px] focus:outline-none`}
                    onChange={(event) => {
                        dispatch(setDescription(event.target.value))
                        updateDescriptionBackend(id, event.target.value)
                    }}
                ></textarea>
            </span>
        </div>
    </div>
}

const QuestionsComponent = ({bgColour, bgColour2}) => {
    const dispatch = useDispatch();
    const questions = useSelector(state => {
        return state.survey.survey.questions;
    })

    const questionTypeOptions = [
        {value: "SINGLE_SELECT", label: "Multiple Choice"},
        {value: "MULTIPLE_SELECT", label: "Check Boxes"},
        {value: "TEXT", label: "Text Response"}
    ]

    const QuestionComponent = ({question}) => {
        const dispatch = useDispatch();
        const [currentQuestionLabel, setCurrentQuestionLabel] = useState(question.questionLabel);
        const bgColour = '#F5DEB3'

        const updateQuestionStateBackend = useDebouncedCallback((id, questionLabel) => {
            dispatch(setQuesionLabel({ id, questionLabel }));
            axios({
                url: `${backendUrl}/questions/${id}`,
                method: 'PUT',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': localStorage.getItem('queriousToken')
                },
                data: {
                    questionLabel
                }
            }).catch((err) => {
                console.log(err);
                alert('Failed to update state/backend')
            });
        }, 1500)

        return <div onClick={() => {
            if(question.isFocused === false) dispatch(setFocus(question.id))
        }}>
            <div>
                <div className={`flex justify-between gap-[6px] py-[4px] px-[5px] mb-2 rounded-md ${bgColour2}`}>
                    <span className=''>
                        <input type='text' value={currentQuestionLabel}
                            className={`${question.isFocused ? 'w-[150px] md:w-[535px]' : 'w-[265px] md:w-[740px]'}
                                md:pl-[3px] md:text-[20px] ${bgColour2} font-semibold
                                pl-[1px] mt-[2px] text-[14px] focus:outline-none border-black border-b-[1px]`}
                            onChange={(event) => {
                                setCurrentQuestionLabel(event.target.value);
                                updateQuestionStateBackend(question.id, event.target.value);
                            }}
                        />
                    </span>
                    <span className={`${question.isFocused ? 'block' : 'hidden'}
                    md:text-[20px] text-[12px]`}>
                       <SelectQuestionTypeComponent questionId={question.id} currentQuestionType={question.type} bgColor={bgColour2}/>
                    </span>
                </div>
                <div>
                    {question.type !== 'TEXT' &&
                        <OptionsComponent questionId={question.id} options={question.options} type={question.type} isFocused={question.isFocused} bgColour={bgColour2}/>
                    }
                    {question.type === 'TEXT' &&
                        <div className='md:text-[20px]
                            text-gray-700 mt-2 mx-2 text-black font-mono'>
                            Text Response
                            <hr className='md:w-[710px] mt-2 border-gray-500 w-[250px] border-1px'/>
                        </div>
                    }
                </div>
                <div className={`${question.isFocused ? 'block' : 'hidden'}`}>
                    <QuestionFootComponent questionId={question.id} currentIsRequired={question.isRequired}/>
                </div>
                <hr className='md:my-4 my-2 border-black border-1'/>
            </div>
        </div>
    }

    const SelectQuestionTypeComponent = ({questionId, currentQuestionType, bgColor}) => {
        const [selectedQuestionTypeValue, setCurrentQuestionTypeValue] = useState(currentQuestionType);

        const updateQuestionTypeBackend = useDebouncedCallback((questionId, type) => {
            dispatch(setQuestionType({id: questionId, type: type}))
            axios({
                url: `${backendUrl}/questions/${questionId}`,
                method: 'PUT',
                headers: {
                    'Authorization': localStorage.getItem('queriousToken'),
                    'Content-Type': "application/json"
                },
                data: {
                    type
                }
            }).catch((err) => {
                console.log(err);
                alert('Unable to update question type')
            })
        }, 0)

        const selectedQuestionTypeLabel = useMemo(() => {
            switch(selectedQuestionTypeValue) {
                case questionTypeOptions[0].value : return questionTypeOptions[0].label
                case questionTypeOptions[1].value : return questionTypeOptions[1].label
                case questionTypeOptions[2].value : return questionTypeOptions[2].label
            }
        }, [selectedQuestionTypeValue])
    
        return <div>
            <select className={`md:rounded-md md:border-x-[2px] md:pt-[1px] md:px-2
                ${bgColor} focus:outline-none
                rounded-sm border-black border-x-[1px] py-[3px] mt-[3px] text-center`}
                value={selectedQuestionTypeLabel}
                onChange={(event) => {
                    questionTypeOptions.forEach((questionType) => {
                        if(questionType.label === event.target.value) {
                            setCurrentQuestionTypeValue(questionType.value)
                            updateQuestionTypeBackend(questionId, questionType.value);
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

    const OptionComponent = ({questionId, option, icon, isFocused, bgColour}) => {
        const dispatch = useDispatch();
        const [currentOptionLabel, setCurrentOptionLabel] = useState(option.optionLabel);

        const deleteOptionStateBackend = useDebouncedCallback((questionId,optionId) => {
            dispatch(deleteOption({questionId, optionId}));
            axios({
                url: `${backendUrl}/options/${optionId}`,
                method: 'DELETE',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': localStorage.getItem('queriousToken')
                }
            })
        }, 0)

        const updateOptionStateBackend = useDebouncedCallback((questionId, optionId, optionLabel) => {
            dispatch(setOptionLabel({questionId, optionId, optionLabel}));
            axios({
                url: `${backendUrl}/options/${optionId}`,
                method: 'PUT',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': localStorage.getItem('queriousToken')
                },
                data: {
                    optionLabel
                }
            })
        }, 1200);

        return <div className='md:text-[22px] 
                m-[1px] flex justify-start gap-[1px]'>
            <div className='md:pt-[4px] pt-[3px]'>
                { icon }
            </div>
            <div className='flex justify-start'>
                <input className={`md:w-[605px] ${bgColour}
                    focus:outline-none  focus:border-b-[1px] ${isFocused ? `hover:border-b-[1px]` : `border-[0px]`}
                    pl-1 w-[200px] border-black`}
                    type='text' value={currentOptionLabel} onChange={(e) => {
                        setCurrentOptionLabel(e.target.value)
                        updateOptionStateBackend(questionId, option.id, e.target.value)
                    }}
                />
                <button className={isFocused ? 'block' : 'hidden'} 
                    onClick={() => {deleteOptionStateBackend(questionId, option.id)}} >
                    <svg className={`rounded-lg hover:bg-red-500 hover:text-white
                        p-1 md:size-8 size-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    }

    const OptionsComponent = ({questionId, type, options, isFocused, bgColour}) => {
        const dispatch = useDispatch();

        let icon;
        switch (type) {
            case 'SINGLE_SELECT': icon =  <svg className='md:size-6 size-4' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <path fillRule="evenodd" clipRule="evenodd" d="M12 19.5C16.1421 19.5 19.5 16.1421 19.5 12C19.5 7.85786 16.1421 4.5 12 4.5C7.85786 4.5 4.5 7.85786 4.5 12C4.5 16.1421 7.85786 19.5 12 19.5ZM12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z" fill="#080341"></path> </g></svg>
            break;
        
            case 'MULTIPLE_SELECT': icon = <svg className='md:size-6 size-4' viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <g id="Interface / Checkbox_Unchecked"> <path id="Vector" d="M4 7.2002V16.8002C4 17.9203 4 18.4801 4.21799 18.9079C4.40973 19.2842 4.71547 19.5905 5.0918 19.7822C5.5192 20 6.07899 20 7.19691 20H16.8031C17.921 20 18.48 20 18.9074 19.7822C19.2837 19.5905 19.5905 19.2842 19.7822 18.9079C20 18.4805 20 17.9215 20 16.8036V7.19691C20 6.07899 20 5.5192 19.7822 5.0918C19.5905 4.71547 19.2837 4.40973 18.9074 4.21799C18.4796 4 17.9203 4 16.8002 4H7.2002C6.08009 4 5.51962 4 5.0918 4.21799C4.71547 4.40973 4.40973 4.71547 4.21799 5.0918C4 5.51962 4 6.08009 4 7.2002Z" stroke="#000000" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"></path> </g> </g></svg>
            break;
        }

        function addOptionMethod() {
            dispatch(addOptionAsync({id: questionId, optionLabel: 'Untitled Option'}))
        }

        return <div className={`py-1 px-2 pb-2 text-[15px] ${bgColour} rounded-lg`}>
            <div>
                {
                    options.map((option) => {
                        return <div key={option.id}>
                            <OptionComponent questionId={questionId} option={option} icon={icon} isFocused={isFocused} bgColour={bgColour}/>
                        </div>
                    })
                }
            </div>
            <div className={`${isFocused ? 'block' : 'hidden'} md:p-1`}>
                <button className='md:px-2 md:gap-1 md:border-[2px]
                    mt-2 px-1 flex justify-between gap-[1px] rounded-md border-black border-[1px]'
                    onClick={addOptionMethod}
                >
                    <div className='md:pt-[4px] pt-[2px]'>
                        <svg className="size-4 md:size-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                    </div>
                    <span className='md:p-[2px] p-[1px] text-[13px] md:text-[20px]'>
                        Add Option
                    </span>
                </button>
            </div>
        </div>
    }

    const ToggleSwitchComponent = ({questionId, currentIsRequired}) => {
        const dispatch = useDispatch();
        const [isRequired, setIsRequired] = useState(currentIsRequired);

        const updateIsRequiredStateBackend = useDebouncedCallback((questionId, isRequired) => {
            dispatch(toggleRequirementAsync({questionId, isRequired}))
        }, 1500)
        
        const toggleIsRequired = () => {
            updateIsRequiredStateBackend(questionId, !isRequired)
            setIsRequired(!isRequired);
        }

        return <button onClick={toggleIsRequired}>
            <div className={`md:w-14 md:h-6
                w-10 h-4 flex items-center border-black border-[1px] rounded-full p-1
                transition duration-300 ${isRequired ? 'bg-black' : 'bg-white'}
            `}>
                <div className={`md:w-[28px] md:h-[28px]
                    w-[20px] h-[20px] rounded-full transitions 
                    transition-transform duraction-300 ${isRequired ? 'md:translate-x-[26px] translate-x-[17px] bg-white shadow-black shadow-sm' : 'translate-x-[-5px] bg-black'}`}>
                </div>
            </div>
        </button>
    }

    const QuestionFootComponent = ({questionId, currentIsRequired, bgColour}) => {

        const deleteQuestionStateBackend = useDebouncedCallback((questionId) => {
            dispatch(deleteQuestion({questionId}))
            axios({
                url: `${backendUrl}/questions/${questionId}`,
                method: 'DELETE',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': localStorage.getItem('queriousToken')
                }
            })
        }, 0)

        return <div className='flex justify-end md:gap-4 gap-2'>
                <div className='md:text-[20px] md:pt-[22px] md:gap-2
                        pt-[13px] flex justify-between gap-1 text-[14px]'>
                    <span>
                        Required
                    </span>
                    <div className='pt-[2px]'>
                        <ToggleSwitchComponent questionId={questionId} currentIsRequired={currentIsRequired}/>
                    </div>
                </div>
                <button className={`md:pt-3 pt-[6px]`}
                    onClick={() => {deleteQuestionStateBackend(questionId)}}>
                    <svg className="md:size-10 
                        p-1 rounded-md hover:bg-red-500  hover:text-white size-7" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                </button>
            </div>
    }

    const AddQuestionComponent = () => {
        const { id } = useSelector(state => state.survey.survey);
        function addQuestionMethod() {
            dispatch(addQuestionAsync({surveyId: id, questionLabel: 'Untitled Question', questionType: 'SINGLE_SELECT', optionLabel: 'Untitled Option'}));
        }

        return <div className='md:my-1'>    
            <button className='md:py-[12px] md:ml-[8px] md:px-[257px] md:hover:border-2
                hover:bg-[#FF007F] hover:text-white 
                flex justify-between ml-1 py-2 px-[70px] gap-2 rounded-md border-black border-[1px]'
                onClick={addQuestionMethod}
            >
                <div className='md:pt-[px] pt-[3px] hover:text-black'>
                    <svg className="size-4 md:size-8" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                    </svg>
                </div>
                <span className='md:text-[25px] text-[15px] font-semibold'>
                    New Question
                </span>
            </button>
        </div>  
    }

    return <div className={`my-1 p-2 rounded-md ${bgColour}`}>
        <div>
            {questions.map((question) => {
                return <QuestionComponent key={question.id} question={question} bgColour={bgColour2}/>
            })
        }
        </div>
        <div>
            <AddQuestionComponent />
        </div>
    </div>
}

const FooterComponent = ({bgColour}) => {
    const { id: surveyId } = useSelector(state => state.survey.survey);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const deleteSurveyStateBackend = useDebouncedCallback(async (surveyId) => {
        await axios({
            url: `${backendUrl}/surveys/${surveyId}`,
            method: 'DELETE',
            headers: {
                'Authorization': localStorage.getItem('queriousToken'),
                'Content-Type': "application/json"
            }
        })
        localStorage.removeItem('survey');
        dispatch(deleteSurvey(surveyId));
        navigate('/dashboard');
    }, 0)

    const publishSurveyStateBackend = useDebouncedCallback((surveyId) => {
        axios({
            url: `${backendUrl}/surveys/publish/${surveyId}`,
            method: 'PUT',
            headers: {
                'Authorization': localStorage.getItem('queriousToken'),
                'Content-Type': "application/json"
            }
        })
        localStorage.removeItem('survey');
        dispatch(deleteSurvey(surveyId));
        navigate('/dashboard');
    }, 0)

    return <div className={`md:p-3 mt-2 p-2 rounded-md ${bgColour}`}>
        <div className={`flex justify-between`}>
            <button className={`md:text-[25px] md:border-2 md:py-4 md:px-24
                hover:bg-black hover:text-white
                font-semibold text-[16px] border-[1px] border-black py-3 px-[10px] rounded-md`}
                onClick={() => {deleteSurveyStateBackend(surveyId)}}
            >Delete Survey</button>

            <button className={`md:text-[25px] md:border-2 md:py-4 md:px-24
                hover:text-white hover:bg-black
                font-semibold text-[16px] border-[1px] border-black py-3 px-[10px] rounded-md`}
                onClick={() => {publishSurveyStateBackend(surveyId)}}
            >Publish Survey</button>
        </div>
    </div>
}