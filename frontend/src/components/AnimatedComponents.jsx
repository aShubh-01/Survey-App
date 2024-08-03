import lottie from 'lottie-web';
import { useEffect, useRef } from 'react';
import LoadAuthAnimation from '../assets/animations/Animation - 1722663753436.json';

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