import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import AddPhotoAlternateIcon from '@material-ui/icons/AddPhotoAlternate';
import {
  BuiltinImportTemplate,
  ImportTemplateParametersSet
} from '../src/template';
import ImgBaseUrl, {
  BaseUrlOnChangeEvent,
  BaseUrlOnEnterKeyEvent
} from '../components/ImgBaseUrl';

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
          minWidth: 120
        }
      }
    }
  }
}));

type Props = {
  onImport: ({ value }: { value: string }) => void;
  onSample: ({
    templateIdx,
    imageBaseUrl,
    parametersSet
  }: {
    templateIdx: number;
    imageBaseUrl: string;
    parametersSet: ImportTemplateParametersSet;
  }) => void;
};

const ImportPanel = ({ onImport, onSample }: Props) => {
  const classes = useStyles();
  const [templateIdx, setTemplateIdx] = useState(0);
  const [imageBaseUrl, setImageBaseUrl] = useState('');

  useEffect(() => {
    onSample({
      templateIdx: templateIdx,
      imageBaseUrl: BuiltinImportTemplate[templateIdx].imageBaseUrl,
      parametersSet: BuiltinImportTemplate[templateIdx].sample
    });
  }, [onSample, templateIdx]);

  return (
    <Box className={classes.root}>
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
            <Tab label={label} key={i} />
          ))}
        </Tabs>
      </Paper>
      <Box display="flex" alignItems="flex-end" my={1}>
        <Box flexGrow="1">
          <ImgBaseUrl
            baseUrl={imageBaseUrl}
            onEnterKey={(e: BaseUrlOnEnterKeyEvent) => {
              onImport({ value: e.value });
              setImageBaseUrl('');
            }}
            onChange={(e: BaseUrlOnChangeEvent) => setImageBaseUrl(e.value)}
          />
        </Box>
        <Box p={1}>
          <Button
            color="primary"
            variant="contained"
            size="small"
            startIcon={<AddPhotoAlternateIcon fontSize="small" />}
            onClick={() => onImport({ value: imageBaseUrl })}
          >
            Apply
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default ImportPanel;
