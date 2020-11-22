import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import {
  BuiltinImportTemplate,
  ImportTemplateParametersSet
} from '../src/template';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > .MuiPaper-root': {
      position: 'static',
      // flexGrow: 1,
      width: '100%',
      display: 'flex',
      '& .MuiTab-root': {
        textTransform: 'none',
        [theme.breakpoints.up('sm')]: {
          minWidth: 240
        }
      }
    }
  }
}));

type Props = {
  disabled?: boolean;
  onSample: ({
    templateIdx,
    imageBaseUrl,
    parametersSet
  }: {
    templateIdx: number;
    imageBaseUrl: string;
    sampleParametersSet: ImportTemplateParametersSet;
    parametersSet: ImportTemplateParametersSet;
  }) => void;
};

const TemplatePanel = ({ disabled = false, onSample }: Props) => {
  const classes = useStyles();
  const [templateIdx, setTemplateIdx] = useState(0);

  useEffect(() => {
    onSample({
      templateIdx: templateIdx,
      imageBaseUrl: BuiltinImportTemplate[templateIdx].imageBaseUrl,
      sampleParametersSet: BuiltinImportTemplate[templateIdx].sampleParameters,
      parametersSet: BuiltinImportTemplate[templateIdx].parameters
    });
  }, [onSample, templateIdx]);

  return (
    <Box className={classes.root} borderBottom={0}>
      <Paper square elevation={0}>
        <Tabs
          indicatorColor="primary"
          textColor="primary"
          variant="scrollable"
          value={templateIdx}
          onChange={(_e, value) => setTemplateIdx(value)}
          //onChange=((_e,value)=>{setTemplateIdx(value)}}
        >
          {BuiltinImportTemplate.map(({ label }, i) => (
            <Tab disabled={disabled} label={label} key={i} />
          ))}
        </Tabs>
      </Paper>
    </Box>
  );
};

export default TemplatePanel;
