import React, {useContext, useState} from 'react';
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

  const [pageSize, setPageSize] = useState(10);
  
  return (
    <div id="tableContainer"
      style={{ 
      height: "590px",
      maxHeight: "60vh",
      width: "855px", 
      maxWidth: "96vw", 
      margin: "auto",
      backgroundColor: "rgb(228, 231, 231)"}}>
    
    <DataGrid
      rows={rows}
      columns={columns}
      pageSize={pageSize}
      onPageSizeChange={(newPageSize) => setPageSize(newPageSize)}
      rowsPerPageOptions={[5, 10, 20, 50, 100]}
      pagination
    />
  </div>
  );
}
