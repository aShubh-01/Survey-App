import { useEffect, useState } from 'react';
import { backendUrl } from '../../config' 
import axios from 'axios';

export const useGetAnalysisData = (surveyId) => {
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
            setAnalysisData(res.data);
            setIsLoading(false);
        }).catch((err) => {
            setIsLoading(true);
            alert('Unable to get responses')
        })
            
    }, [])

    return {isLoading, analysisData}
}