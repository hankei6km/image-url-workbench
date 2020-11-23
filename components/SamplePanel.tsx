import React, { useState } from 'react';
// import Link from '../components/Link';
import { useTheme } from '@material-ui/core/styles';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import {
  BuiltinSampleImages,
  SampleImageBuildParametersSet,
  SampleImage
} from '../src/sample';
import {
  imgUrlParamsMergeObject,
  imgUrlParamsToString
} from '../utils/imgParamsUtils';

type Props = {
  onSelect: ({ value }: { value: string }) => void;
};

function SampleItem({
  sampleImage,
  onSelect
}: { sampleImage: SampleImage } & Props) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const handleTooltipClose = () => {
    setOpen(false);
  };

  const handleTooltipOpen = () => {
    setOpen(true);
  };

  const q = imgUrlParamsMergeObject(
    [],
    SampleImageBuildParametersSet[0].parameters
  );
  const s = imgUrlParamsToString(q);
  const paramsString = s ? `?${s}` : '';

  return (
    <Box>
      <Box>
        <Button
          onClick={() => {
            // setImageBaseUrl(v.imageUrl);
            onSelect({ value: sampleImage.imageUrl });
          }}
        >
          <img
            src={`${sampleImage.imageUrl}${paramsString}`}
            alt="sample"
            width={160}
            height={90}
          />
        </Button>
      </Box>
      <Box display="flex" flexDirection="row" alignItems="center" px={1}>
        <Box flexGrow="1" px={1}>
          <Typography variant="caption" noWrap={true}>
            {sampleImage.title}
          </Typography>
        </Box>
        <Box>
          <ClickAwayListener onClickAway={handleTooltipClose}>
            <div>
              <Tooltip
                PopperProps={{
                  disablePortal: true
                }}
                onClose={handleTooltipClose}
                open={open}
                disableFocusListener
                disableHoverListener
                disableTouchListener
                interactive
                title={
                  <React.Fragment>
                    <Box py={1}>
                      <Typography variant="body1">
                        Author: {(sampleImage.credit?.author || []).join(', ')}
                      </Typography>
                    </Box>
                    {sampleImage.credit?.license !== undefined && (
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        pb={1}
                      >
                        <Typography variant="body1">
                          License:{' '}
                          {`${
                            sampleImage.credit.license.fullName ||
                            sampleImage.credit.license.id
                          }`}
                        </Typography>
                        {sampleImage.credit.license.url !== undefined && (
                          <Box px={1}>
                            <a
                              href={sampleImage.credit.license.url}
                              target="_blank"
                              rel="noopener noreferrer"
                            >
                              <OpenInNewIcon
                                style={{
                                  color: theme.palette.info.main
                                }}
                              />
                            </a>
                          </Box>
                        )}
                      </Box>
                    )}
                    {sampleImage.credit?.webPage !== undefined && (
                      <Box
                        display="flex"
                        flexDirection="row"
                        alignItems="center"
                        pb={1}
                      >
                        <Typography variant="body1">Web Page: </Typography>
                        <Box px={1}>
                          <a
                            href={sampleImage.credit.webPage}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <OpenInNewIcon
                              style={{
                                color: theme.palette.info.main
                              }}
                            />
                          </a>
                        </Box>
                      </Box>
                    )}
                  </React.Fragment>
                }
              >
                <IconButton
                  aria-label="license"
                  disabled={sampleImage.credit === undefined}
                  onClick={handleTooltipOpen}
                >
                  <InfoOutlinedIcon fontSize="small" />
                </IconButton>
              </Tooltip>
            </div>
          </ClickAwayListener>
        </Box>
      </Box>
    </Box>
  );
}

const SamplePanel = ({ onSelect }: Props) => {
  return (
    <Box>
      <Box display="flex" flexDirection="row" overflow="auto">
        {BuiltinSampleImages.map((v, idx) => (
          <Box key={idx}>
            <SampleItem sampleImage={v} onSelect={(e) => onSelect(e)} />
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default SamplePanel;
