import React, {useState} from 'react';
import { createData } from '../components/Leaderboard'

const initialState = {
    startDate: new Date(2015,6,30),
    endDate: Date(),
    contractAddress: '0x00b784c0e9dd20fc865f89d05d0ce4417efb77a9',
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