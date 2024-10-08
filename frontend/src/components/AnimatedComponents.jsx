import lottie from 'lottie-web';
import { useEffect, useRef } from 'react';
import LoadAuthAnimation from '../assets/animations/Animation - 1722663753436.json';
import PlusLoadingAnimation from '../assets/animations/PlusLoading.json';
import TripleDotLoadingAnimation from '../assets/animations/TripleDotLoading.json';
import HourGlassLoadingAnimation from '../assets/animations/HourGlassLoading.json';
import SubmitLoadingAnimation from '../assets/animations/SubmitLoading.json';
import LineLoadingAnimation from '../assets/animations/LineLoading.json'
import NewSurveyLoadingAnimation from '../assets/animations/NewSurveyLoading.json'
import AnalyseSurveyLoadingAnimation from '../assets/animations/AnalyseSurveyLoading.json';

const LoadAnimation = ({animationData}) => {
    const container = useRef(null);
    useEffect(() => {
        if(container.current){
            lottie.loadAnimation({
                container: container.current,
                renderer: 'svg',
                loop: true,
                autoplay: true,
                animationData: animationData
            });
        }
    }, []);

    return <div ref={container} />
}

export const LoadAuth = () => {
    return <LoadAnimation animationData={LoadAuthAnimation} />
}

export const PlusLoading = () => {
    return <LoadAnimation animationData={PlusLoadingAnimation} />
}

export const TripleDotLoading = () => {
    return <LoadAnimation animationData={TripleDotLoadingAnimation} />
}

export const HourGlassLoading = () => {
    return <LoadAnimation animationData={HourGlassLoadingAnimation} />
}

export const SubmitLoading = () => {
    return <LoadAnimation animationData={SubmitLoadingAnimation} />
}

export const LineLoading = () => {
    return <LoadAnimation animationData={LineLoadingAnimation} />
}

export const NewSurveyLoading = () => {
    return <LoadAnimation animationData={NewSurveyLoadingAnimation} />
}

export const AnalyseSurveyLoading = () => {
    return <LoadAnimation animationData={AnalyseSurveyLoadingAnimation} />
}