
import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';
import StepContent from '@mui/material/StepContent';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import SingleSelectForm from './multichoice-form';

const steps = [
  {
    label: 'Which option describes your business the most',
    description: ""
    // `You can decide the best platform for you to handle your contacts and interactions. We suggest you
    // to try Beet as you might get the best advantages of the platform and its integrations`,
  },
  {
    label: 'Select contact Mannager',
    description: ""
    // `You can decide the best platform for you to handle your contacts and interactions. We suggest you
    // to try Beet as you might get the best advantages of the platform and its integrations`,
  },
  {
    label: 'Pick Leads Mannager',
    description: ""
    // `Select a leads manager to help you classify and track interested prospects. 
    //             Our manager will allow you to automate follow-ups, analyze campaign performance, 
    //             and maximize your sales opportunities.`,
  },
  {
    label: 'Choose Product Mannager',
    description: ``,
  },
  {
    label: 'Select a Payment Method ',
    description: ``,
  },
  {
    label: 'Connect your WhatsApp Business Acount',
    description: `Connect your WhatsApp Business account to interact directly with your customers from a unified platform.
              Leverage the integration to send automated messages, respond to queries in real-time, and manage all your 
              conversations from a single place.`,
  },
  {
    label: 'Customize Your Chatbot',
    description: `Customize your chatbot to provide a unique user experience. Configure automatic responses, 
              create conversation flows tailored to your needs, and enhance customer interaction. A well-designed chatbot 
              can improve your customer support efficiency and provide quick and accurate responses.`,
  },
];
const firstStepOptions = [
  { label: 'Service Provider and Lead Attention', value: 'service provider and lead attention' },
  { label: 'E-commerce', value: 'ecommerce' },
  { label: 'Custom', value: 'custom' },
];

const contactManagerOptions = [
  { label: 'Beet', value: 'beet' },
  { label: 'Salesforce', value: 'salesforce' },
  { label: 'Hubspot', value: 'hubspot' },
  { label: 'Odoo', value: 'Odoo' },
  { label: 'Custom', value: 'custom' },
];
const leadManagerOptions = [
  { label: 'Beet', value: 'beet' },
  { label: 'Salesforce', value: 'salesforce' },
  { label: 'Hubspot', value: 'hubspot' },
  { label: 'PipeDrive', value: 'pipedrive' },
];
const productManagerOptions = [
  // { label: 'WooCommerce', value: 'WooCommerce' },
  { label: 'Shopify', value: 'shopify' },
  { label: 'Beet', value: 'beet' },
  { label: 'Vtex', value: 'vtex' },
];
const paymentMethod = [
  // { label: 'WooCommerce', value: 'WooCommerce' },
  { label: 'Wompi', value: 'wompi' },
  { label: 'Custom', value: 'custom' },
  { label: 'PSE', value: 'pse' },
  { label: 'Mercado Pago', value: 'mercado pago' },
];

// Default selected option
const defaultValue = 'ecommerce';
const disabledOptions = defaultValue === 'ecommerce' ? ['custom', "service provider and lead attention"] : [];
// Default selected option
const defaultValueContacts = 'beet';
const disabledOptionsContacts = defaultValueContacts === 'beet' ? ['salesforce', "Odoo", "custom", "hubspot"] : [];
// Default selected option
const defaultValueLeads = 'beet';
const disabledOptionsLeads = defaultValueLeads === 'beet' ? ['salesforce', "hubspot", "pipedrive", "hubspot"] : [];

const defaultValueProducts = 'shopify';
const disabledOptionsProducts = defaultValueProducts === 'beet' || 'shopify' ? ["vtex"] : [];

const defaultValuePayment = 'wompi';
// const disabledOptionsPayment = defaultValuePayment === 'wompi'  ? ["mercado pago", "pse", "custom"] : [];

export default function VerticalLinearStepper({storeData}) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedValues, setSelectedValues] = React.useState({
    firstStepOption: defaultValue,
    contactManager: defaultValueContacts,
    leadManager: defaultValueLeads,
    productManager: defaultValueProducts,
    paymentMethod: defaultValuePayment
  });
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
    if (activeStep === steps.length - 1) {
      const companyId = Number(sessionStorage.getItem('companyId'));
      const combinedData = { ...selectedValues, ...storeData, companyId };
      console.log('Final combined values:', combinedData);
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };
  const handleValueChange = (step, value) => {
    setSelectedValues((prevValues) => ({
      ...prevValues,
      [step]: value,
    }));
    console.log(selectedValues)
    
  };
  const handleConnectWhatsApp = () => {
    // Handle the WhatsApp connection logic here
    console.log('Connecting to WhatsApp...');
  };

  
  return (
    <Box sx={{ maxWidth: 400 }}>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((step, index) => (
          <Step key={step.label}>
            <StepLabel
              optional={
                index === 5 ? (
                  <Typography variant="caption">Last step (for now)</Typography>
                ) : null
              }
            >
              {step.label}
            </StepLabel>
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                {index === 0 && (
                    <SingleSelectForm
                      options={firstStepOptions}
                      defaultValue={defaultValue}
                      disabledOptions={disabledOptions}
                      value={selectedValues.firstStepOption}
                      onValueChange={(value) => handleValueChange('firstStepOption', value)}
                    />
                  )}
                {index === 1 && (
                    <SingleSelectForm
                      options={contactManagerOptions}
                      defaultValue={defaultValueContacts}
                      disabledOptions={disabledOptionsContacts}
                      text='Please Select the preferred platform for you to handle your customers'
                      value={selectedValues.contactManager}
                      onValueChange={(value) => handleValueChange('contactManager', value)}
                    />
                  )}
                  {index === 2 && (
                    <SingleSelectForm
                      options={leadManagerOptions}
                      defaultValue={defaultValueLeads}
                      disabledOptions={disabledOptionsLeads}
                      text='Leads management can help you classify and track interested prospects. A good manager will allow you to automate follow-ups, analyze campaign performance, and maximize your sales opportunities.'
                      value={selectedValues.leadManager}
                      onValueChange={(value) => handleValueChange('leadManager', value)}
                    />
                  )}
                  {index === 3 && (
                    <SingleSelectForm
                      options={productManagerOptions}
                      defaultValue={defaultValueProducts}
                      disabledOptions={disabledOptionsProducts}
                      text='Find a product manager that allows you to efficiently handle your inventory and track sales. With the right manager, you can optimize product presentation, analyze customer behavior, and enhance your pricing strategy.'
                      value={selectedValues.productManager}
                      onValueChange={(value) => handleValueChange('productManager', value)}
                    />
                  )}
                  {index === 4 && (
                    <SingleSelectForm
                      options={paymentMethod}
                      defaultValue={defaultValuePayment}
                      // disabledOptions={disabledOptionsPayment}
                      text="We're working hard to give you flexibility so you can pick the best payment channel and integrate it smoothly"
                      value={selectedValues.paymentMethod}
                      onValueChange={(value) => handleValueChange('paymentMethod', value)}
                    />
                  )}
                {index === 5 && (
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleConnectWhatsApp}
                      sx={{ mt: 1, mr: 1 }}
                    >
                      Connect to WhatsApp
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                  <Button
                    disabled={index === 0}
                    onClick={handleBack}
                    sx={{ mt: 1, mr: 1, backgroundColor: 'info.main'  }}
                  >
                    Back
                  </Button>
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0} sx={{ my:6, p: 3 }}>
          <Typography>All steps completed - youcan either go back to sopify or try your chatbot in WhatsApp</Typography>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1, backgroundColor: 'info.main' }}>
            Go Back
          </Button>
          <Button onClick={handleReset} sx={{ mt: 1, mr: 1, backgroundColor: 'info.main' }}>
            Try Now!
          </Button>
        </Paper>
      )}
    </Box>
  );
}
