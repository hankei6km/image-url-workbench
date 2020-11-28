import React, { useState } from 'react';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import FragmentLink from '../components/FragmentLink';
import FragmentParams from '../components/FragmentParams';
import FragmentTag from '../components/FragmentTag';

export function ParametersPanel({
  groupName,
  opened,
  children,
  onChange
}: {
  groupName: string;
  opened: string;
  children: React.ReactNode;
  onChange: (_e: React.ChangeEvent<{}>, isExpanded: boolean) => void;
}) {
  return (
    <Box my={1}>
      <Accordion
        elevation={0}
        expanded={groupName === opened}
        onChange={onChange}
      >
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

const groupList = [
  {
    groupName: 'URL Parameters',
    group: <FragmentParams />
  },
  {
    groupName: 'Link',
    group: <FragmentLink />
  },
  {
    groupName: 'Tag',
    group: <FragmentTag />
  }
];
const ParametersPage = () => {
  const [opened, setOpened] = useState('');
  const changeOpend = (category: string) => {
    return (_e: React.ChangeEvent<{}>, isExpanded: boolean): void => {
      setOpened(isExpanded ? category : '');
    };
  };
  return (
    <Layout title="Parameters">
      <Container maxWidth="md">
        <Box py={1}>
          {groupList.map((v) => (
            <ParametersPanel
              key={v.groupName}
              opened={opened}
              groupName={v.groupName}
              onChange={changeOpend(v.groupName)}
            >
              {v.group}
            </ParametersPanel>
          ))}
        </Box>
      </Container>
    </Layout>
  );
};

export default ParametersPage;
