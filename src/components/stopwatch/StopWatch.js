import React, { useState, useRef } from 'react';
import {GrPlay, GrResume, GrPause, GrStop} from "react-icons/gr"


const StopWatch = (props) => {
  const [timer, setTimer] = useState(0)
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const countRef = useRef(null)

  const formatTime = () => {
    const getSeconds = `0${(timer % 60)}`.slice(-2)
    const minutes = `${Math.floor(timer / 60)}`
    const getMinutes = `0${minutes % 60}`.slice(-2)
    const getHours = `0${Math.floor(timer / 3600)}`.slice(-2)
  
    return `${getHours} : ${getMinutes} : ${getSeconds}`
  } 

  const handleStart = () => {
    setIsActive(true)
    setIsPaused(true)
    props.setStartTime();

    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1)
    }, 1000)
  }

  const handlePause = () => {
    clearInterval(countRef.current)
    setIsPaused(false)
  }

  const handleResume = () => {
    setIsPaused(true)
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1)
    }, 1000)
  }

  const handleReset = () => {
    props.setStopTime()
    if(isActive || isPaused){
      props.showModal()
    }
    clearInterval(countRef.current)
    setIsActive(false)
    setIsPaused(false)
    setTimer(0)
  }

  return (
    <div className="stopwatch">
      <h5>Edzés indítása</h5>
      <div className='stopwatch-card'>
        <p>{formatTime(timer)}</p> {/* here we will show timer */}
        <div className='buttons'>
          {!isActive && !isPaused ? (
          <button onClick={handleStart}><GrPlay/></button> 
          ) : (
          isPaused ? (<button onClick={handlePause}><GrPause/></button>) :
          (<button onClick={handleResume}><GrResume/></button>)
          )}
          <button onClick={handleReset}><GrStop/></button>
        </div>
      </div>
    </div>
  );
}

export default StopWatch;