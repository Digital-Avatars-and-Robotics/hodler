import React, {useContext} from 'react';
import { Context } from '../helper/Store'

import { DataGrid } from '@mui/x-data-grid';

const columns = [
  { field: 'id', headerName: 'Wallet\u00a0Address', width: 400},
  { field: 'points', headerName: 'Points', width: 150},
  { field: 'tokenVolumeCount', headerName: 'Token\u00a0Volume\u00a0Count', width: 150},
  { field: 'hotStreak', headerName: 'Hot\u00a0Streak', width: 150},
];

export function createData(id, points, tokenVolumeCount, hotStreak) {
  return { id, points, tokenVolumeCount, hotStreak };
}

export default function StickyHeadTable() {
  const [state] = useContext(Context);  
  const rows = state.hodlers;
  return (
    <div style={{ 
      height: "579px",
      maxHeight: "65vh",
      width: "855px", 
      maxWidth: "96vw", 
      margin: "auto",
      backgroundColor: "rgb(228, 231, 231)"}}>
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={9}
      rowsPerPageOptions={[9]}
    />
  </div>
  );
}
