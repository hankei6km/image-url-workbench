import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Collapse from '@material-ui/core/Collapse';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
// import Chip from '@material-ui/core/Chip';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import {
  BuiltinImportTemplate,
  ImportTemplateParametersSet
} from '../src/template';

const useStyles = makeStyles((theme) => ({
  root: {},
  indicatorOuter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center'
  },
  selectorOuter: {
    marginTop: theme.spacing(1),
    '& .MuiPaper-root': {
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
    sampleParametersSet,
    parametersSet
  }: {
    templateIdx: number;
    sampleParametersSet: ImportTemplateParametersSet;
    parametersSet: ImportTemplateParametersSet;
  }) => void;
};

const TemplatePanel = ({ disabled = false, onSample }: Props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [templateIdx, setTemplateIdx] = useState(0);

  useEffect(() => {
    onSample({
      templateIdx: templateIdx,
      sampleParametersSet: BuiltinImportTemplate[templateIdx].sampleParameters,
      parametersSet: BuiltinImportTemplate[templateIdx].parameters
    });
  }, [onSample, templateIdx]);

  return (
    <Box className={classes.root}>
      <Box className={classes.indicatorOuter}>
        <Button
          startIcon={
            <ExpandMoreIcon
              style={{ transform: open ? 'rotate(180deg)' : '' }}
            />
          }
          onClick={() => setOpen(!open)}
          style={{ textTransform: 'none' }}
        >
          <Typography variant="body1">
            template: {BuiltinImportTemplate[templateIdx].label}
          </Typography>
        </Button>
      </Box>
      <Box className={classes.selectorOuter}>
        <Collapse in={open}>
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
        </Collapse>
      </Box>
    </Box>
  );
};

export default TemplatePanel;
