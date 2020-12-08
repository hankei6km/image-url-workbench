import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import CheckIcon from '@material-ui/icons/Check';
import {
  BuiltinImportTemplate,
  ImportTemplateParametersSet
} from '../src/template';
import { BreakPoint } from './PreviewContext';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
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
  defaultIdx: number;
  onTemplate: ({
    templateIdx,
    sampleParametersSet,
    parametersSet,
    medias
  }: {
    templateIdx: number;
    sampleParametersSet: ImportTemplateParametersSet;
    parametersSet: ImportTemplateParametersSet;
    medias: BreakPoint[];
  }) => void;
};

const TemplateList = ({ defaultIdx = -1, onTemplate }: Props) => {
  const classes = useStyles();
  //  const [open, setOpen] = useState(defaultIdx < 0);
  const [templateIdx, setTemplateIdx] = useState(
    defaultIdx >= 0 ? defaultIdx : 0
  );

  useEffect(() => {
    onTemplate({
      templateIdx: templateIdx,
      sampleParametersSet: BuiltinImportTemplate[templateIdx].sampleParameters,
      parametersSet: BuiltinImportTemplate[templateIdx].parameters,
      medias: BuiltinImportTemplate[templateIdx].medias
    });
  }, [onTemplate, templateIdx]);

  return (
    <Box className={classes.root}>
      <Box className={classes.selectorOuter}>
        <List component="nav" aria-label="template list">
          {BuiltinImportTemplate.map((v, i) => (
            <ListItem key={v.label} button onClick={() => setTemplateIdx(i)}>
              <ListItemIcon>{templateIdx === i && <CheckIcon />}</ListItemIcon>
              <ListItemText primary={v.label} />
            </ListItem>
          ))}
        </List>
      </Box>
    </Box>
  );
};

export default TemplateList;
