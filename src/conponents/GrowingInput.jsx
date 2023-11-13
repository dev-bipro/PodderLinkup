import React from 'react'

const GrowingInput = ({value,onChange}) => {
    return (
        <input
            style={{ width: Math.min(Math.max(value.length, 2), 50) + 'ch' }}
            value={value}
            onChange={onChange}
            type="text"
        />
    );
}

export default GrowingInput