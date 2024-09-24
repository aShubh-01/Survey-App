import { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl } from '../../config';

export default function AnalyseComponent() {
    const [currentPage, setCurrentPage] = useState('Responses')
    const [isLoading, setIsLoading] = useState(true);
    const [responsesStatisticsData, setResponsesStatisticsData] = useState(null);

    useEffect(async () => {
        try {
            setIsLoading(true);
            const response = await axios({
                url: `${backendUrl}/submissions/responses/${localStorage.getItem('surveyId')}`,
                method: 'GET',
                headers: {
                    'Content-Type': "application/json",
                    'Authorization': localStorage.getItem('queriousToken')
                }
            })
            console.log(response.data)
            setResponsesStatisticsData(response.data);
            setIsLoading(false);
        } catch (err) {
            setIsLoading(true);
            alert('Unable to get responses')
        }
    }, [])

    return (
        <>
            
        </>
    )
}

const ResponsesComponent = () => {
    return <div>

    </div>
}

const StatisticsComponent = () => {
    return <div>
        
    </div>
}

const SettingsComponent = () => {
    return <div>
        
    </div>
}