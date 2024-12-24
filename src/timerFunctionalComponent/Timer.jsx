import React, { useEffect, useState } from 'react';
import './Timer.css';
import { Modal, Button } from 'react-bootstrap';

function Timer(props) {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);
    const [seconds, setSeconds] = useState(0);

    const [showModal, setShowModal] = useState(true);

    useEffect(() => {
        setShowModal(props.isOpen);
        setHours(props.hours);
        setMinutes(props.minutes);
        setSeconds(props.seconds);
    }, [props.isOpen, props.hours, props.minutes, props.seconds]);

    function handleCloseModal() {
        props.changeTimerState(hours, minutes, seconds);
        setShowModal(false);
    }
    
    const increment = (setter, value, max) => {
        setter((prev) => (prev + 1) % (max + 1));
    };

    const decrement = (setter, value, max) => {
        setter((prev) => (prev - 1 + (max + 1)) % (max + 1));
    };

    const getPrevious = (value, max) => (value - 1 + (max + 1)) % (max + 1);
    const getNext = (value, max) => (value + 1) % (max + 1);

    return (
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Todo Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="timer">
                    {['Hours', 'Minutes', 'Seconds'].map((label, index) => {
                        const value = index === 0 ? hours : index === 1 ? minutes : seconds;
                        const setter = index === 0 ? setHours : index === 1 ? setMinutes : setSeconds;
                        const max = index === 0 ? 23 : 59;

                        return (
                            <div className="timer-section" key={label}>
                                <button onClick={() => increment(setter, value, max)}>▲</button>
                                <div className="timer-view">
                                    <div className="timer-preview">{String(getPrevious(value, max)).padStart(2, '0')}</div>
                                    <div className="timer-current">{String(value).padStart(2, '0')}</div>
                                    <div className="timer-next">{String(getNext(value, max)).padStart(2, '0')}</div>
                                </div>
                                <button onClick={() => decrement(setter, value, max)}>▼</button>
                            </div>
                        );
                    })}
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default Timer;