import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../../config';

export const useGetSurvey = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [surveys, setSurveys] = useState({});

    useEffect(() => {
        axios({
            url: `${backendUrl}/surveys/all`,
            method: 'GET',
            headers: {
                'Content-Type': "application/json",
                'Authorization': localStorage.getItem('token')
            }

        }).then((response) => {
            const allSurveys = response.data.allSurveys;
            const publishedSurveys = allSurveys.filter((survey) => survey.isPublished)
            const unpublishedSurveys = allSurveys.filter((survey) => !survey.isPublished)
            setSurveys({publishedSurveys, unpublishedSurveys});
            setIsLoading(false);
        });
    }, []);

    return { 
        isLoading,
        surveys
    }
}