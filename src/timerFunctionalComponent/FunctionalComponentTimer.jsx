import React, { useEffect, useState } from 'react'
import "bootstrap/dist/css/bootstrap.min.css";
import "./FunctionalComponentTimer.css";
import startImg from "./images/ph_play-circle.svg";
import pauseImg from "./images/ph_pause-circle.svg";
import stopImg from "./images/ph_stop-circle.svg";
import timerImg from "./images/ph_timer.svg";
import speakerImg from "./images/ph_speaker-high.svg";
import speakerMuteImg from "./images/ph_speaker-none.svg";
import Timer from './Timer';

import timerAudio from './audios/stopwatch-ticking-mechanical-soundroll-6-6-00-09.mp3';
import stopTimerAudio from './audios/stopTimerAudio.mp3'

export default function FunctionalComponentTimer() {
    const [isOpen, setIsOpen] = useState(true);
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(25);
    const [seconds, setSeconds] = useState(0);
    const [timerInterval, setTimerInterval] = useState(null);
    const [isRunning, setIsRunning] = useState(false);
    const [isMusicOn, setIsMusicOn] = useState(false);
    const [timeHour, setTimeHour] = useState({
        hours: hours,
        minutes: minutes,
        seconds: seconds
    });
    const [isFinished, setIsFinished] = useState(false);
    const [isThemeDark, setIsThemeDark] = useState(true);
    const [finishedAt, setFinishedAt] = useState(null);

    const toggleTimer = () => {
        if (isRunning) {
            clearInterval(timerInterval);
            setIsRunning(false);
            return;
        }

        setIsRunning(!isRunning);
    };

    const resetTimer = () => {
        clearInterval(timerInterval);
        setIsRunning(false);
        setHours(timeHour.hours);
        setMinutes(timeHour.minutes);
        setSeconds(timeHour.seconds);
    }

    useEffect(() => {
        if (!isRunning) return;

        const interval = setInterval(() => {
            setSeconds((prevSeconds) => {
                if (prevSeconds > 0) {
                    return prevSeconds - 1;
                } else if (minutes > 0) {
                    setMinutes((prevMinutes) => prevMinutes - 1);
                    return 59;
                } else if (hours > 0) {
                    setHours((prevHours) => prevHours - 1);
                    setMinutes(59);
                    return 59;
                } else {
                    setIsFinished(true);
                    setFinishedAt(new Date());
                    setTimeout(() => {
                        setIsFinished(false);
                    }, 3000);
                    clearInterval(interval);
                    setIsRunning(false);
                    return 0;
                }
            });
        }, 10);

        setTimerInterval(interval);

        return () => {
            clearInterval(interval);
        };
    }, [isRunning, seconds, minutes, hours]);

    function changeTimerState(cHours, cMinutes, cSeconds) {
        setHours(cHours);
        setMinutes(cMinutes);
        setSeconds(cSeconds);
        setIsOpen(false);

        setIsFinished(false);

        setTimeHour({
            hours: cHours,
            minutes: cMinutes,
            seconds: cSeconds
        });
    }

    function timeFormat(time) {
        return time < 10 ? `0${time}` : time;
    }

    let darkTextClass = ''
    darkTextClass += isFinished ? 'timer-text timer-animation' : "timer-text"
    darkTextClass += isThemeDark ? ' text-white' : ' text-dark'
    return (
        <>
            <Timer isOpen={isOpen} hours={hours} minutes={minutes} seconds={seconds} changeTimerState={changeTimerState}></Timer>
            <div className="timer-container" style={isThemeDark ? { backgroundColor: '#000' } : { backgroundColor: '#fff' }}>
                <div className="container pt-3">
                    <div className="d-flex justify-content-end align-items-center">
                        {isThemeDark ? (
                            <i onClick={() => setIsThemeDark(!isThemeDark)} id='timer-sun' class="bi bi-brightness-high"></i>
                        ) : (
                            <i onClick={() => setIsThemeDark(!isThemeDark)} id='timer-moon' class="bi bi-moon"></i>
                        )
                        }
                    </div>
                    {
                        isRunning && <audio id='timer-audio' muted={isMusicOn} src={timerAudio} loop={true} autoPlay={true}></audio>
                    }
                    {
                        isFinished && <audio id='timer-audio' muted={isMusicOn} src={stopTimerAudio} autoPlay={true}></audio>
                    }
                    <section id='functional-timer-wrapper' className='w-100'>
                        <div>
                            <h1 className={darkTextClass}>{timeFormat(hours)}:{timeFormat(minutes)}:<span id='timer-seconds'>{timeFormat(seconds)}</span></h1>
                        </div>
                        <div id='timer-buttons-wrapper' className='d-flex justify-content-center'>
                            <button onClick={toggleTimer} className='btn timer-btn'><img src={isRunning ? pauseImg : startImg} alt="play" /></button>
                            <button onClick={() => {
                                if (!isRunning) {
                                    setIsOpen(!isOpen)
                                    return;
                                } else {
                                    resetTimer();
                                    return
                                }
                            }} className='btn timer-btn'><img src={isRunning ? stopImg : timerImg} alt={isRunning ? "Pause" : "Timer"} /></button>
                            <button onClick={() => setIsMusicOn(!isMusicOn)} className='btn timer-btn'><img src={isMusicOn ? speakerMuteImg : speakerImg} alt="play" /></button>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}