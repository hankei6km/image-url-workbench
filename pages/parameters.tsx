import React from 'react';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FragmentImageTag from '../components/FragmentImageTag';
import FragmentCard from '../components/FragmentCard';
import FragmentDownload from '../components/FragmentDownload';
import FragmentMake from '../components/FragmentMake';
import FragmentLinks from '../components/FragmentLinks';
import FragmentParams from '../components/FragmentParams';

export function ParametersPanel({
  groupName,
  defaultExpanded = false,
  children
}: {
  groupName: string;
  defaultExpanded?: boolean;
  children: React.ReactNode;
}) {
  return (
    <Box my={1}>
      <Accordion elevation={0} defaultExpanded={defaultExpanded}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls={`parameters panel : ${groupName}`}
          id={`group-${groupName}`}
          IconButtonProps={{ edge: 'end' }}
        >
          <Box p={1}>
            <Typography variant="h6">{groupName}</Typography>
          </Box>
        </AccordionSummary>
        <AccordionDetails style={{ padding: 0 }}>
          <Box pl={1} width="100%">
            {children}
          </Box>
        </AccordionDetails>
      </Accordion>
    </Box>
  );
}

const groupList: {
  groupName: string;
  defaultExpanded?: boolean;
  group: React.ReactNode;
}[] = [
  {
    groupName: 'Image tag',
    group: <FragmentImageTag />
  },
  {
    groupName: 'Twitter Card Preview ',
    group: <FragmentCard />
  },
  {
    groupName: 'Download images from the current workbench',
    group: <FragmentDownload />
  },
  {
    groupName: 'Make images by using current parameters.',
    group: <FragmentMake />
  },
  {
    groupName: 'URL Parameters',
    group: <FragmentParams />
  },
  {
    groupName: 'Links',
    group: <FragmentLinks />
  }
];
const ParametersPage = () => {
  return (
    <Layout title="Parameters">
      <Container maxWidth="md">
        <Box>
          {groupList.map(({ groupName, defaultExpanded, group }) => (
            <ParametersPanel
              key={groupName}
              defaultExpanded={defaultExpanded}
              groupName={groupName}
            >
              {group}
            </ParametersPanel>
          ))}
        </Box>
      </Container>
    </Layout>
  );
};

export default ParametersPage;
