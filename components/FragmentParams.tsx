import React, { useState, useContext, useEffect } from 'react';
import Box from '@material-ui/core/Box';
import PreviewContext from '../components/PreviewContext';
import FragmentTextField from '../components/FragmentTextField';

const FragmentParams = () => {
  const previewStateContext = useContext(PreviewContext);

  const [imgParametersJson, setImgParametersJson] = useState('');
  const [imgParameters, setImgParameters] = useState('');

  useEffect(() => {
    try {
      const tmpImgParametersJson: { [key: string]: string }[] = [];
      const tmpImgParameters: string[] = [];
      previewStateContext.previewSet.forEach((v) => {
        const u = new URL(v.previewUrl);
        tmpImgParameters.push(`${u.search.slice(1)}`);
        const p = v.imageParams
          //https://stackoverflow.com/questions/26264956/convert-object-array-to-hash-map-indexed-by-an-attribute-value-of-the-object
          .reduce((m: { [key: string]: string }, v): {
            [key: string]: string;
          } => {
            m[v.key] = v.value;
            return m;
          }, {});
        tmpImgParametersJson.push(p);
      });
      setImgParametersJson(JSON.stringify(tmpImgParametersJson, null, ' '));
      setImgParameters(tmpImgParameters.join('\n'));
    } catch {
      setImgParametersJson('');
      setImgParameters('');
    }
  }, [previewStateContext.previewSet]);

  return (
    <Box>
      <Box p={1}>
        <FragmentTextField label="json" value={imgParametersJson} />
      </Box>
      <Box p={1}>
        <FragmentTextField label="query" value={imgParameters} />
      </Box>
    </Box>
  );
};

export default FragmentParams;
