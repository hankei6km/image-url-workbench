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
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    alignContent: 'flex-end',
    justifyContent: 'flex-end'
  },
  indicatorOuter: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    '& .MuiButton-label > .MuiBox-root': {
      marginLeft: theme.spacing(1)
    }
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
  defaultIdx: number;
  onTemplate: ({
    templateIdx,
    sampleParametersSet,
    parametersSet
  }: {
    templateIdx: number;
    sampleParametersSet: ImportTemplateParametersSet;
    parametersSet: ImportTemplateParametersSet;
  }) => void;
};

const TemplatePanel = ({
  defaultIdx = -1,
  disabled = false,
  onTemplate: onSample
}: Props) => {
  const classes = useStyles();
  //  const [open, setOpen] = useState(defaultIdx < 0);
  const [open, setOpen] = useState(false);
  const [templateIdx, setTemplateIdx] = useState(
    defaultIdx >= 0 ? defaultIdx : 0
  );

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
          endIcon={
            <ExpandMoreIcon
              style={{
                transform: open ? 'rotate(180deg)' : '' /*'rotate(270deg)'*/
              }}
            />
          }
          onClick={() => setOpen(!open)}
          style={{ textTransform: 'none' }}
        >
          <Collapse in={!open}>
            <Box>
              <Typography variant="body1">
                {BuiltinImportTemplate[templateIdx].label}
              </Typography>
            </Box>
          </Collapse>
          <Box>
            <Typography variant="body1">template</Typography>
          </Box>
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
