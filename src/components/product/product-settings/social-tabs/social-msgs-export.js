import React from 'react';
import Button from '@mui/material/Button';
import { Parser } from 'json2csv';

export const ExportButton = ({ messages }) => {
    const handleExport = () => {
        const fields = [
            { label: 'ID', value: '_id' },
            { label: 'Message', value: 'msg' },
            { label: 'User Name', value: 'alias' },
            { label: 'Timestamp', value: 'ts' },
            { label: 'User ID', value: 'u._id' },
            { label: 'User Type', value: 'u.username' },
        ];
        const json2csvParser = new Parser({ fields });

        messages.forEach(message => {
            const csvData = message.data.total;
            const csv = json2csvParser.parse(csvData);

            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `${message.departmentId}.csv`;
            link.click();
        });
    };

    return (
        <Button
            autoFocus
            variant="outlined"
            sx={{ ml: 1, mr: 2, mb: 2, boxShadow: '0px 2px 5px rgba(0, 0, 0, 0.35)' }}
            onClick={handleExport}
        >
            Export to CSV
        </Button>
    );
};