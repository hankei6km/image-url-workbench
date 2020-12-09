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

const useStyles = makeStyles(() => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
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

const TemplateList = ({ defaultIdx = 0, onTemplate }: Props) => {
  const classes = useStyles();
  //  const [open, setOpen] = useState(defaultIdx < 0);
  const [templateIdx, setTemplateIdx] = useState(
    0 <= defaultIdx && defaultIdx < BuiltinImportTemplate.length
      ? defaultIdx
      : 0
  );

  useEffect(() => {}, [onTemplate, templateIdx]);

  return (
    <Box className={classes.root}>
      <List component="nav" aria-label="template list">
        {BuiltinImportTemplate.map((v, i) => (
          <ListItem
            key={i}
            button
            onClick={() => {
              setTemplateIdx(i);
              onTemplate({
                templateIdx: i,
                sampleParametersSet: BuiltinImportTemplate[i].sampleParameters,
                parametersSet: BuiltinImportTemplate[i].parameters,
                medias: BuiltinImportTemplate[i].medias
              });
            }}
          >
            <ListItemIcon>{templateIdx === i && <CheckIcon />}</ListItemIcon>
            <ListItemText primary={v.label} secondary={v.shortDescription} />
          </ListItem>
        ))}
      </List>
    </Box>
  );
};

export default TemplateList;
