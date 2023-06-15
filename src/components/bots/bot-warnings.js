import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';

export const BotWarnings = (props) => (
    <Box {...props}>
        <Box
            sx={{
                alignItems: 'center',
                display: 'flex',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                m: -1
            }}
        >
            <Typography
                sx={{ m: 1 }}
                variant="h4"
            >
                Bots
            </Typography>
        </Box>
        <Box sx={{ mt: 3 }}>
            <Card>
                <CardContent>
                    <Box>
                        <Stack sx={{ width: '100%' }}
                            spacing={2}>
                            <Alert severity="info">
                                In order to activate any of the bots, please make sure that the Beet Bot
                                and Beet Social products are both active in <Link href="/products">products</Link> section.
                            </Alert>
                        </Stack>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    </Box>
);
