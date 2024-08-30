
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
import { FbSignupFlow2 } from '../product/product-settings/whatsapp-tabs/fb-signup-flow2';
import { FbSignupFlow } from '../product/product-settings/whatsapp-tabs/fb-signup-flow';
import { useRouter } from 'next/router';
import { getUserCompanyId } from '../../utils/get-user-data';
import ShopifyCredentials from '../integrations/FetchCredentials';
import { fetchShopifyCredentialsFromBackend } from '../../utils/get-shopify-credentials';
import api from '../../lib/axios';

const companyId = getUserCompanyId();

const steps = [
  {
    label: 'Which option describes your business the most',
    description: ""
    // `You can decide the best platform for you to handle your contacts and interactions. We suggest you
    // to try Beet as you might get the best advantages of the platform and its integrations`,
  },
  {
    label: 'Connect your WhatsApp Business Acount',
    description: `Connect your WhatsApp Business account to interact directly with your customers from a unified platform.
              Leverage the integration to send automated messages, respond to queries in real-time, and manage all your
              conversations from a single place.`,
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
  { label: 'Beet', value: 'Beet Social' },
  { label: 'Salesforce', value: 'salesforce' },
  { label: 'Hubspot', value: 'hubspot' },
  { label: 'Odoo', value: 'Odoo' },
  { label: 'Custom', value: 'custom' },
];
const leadManagerOptions = [
  { label: 'Beet', value: 'Beet' },
  { label: 'Salesforce', value: 'Salesforce' },
  { label: 'Hubspot', value: 'Hubspot' },
  { label: 'PipeDrive', value: 'PipeDrive' },
];
const productManagerOptions = [
  // { label: 'WooCommerce', value: 'WooCommerce' },
  { label: 'Shopify', value: 'Shopify' },
  { label: 'Beet', value: 'Beet' },
  { label: 'Vtex', value: 'Vtex' },
];
const paymentMethod = [
  // { label: 'WooCommerce', value: 'WooCommerce' },
  { label: 'Wompi', value: 'Wompi' },
  { label: 'Custom', value: 'Personalizado' },
  { label: 'Addi', value: 'Addi' },
  { label: 'Contraentrega', value: 'Contraentrega' },
  { label: 'Mercado Pago', value: 'Mercado Pago' },
];

// Default selected option
const defaultValue = 'ecommerce';
const disabledOptions = defaultValue === 'ecommerce' ? ['custom', "service provider and lead attention"] : [];
// Default selected option
const defaultValueContacts = 'Beet Social';
const disabledOptionsContacts = defaultValueContacts === 'beet' ? ['salesforce', "Odoo", "custom", "hubspot"] : [];
// Default selected option
const defaultValueLeads = 'Beet';
const disabledOptionsLeads = defaultValueLeads === 'beet' ? ['salesforce', "hubspot", "pipedrive", "hubspot"] : [];

const defaultValueProducts = 'Shopify';
const disabledOptionsProducts = defaultValueProducts ===  'shopify' ? ["vtex", 'beet'] : [];

const defaultValuePayment = 'Wompi';
// const disabledOptionsPayment = defaultValuePayment === 'wompi'  ? ["mercado pago", "pse", "custom"] : [];

export default function VerticalLinearStepper({storeData, onCredentialsFetched}) {
  const [activeStep, setActiveStep] = React.useState(0);
  const [selectedValues, setSelectedValues] = React.useState({
    firstStepOption: defaultValue,
    contacts: defaultValueContacts,
    leads: defaultValueLeads,
    orders: defaultValueProducts,
    PaymentOptions: defaultValuePayment
  });
  const router = useRouter();

 /*****************************************
 *          TRIAL phone_id                *
 *          293998910459231               *
 *****************************************/

 const handleNext = async () => {
  let updatedSelectedValues = selectedValues;
    // If on the first step, set phone_id
    if (activeStep === 0) {
      const phone_id = '102291556123841';
      updatedSelectedValues = {
        ...selectedValues,
        phone_id,
      };
      setSelectedValues(updatedSelectedValues);
    }
  const newStep = activeStep + 1;

  if (newStep === steps.length) {
    const company_id = getUserCompanyId();
    const combinedData = {
      ...updatedSelectedValues,
      company_id
    };

    // Create a copy of combinedData and remove the firstStepOption
    const { firstStepOption, ...dataToSend } = combinedData;

    console.log('Final combined values excluding firstStepOption:', dataToSend);

    try {
      // Send data to the backend endpoint
      await api.post('/api/v1/app', dataToSend);
      console.log('Data successfully sent to backend');
      // Handle success (e.g., redirect or show a success message)
    } catch (error) {
      console.error('Error sending data to backend:', error);
      // Handle error (e.g., show an error message)
    }
  }

  // Update the active step
  setActiveStep(newStep);
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


  const handleButtonClick = () => {
    router.push('/home?scrollTo=targetElement');
  };


  return (
    <Box sx={{ width: '100%', maxWidth: 600, margin: 'auto' }}>
      <Stepper
      activeStep={activeStep}
      orientation="vertical">
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
                {index === 0 && (
                  <SingleSelectForm
                    options={firstStepOptions}
                    defaultValue={defaultValue}
                    disabledOptions={disabledOptions}
                    value={selectedValues.firstStepOption}
                    onValueChange={(value) => handleValueChange('firstStepOption', value)}
                  />
                  )}
            <StepContent>
              <Typography>{step.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <div>
                {index === 1 && (
                  <FbSignupFlow title="Add phone number"
                  onNext={handleNext}
                  />

                  )}
                {index === 2 && (
                    <SingleSelectForm
                      options={contactManagerOptions}
                      defaultValue={defaultValueContacts}
                      disabledOptions={disabledOptionsContacts}
                      text='Please Select the preferred platform for you to handle your customers'
                      value={selectedValues.contacts}
                      onValueChange={(value) => handleValueChange('contacts', value)}
                    />
                  )}

                  {index === 3 && (
                    <SingleSelectForm
                      options={leadManagerOptions}
                      defaultValue={defaultValueLeads}
                      disabledOptions={disabledOptionsLeads}
                      text='Leads management can help you classify and track interested prospects. A good manager will allow you to automate follow-ups, analyze campaign performance, and maximize your sales opportunities.'
                      value={selectedValues.leads}
                      onValueChange={(value) => handleValueChange('leads', value)}
                    />
                  )}
                  {index === 4 && (
                    <ShopifyCredentials onCredentialsFetched={() => fetchShopifyCredentialsFromBackend(companyId)}/>

                  )}
                  {index === 5 && (
                    <SingleSelectForm
                      options={paymentMethod}
                      defaultValue={defaultValuePayment}
                      // disabledOptions={disabledOptionsPayment}
                      text="We're working hard to give you flexibility so you can pick the best payment channel and integrate it smoothly"
                      value={selectedValues.PaymentOptions}
                      onValueChange={(value) => handleValueChange('PaymentOptions', value)}
                    />
                  )}
 {/* {index !== 0 && ( // Only render the button if index is not 0 */}
                  <Button
                    variant="contained"
                    onClick={handleNext}
                    sx={{ mt: 1, mr: 1 }}
                  >
                    {index === steps.length - 1 ? 'Finish' : 'Continue'}
                  </Button>
                {/* )} */}
                {index > 0 && (
                  <Button
                  disabled={index === 0}
                  onClick={handleBack}
                  sx={{ mt: 1, mr: 1, backgroundColor: 'info.main'  }}
                  >
                    Back
                  </Button>
                  )}
                </div>
              </Box>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square
        elevation={0}
        sx={{ my:6, p: 3 }}
        >
          <Typography>All steps completed - Now you can either go to the Beet Tools section to start gathering the tools your business requires to level it up or go to the home section to start customizing your agents, messages and more</Typography>
          <Button onClick={handleButtonClick}
          sx={{ mt: 1, mr: 1, backgroundColor: 'info.main' }}>
            Customize
          </Button>
          <Button onClick={()=> router.push("/products")}
          sx={{ mt: 1, mr: 1, backgroundColor: 'info.main' }}>
            Check Beet Tools
          </Button>
        </Paper>
      )}
    </Box>
  );
}
