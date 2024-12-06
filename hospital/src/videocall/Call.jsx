import React, { useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import "./Call.css";

const Call = () => {
    const [value, setValue] = useState("");
    const navigateTo = useNavigate();

    const handleJoinMeeting = () => {
        navigateTo(`/room/${value}`);
    };

    return (
        <>
            <div className='calback'>
                <h1>Join Meeting</h1>
                <div>
                    <input 
                        type='text' 
                        placeholder='meeting' 
                        value={value} 
                        onChange={(e) => setValue(e.target.value)} 
                    />
                    <button 
                        disabled={!value} 
                        onClick={handleJoinMeeting}
                    >
                        Join Meeting
                    </button>
                </div>
            </div>
        </>
    );
}

export default Call;
