import React, { useState, useEffect, useContext } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Collapse from '@material-ui/core/Collapse';
import Box from '@material-ui/core/Box';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import PreviewContext, {
  PreviewDispatch,
  BreakPoint
} from '../components/PreviewContext';
import ImportPanel from '../components/ImportPanel';
import SamplePanel from '../components/SamplePanel';
import TemplateList from '../components/TemplateList';
import {
  ImportTemplateParametersSet,
  getImportTemplateItem
} from '../src/template';

const IndexPage = () => {
  const previewStateContext = useContext(PreviewContext);
  const previewDispatch = useContext(PreviewDispatch);
  const router = useRouter();

  const [open, setOpen] = useState<'' | 'template'>('');

  const [imageBaseUrl, setImageBaseUrl] = useState('');
  const [previewSetKind, setPreviewSetKind] = useState<'' | 'data' | 'sample'>(
    ''
  );

  const [templateIdx, setTemplateIdx] = useState(
    previewStateContext.templateIdx >= 0 ? previewStateContext.templateIdx : 0
  );
  const item = getImportTemplateItem(templateIdx);
  const [templateLabel, setTemplateLabel] = useState(item ? item.label : '');
  const [templateShortDescription, setTemplateShortDescription] = useState(
    item ? item.shortDescription || '' : ''
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
    const item = getImportTemplateItem(templateIdx);
    if (item) {
      setTemplateLabel(item.label);
      setTemplateShortDescription(item.shortDescription || '');
      setSampleParametersSet(item.sampleParameters);
      setParametersSet(item.parameters);
      setMedias(item.medias);
    }
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
          <Box>
            <Button
              endIcon={
                <ExpandMoreIcon
                  style={{
                    transform:
                      open === 'template'
                        ? 'rotate(180deg)'
                        : '' /*'rotate(270deg)'*/
                  }}
                />
              }
              onClick={() => setOpen(open ? '' : 'template')}
              style={{ textTransform: 'none' }}
            >
              <Box>
                <Box display="flex" justifyContent="flex-start">
                  <Typography variant="body1">{templateLabel}</Typography>
                </Box>
                <Box display="flex" justifyContent="flex-start">
                  <Typography variant="body2">
                    {templateShortDescription}
                  </Typography>
                </Box>
              </Box>
            </Button>
            <Collapse in={open === 'template'}>
              <TemplateList
                defaultIdx={templateIdx}
                onTemplate={({ templateIdx: idx }) => {
                  setTemplateIdx(idx);
                  setOpen('');
                }}
              />
            </Collapse>
          </Box>
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
        </Box>
      </Container>
    </Layout>
  );
};

export default IndexPage;
