import React from 'react';

const Filler = ({ percentage }) => {
    return <div className="filler" style={{ width: `${percentage}%`}}></div>
};

export default Filler;