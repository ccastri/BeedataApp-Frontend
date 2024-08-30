import * as React from 'react';
import { styled } from '@mui/material/styles';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import Box from '@mui/material/Box';
import Checkbox from '@mui/material/Checkbox';
import Typography from '@mui/material/Typography';
import LabelIcon from '@mui/icons-material/Label';
import ChatIcon from '@mui/icons-material/Chat';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

const Demo = styled('div')(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(2),
}));

export default function ChatwootFileSystem() {
  const [selectedLabels, setSelectedLabels] = React.useState([]);

  const handleToggle = (label) => {
    setSelectedLabels((prev) =>
      prev.includes(label)
        ? prev.filter((item) => item !== label)
        : [...prev, label]
    );
  };

  return (
    <Box sx={{ flexGrow: 1, maxWidth: 400 }}>
      <Typography variant="h6" component="div" gutterBottom>
        Chatwoot File System
      </Typography>
      <Demo>
        <TreeView
          defaultCollapseIcon={<ExpandMoreIcon />}
          defaultExpandIcon={<ChevronRightIcon />}
          multiSelect
        >
          <TreeItem nodeId="1" label="Tags">
            <TreeItem nodeId="2" label="Important">
              <Checkbox
                checked={selectedLabels.includes('Important')}
                onChange={() => handleToggle('Important')}
              />
              <Typography variant="body2" component="span">
                Important
              </Typography>
            </TreeItem>
            <TreeItem nodeId="3" label="Urgent">
              <Checkbox
                checked={selectedLabels.includes('Urgent')}
                onChange={() => handleToggle('Urgent')}
              />
              <Typography variant="body2" component="span">
                Urgent
              </Typography>
            </TreeItem>
          </TreeItem>

          <TreeItem nodeId="4" label="Labels">
            <TreeItem nodeId="5" label="Sales">
              <Checkbox
                checked={selectedLabels.includes('Sales')}
                onChange={() => handleToggle('Sales')}
              />
              <Typography variant="body2" component="span">
                Sales
              </Typography>
            </TreeItem>
            <TreeItem nodeId="6" label="Support">
              <Checkbox
                checked={selectedLabels.includes('Support')}
                onChange={() => handleToggle('Support')}
              />
              <Typography variant="body2" component="span">
                Support
              </Typography>
            </TreeItem>
          </TreeItem>

          <TreeItem nodeId="7" label="Responses">
            <TreeItem nodeId="8" label="Greeting">
              <Checkbox
                checked={selectedLabels.includes('Greeting')}
                onChange={() => handleToggle('Greeting')}
              />
              <Typography variant="body2" component="span">
                Greeting
              </Typography>
            </TreeItem>
            <TreeItem nodeId="9" label="Follow Up">
              <Checkbox
                checked={selectedLabels.includes('Follow Up')}
                onChange={() => handleToggle('Follow Up')}
              />
              <Typography variant="body2" component="span">
                Follow Up
              </Typography>
            </TreeItem>
          </TreeItem>
        </TreeView>
      </Demo>
    </Box>
  );
}
