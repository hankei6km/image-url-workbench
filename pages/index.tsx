import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import PreviewContext, {
  PreviewDispatch,
  BreakPoint
} from '../components/PreviewContext';
import ImportPanel from '../components/ImportPanel';
import SamplePanel from '../components/SamplePanel';
import TemplateList from '../components/TemplateList';
import { ImportTemplateParametersSet } from '../src/template';

const IndexPage = () => {
  const previewStateContext = useContext(PreviewContext);
  const previewDispatch = useContext(PreviewDispatch);
  const router = useRouter();

  const [imageBaseUrl, setImageBaseUrl] = useState('');
  const [previewSetKind, setPreviewSetKind] = useState<'' | 'data' | 'sample'>(
    ''
  );
  const [templateIdx, setTemplateIdx] = useState(
    previewStateContext.templateIdx
  );
  const [sampleParametersSet, setSampleParametersSet] = useState<
    ImportTemplateParametersSet
  >([]);
  const [parametersSet, setParametersSet] = useState<
    ImportTemplateParametersSet
  >([]);
  const [medias, setMedias] = useState<BreakPoint[]>([]);

  useEffect(() => {
    previewDispatch({
      type: 'setTemplateIdx',
      payload: [templateIdx]
    });
  }, [previewDispatch, templateIdx]);

  useEffect(() => {
    return () => {
      if (imageBaseUrl !== '') {
        previewDispatch({
          type: 'setImageBaseUrl',
          payload: [previewSetKind, imageBaseUrl]
        });
        previewDispatch({
          type: 'resetPreviewSet',
          payload: []
        });
        switch (previewSetKind) {
          case 'data':
            previewDispatch({
              type: 'importPreviewSet',
              payload: ['data', imageBaseUrl, parametersSet, medias]
            });
            break;
          case 'sample':
            previewDispatch({
              type: 'importPreviewSet',
              payload: ['sample', imageBaseUrl, sampleParametersSet, medias]
            });
            break;
        }
      }
    };
  }, [
    previewDispatch,
    previewStateContext.imageBaseUrl,
    imageBaseUrl,
    previewSetKind,
    parametersSet,
    sampleParametersSet,
    medias
  ]);

  return (
    <Layout title="Home">
      <Container maxWidth="md">
        <Box>
          <Box mt={1}>
            <ImportPanel
              label="Enter image url or select sample"
              onSelect={({ value }) => {
                setImageBaseUrl(value);
                setPreviewSetKind('data');
                router.push('/workbench');
              }}
            />
          </Box>
          <Box mt={1}>
            <SamplePanel
              onSelect={({ value }) => {
                setImageBaseUrl(value);
                setPreviewSetKind('sample');
                router.push('/workbench');
              }}
            />
          </Box>
          <Box>
            <TemplateList
              defaultIdx={templateIdx}
              onTemplate={({
                templateIdx: idx,
                sampleParametersSet,
                parametersSet,
                medias
              }) => {
                setTemplateIdx(idx);
                setSampleParametersSet(sampleParametersSet);
                setParametersSet(parametersSet);
                setMedias(medias);
              }}
            />
          </Box>
        </Box>
      </Container>
    </Layout>
  );
};

export default IndexPage;
