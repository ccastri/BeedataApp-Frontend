import React from 'react';
import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

const data = [
  { agent: 'Agent 1', conversations: '50%' },
  { agent: 'Agent 2', conversations: '30%' },
  { agent: 'Agent 3', conversations: '20%' },
];

export const MetricsTable = () => {
  return (
    <Box sx={{ mt: 4, ml: 14, mr: 20}}>
      <TableContainer sx={{ background: '#FFFFFF' }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Agents</TableCell>
              <TableCell>% Conversations</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data.map((row) => (
              <TableRow key={row.agent}>
                <TableCell component="th" scope="row">
                  {row.agent}
                </TableCell>
                <TableCell>{row.conversations}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};
