import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { setIsClosed } from '../features/analyseSurvey';
import { backendUrl } from '../../config' 
import axios from 'axios';

export default function useGetAnalysisData (surveyId) {
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(true);
    const [analysisData, setAnalysisData] = useState();

    useEffect(() => {
        axios({
            url: `${backendUrl}/submissions/responses/${surveyId}`,
            method: 'GET',
                headers: {
                'Content-Type': "application/json",
                'Authorization': localStorage.getItem('queriousToken')
            }
        }).then((res) => {
            const isClosed = res.data.surveyInfo.isClosed;
            setAnalysisData(res.data);
            dispatch(setIsClosed({isClosed: isClosed}))
            setIsLoading(false);
        }).catch((err) => {
            setIsLoading(true);
            alert('Unable to get responses')
        })
            
    }, [])

    return {isLoading, analysisData}
}