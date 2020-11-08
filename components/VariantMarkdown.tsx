import React, { useState, useContext, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';
import PreviewContext from '../components/PreviewContext';

const markdwonEscapeRegExp = /([[\]\\<>])/g;

const VariantMarkdown = () => {
  const previewStateContext = useContext(PreviewContext);
  const [altText, setAltText] = useState('');
  const [linkText, setLinkText] = useState('');
  const [newTab, setNewTab] = useState(false);
  const [markdown, setMarkdown] = useState('');

  useEffect(() => {
    // markdown は手動でエスケープでも良いのでは?
    const inlineImg = `![${altText.replace(markdwonEscapeRegExp, '\\$1')}](${
      previewStateContext.previewImageUrl
    })`;
    if (linkText) {
      // https://stackoverflow.com/questions/4425198/can-i-create-links-with-target-blank-in-markdown
      setMarkdown(
        `[${inlineImg}](${linkText})${newTab ? '{:target="_blank"}' : ''}`
      );
    } else {
      setMarkdown(inlineImg);
    }
  }, [previewStateContext.previewImageUrl, altText, linkText, newTab]);

  return (
    <Box>
      <Box p={1}>
        <TextField
          label="alt text"
          helperText="manually escape special charaters if display it in alt text"
          fullWidth
          value={altText}
          onChange={(e) => setAltText(e.target.value)}
        />
      </Box>
      <Box p={1}>
        <Box display="flex" flexDirection="row">
          <Box flexGrow={1} mr={1}>
            <TextField
              label="link"
              helperText="manually escape special charaters if use it in link text"
              fullWidth
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
            />
          </Box>
          <Box>
            <FormControlLabel
              control={
                <Switch
                  checked={newTab}
                  onChange={(e) => {
                    setNewTab(e.target.checked);
                  }}
                  color="primary"
                  name="newTab"
                  inputProps={{ 'aria-label': `switch open link in new tab` }}
                />
              }
              label="new tab"
            />
          </Box>
        </Box>
      </Box>
      <Box p={1}>
        <TextField fullWidth multiline value={markdown} />
      </Box>
    </Box>
  );
};

export default VariantMarkdown;
