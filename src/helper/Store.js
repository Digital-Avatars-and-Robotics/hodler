import React, {useState} from 'react';
import { createData } from '../components/Leaderboard'

const initialState = {
    startDate: new Date(2015,6,30),
    endDate: Date(),
    contractAddress: '',
    hodlers: [
        createData('0x9D53eDc9d94722Bde4a29631B3c2b7F438fd9cE0', 'IN', 1324171354, 3287263),
        createData('China', 'CN', 1403500365, 9596961),
        createData('Italy', 'IT', 60483973, 301340),
        createData('United States', 'US', 327167434, 9833520),
        createData('Canada', 'CA', 37602103, 9984670),
        createData('Australia', 'AU', 25475400, 7692024),
        createData('Germany', 'DE', 83019200, 357578),
        createData('Ireland', 'IE', 4857000, 70273),
        createData('Mexico', 'MX', 126577691, 1972550),
        createData('Japan', 'JP', 126317000, 377973),
        createData('France', 'FR', 67022000, 640679),
        createData('United Kingdom', 'GB', 67545757, 242495),
        createData('Russia', 'RU', 146793744, 17098246),
        createData('Nigeria', 'NG', 200962417, 923768),
        createData('Brazil', 'BR', 210147125, 8515767),
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