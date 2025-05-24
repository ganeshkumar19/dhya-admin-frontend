
import {
  Box,
  Heading,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import ConfigurationsSettings from '../components/dashboard/ConfigurationsSettings';
import SettingsProfile from '../components/dashboard/SettingsProfile';

const tabItems = [
  {
    label: 'Profile',
    component: <SettingsProfile/>,
  },
  {
    label: 'Configurations',
    component: <ConfigurationsSettings />, // Add your form/UI here
  },
];

const Settings = () => {
  return (
    <Box p={6}>
      <Heading mb={6} color="gray.600">
        Account Settings
      </Heading>

      <Tabs variant="enclosed" colorScheme="blue">
        <TabList
          borderBottom="2px solid"
          borderColor="gray.200"
          overflowX={{ base: 'auto', md: 'visible' }}
          whiteSpace="nowrap"
          sx={{
            scrollbarWidth: 'none', // Firefox
            '&::-webkit-scrollbar': { display: 'none' }, // Chrome, Safari
          }}
        >
          {tabItems.map((tab, index) => (
            <Tab
              key={index}
              flexShrink={0}
              _selected={{
                border: 0,
                borderBottom: '2px solid',
                borderColor: 'blue.500',
                color: 'blue.500',
              }}
            >
              {tab.label}
            </Tab>
          ))}
        </TabList>

        <TabPanels>
          {tabItems.map((tab, index) => (
            <TabPanel key={index}>{tab.component}</TabPanel>
          ))}
        </TabPanels>
      </Tabs>
    </Box>
  );
};

export default Settings;