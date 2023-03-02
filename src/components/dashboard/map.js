import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { Box, Card, CardHeader } from '@mui/material';
import React, { useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import storesGeoJSON from '../tmp/stores.json';
import 'leaflet/dist/leaflet.css';
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 20;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 200,
    },
  },
};

const cityNames = [
  'All',
  'Barranquilla',
  'Bogotá',
  'Cali',
  'Medellín',
];

const Map = () => {

  const theme = useTheme();
  const position = [6.251840, -75.563590];
  const [city, setCity] = useState('');
  const [map, setMap] = useState(null);

  const handleChange = (event) => {
    if (event.target.value === 'All') {
        setCity('');
    } else {
        setCity(event.target.value);
    }
  };

  const getStyles = (selectedCity, cityNames, theme) => {
    if (selectedCity === '') {
        return {};
    }
    return {
        fontWeight:
            cityNames.indexOf(selectedCity) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium,
    };
  }

   return (
    <Card>
      <CardHeader
        title="Stores Map"
        action={
          <FormControl sx={{ width: 200 }}>
            <InputLabel id="city-select-label">City</InputLabel>
            <Select
              labelId="city-select-label"
              id="city-select"
              value={city}
              onChange={handleChange}
              input={<OutlinedInput labelwidth={80}/>}
              MenuProps={MenuProps}
            >
              {cityNames.map((city, index) => (
                <MenuItem
                  key={index}
                  value={city}
                  style={getStyles(city, cityNames, theme)}
                >
                  {city}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        }
      />
      <Box sx={{height: "50vh", width: "100%"}}>
        <MapContainer center={position} zoom={12} scrollWheelZoom={false} style={{ height: "400px", width: "100%" }} whenCreated={setMap}>
          <TileLayer attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors' url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {storesGeoJSON.features.map((store, index) => (
              <Marker
                key={index}
                position={[store.geometry.coordinates[1], store.geometry.coordinates[0]]}
              />
            ))}
        </MapContainer>
      </Box>
    </Card>
   );
}

export default Map;

