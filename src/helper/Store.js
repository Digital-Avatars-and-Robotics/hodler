import React, {useState} from 'react';
import { createData } from '../components/Leaderboard'

const initialState = {
    startDate: new Date(2015,6,30),
    endDate: Date(),
    contractAddress: '0x1Eb7382976077f92cf25c27CC3b900a274FD0012',
    hodlers: [
    ],
    toggleButton: false
};

export const Context = React.createContext();

const Store = ({ children }) => {
    const [state, setState] = useState(initialState);
    return (
        <Context.Provider value={[state, setState]}>{children}</Context.Provider>
    );
}


export default Store;