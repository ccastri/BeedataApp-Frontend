import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Paper } from '@mui/material';

const PartnershipRequests = () => {
  const [newRequest, setNewRequest] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendRequest = () => {
    if (newRequest.trim() === '') return;

    setLoading(true);

    // Simulación de agregar la solicitud localmente
    const newRequestData = {
      id: requests.length + 1,
      message: newRequest,
      createdAt: new Date(),
    };

    setRequests([...requests, newRequestData]);
    setNewRequest('');
    setLoading(false);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" sx={{ mb: 3 }}>
        Solicitudes de Partnership
      </Typography>

      <Paper sx={{ p: 2, mb: 3 }}>
        <Typography variant="h6">Enviar una nueva solicitud</Typography>
        <TextField
          fullWidth
          label="Mensaje de la solicitud"
          variant="outlined"
          value={newRequest}
          onChange={(e) => setNewRequest(e.target.value)}
          sx={{ my: 2 }}
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSendRequest}
          disabled={loading}
        >
          {loading ? 'Enviando...' : 'Enviar solicitud'}
        </Button>
      </Paper>

      <Paper sx={{ p: 2 }}>
        <Typography variant="h6">Solicitudes recibidas</Typography>
        {requests.length > 0 ? (
          requests.map((request) => (
            <Box key={request.id} sx={{ mb: 2, p: 2, border: '1px solid #ddd' }}>
              <Typography variant="body1">
                <strong>ID:</strong> {request.id}
              </Typography>
              <Typography variant="body1">
                <strong>Mensaje:</strong> {request.message}
              </Typography>
              <Typography variant="body1">
                <strong>Fecha:</strong> {new Date(request.createdAt).toLocaleString()}
              </Typography>
            </Box>
          ))
        ) : (
          <Typography>No hay solicitudes de partnership recibidas.</Typography>
        )}
      </Paper>
    </Box>
  );
};

export default PartnershipRequests;
