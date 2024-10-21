import { Icon } from '@iconify/react';
import ReactPlayer from 'react-player';
import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';

import {
  Box,
  Grid,
  Stack,
  Button,
  IconButton,
  Typography,
  CircularProgress,
  ButtonBase,
  MenuItem,
  CardHeader,
} from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';

import EmptyContent from 'src/components/empty-content/empty-content';
import { usePopover } from 'src/components/custom-popover';
import Iconify from 'src/components/iconify';
import CustomPopover from 'src/components/custom-popover/custom-popover';
import { SPEED_DURATION } from 'src/utils/helperFunctions';

export const CandidateMediaView = ({ handleSignInRec, handleSignUpRec }) => {
  // referances
  const videoRef = useRef(null);
  const rewindInterval = useRef(null);
  const forwardInterval = useRef(null);

  // states
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [speedRate, setSpeedRate] = useState(3);
  const [activeTimeFrame, setIsActiveTimeFrame] = useState(1);
  const [eventTimes, setEventTimes] = useState([]);

  const popover = usePopover();

  const { user } = useAuthContext();

  const { InterviewEventData, videoUrl } = useSelector((state) => state.candidate);
  const { candidateInterviewData } = useSelector((state) => state.candidate);

  // function to set loading true when progress is 80% or more. to stop loading when video is loaded
  const handleProgress = (progress) => {
    const index = eventTimes.findIndex(
      (num) => num > Math.floor(videoRef.current.getCurrentTime())
    );
    setIsActiveTimeFrame(index === 1 ? 1 : index - 1);
    if (progress?.loaded >= 0.8) {
      setIsLoading(false);
    }
  };

  // function to set loading true when buffer start
  const handleBufferstart = () => {
    setIsLoading(true);
  };

  // function to set loading false when buffer end
  const handleBufferend = () => {
    setIsLoading(false);
  };

  // function to play video
  const playVideo = () => {
    setIsPlaying(true);
  };

  // function to pause video
  const pauseVideo = () => {
    setIsPlaying(false);
  };

  // function to stop video
  const stopVideo = () => {
    if (videoRef?.current) {
      videoRef?.current?.seekTo(0);
      setIsPlaying(false);
      clearInterval(rewindInterval.current);
      clearInterval(forwardInterval.current);
    }
  };

  // function to rewind video
  const rewindVideo = () => {
    if (videoRef?.current) {
      try {
        const currentTime = videoRef.current.getCurrentTime();
        const newTime = Math.max(currentTime - 30, 0); // rewind 30 second
        videoRef?.current?.seekTo(newTime);
      } catch (err) {
        console.error('Error during rewind:', err);
      }
    }
  };

  // function to forward video
  const forwardVideo = () => {
    if (videoRef?.current) {
      try {
        const currentTime = videoRef.current.getCurrentTime();
        const duration = videoRef.current.getDuration();
        const newTime = Math.min(currentTime + 30, duration); // forward 30 second
        videoRef?.current?.seekTo(newTime);
      } catch (err) {
        console.error('Error during forward:', err);
      }
    }
  };

  // function to go on required timestamp
  const handleStackClick = (timeString, activeIndex) => {
    try {
      const [hours, minutes, seconds] = timeString.split(':').map(Number);
      const totalSeconds = hours * 3600 + minutes * 60 + seconds;
      if (videoRef?.current) {
        videoRef?.current?.seekTo(totalSeconds);
        setIsPlaying(true);
        setIsActiveTimeFrame(activeIndex);
      }
    } catch (err) {
      console.error('Error parsing time string:', err);
    }
  };

  // function to generate timestamp by calculating difference between questions upload time
  const formatTimeStamp = (givenDate, prevDate) => {
    if (prevDate && givenDate) {
      const timeDiff = !prevDate
        ? new Date(givenDate).getTime()
        : Math.abs(new Date(givenDate) - new Date(prevDate));
      const formattedTime = new Date(timeDiff).toISOString().slice(11, 19);

      return formattedTime;
    }
    return null;
  };

  const handleSpeedRate = (id) => {
    // console.log(rate);
    setSpeedRate(id);
    popover.onClose();
  };
  // to create the timeline array as component mounted
  useEffect(() => {
    if (InterviewEventData) {
      const timelineData = [];
      const timeStampsData = [];

      // getting starting time of the interview
      const prevdatenew = InterviewEventData?.find((item) => item.type === 1)?.createdAt;

      InterviewEventData?.forEach((event) => {
        if (event.type === 1 || event.type === 4) {
          const obj = {
            timeStamp: formatTimeStamp(event?.createdAt, prevdatenew),
            question: JSON?.parse(event?.details),
            type: event?.type,
          };
          const eventtime = obj.timeStamp;
          const [hours, minutes, seconds] = eventtime.split(':').map(Number);
          const totalSeconds = hours * 3600 + minutes * 60 + seconds;

          timelineData.push(obj);
          timeStampsData.push(totalSeconds);
        }
        setTimeline(timelineData);
        setEventTimes(timeStampsData);
      });
    }
  }, [InterviewEventData]);

  return (
    <>
      {videoUrl && (user || candidateInterviewData?.userType === 1) ? (
        <Box
          position="relative"
          sx={{
            width: '65%',
            margin: '0 auto',
          }}
        >
          <ReactPlayer
            ref={videoRef}
            playing={isPlaying}
            width="100%"
            playbackRate={SPEED_DURATION[speedRate - 1].speed}
            url={videoUrl}
            onProgress={handleProgress}
            style={{
              background: 'black',
              borderRadius: '10px',
            }}
            onReady={() => setIsLoading(false)}
            onError={() => setIsLoading(false)}
            onStart={() => setIsLoading(false)}
            onBufferEnd={handleBufferend}
            onBuffer={handleBufferstart}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
          />
          {isLoading && (
            <Box
              sx={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: 'translate(-50%, -50%)',
              }}
            >
              <CircularProgress
                color="primary"
                sx={{
                  zIndex: 1,
                }}
              />
            </Box>
          )}
        </Box>
      ) : (
        <>
          <Box
            width="65%"
            margin="0 auto"
            height="360px"
            sx={{ background: '#000000', borderRadius: '10px', mb: 2 }}
          />
          <Box textAlign="center">
            <Typography variant="caption" color="error">
              No Media Available
            </Typography>
          </Box>
        </>
      )}
      {/* control buttons  */}
      {videoUrl && (user || candidateInterviewData?.userType === 1) && (
        <Grid item xs={12} display="flex" justifyContent="center" alignItems="center" width="100%">
          <IconButton onClick={rewindVideo}>
            <Icon icon="material-symbols:replay-30" />
          </IconButton>
          <IconButton onClick={isPlaying ? pauseVideo : playVideo}>
            {isPlaying ? <Icon icon="ic:baseline-pause" /> : <Icon icon="ph:play-duotone" />}
          </IconButton>
          <IconButton onClick={stopVideo}>
            <Icon icon="material-symbols:stop-outline" />
          </IconButton>
          <IconButton onClick={forwardVideo}>
            <Icon icon="material-symbols:forward-30" />
          </IconButton>
          <CardHeader
            sx={{
              p: 0,
            }}
            // title={title}
            // subheader={subheader}
            action={
              <ButtonBase
                onClick={popover.onOpen}
                sx={{
                  pl: 1,
                  py: 0.5,
                  pr: 0.5,
                  borderRadius: 1,
                  typography: 'subtitle2',
                  bgcolor: 'background.neutral',
                }}
              >
                {SPEED_DURATION[speedRate - 1].speed === 1
                  ? 'Normal'
                  : SPEED_DURATION[speedRate - 1].speed}
                <Iconify
                  width={16}
                  icon={popover.open ? 'eva:arrow-ios-upward-fill' : 'eva:arrow-ios-downward-fill'}
                  sx={{ ml: 0.5 }}
                />
              </ButtonBase>
            }
          />

          <CustomPopover
            open={popover.open}
            arrow="bottom-right"
            onClose={popover.onClose}
            sx={{ width: 80 }}
          >
            {SPEED_DURATION.map(({ speed, id }) => (
              <MenuItem key={id} selected={id === speedRate} onClick={() => handleSpeedRate(id)}>
                {speed === 1 ? 'Normal' : speed}
              </MenuItem>
            ))}
          </CustomPopover>
        </Grid>
      )}

      {videoUrl && (user || candidateInterviewData?.userType === 1) && (
        <>
          <Typography variant="h3" style={{ fontSize: '20px' }} mb={3}>
            Time Frames
          </Typography>
          <Box
            sx={{
              width: '100%',
              height: '15vw',
              overflowY: 'auto',
              px: 3,
            }}
          >
            {timeline?.length > 0 && videoUrl ? (
              timeline?.map(
                (item, index) =>
                  item?.type !== 1 &&
                  item?.type === 4 &&
                  item?.timeStamp && (
                    <Stack
                      key={index}
                      direction="row"
                      spacing={3}
                      onClick={() => handleStackClick(item?.timeStamp, index)}
                      sx={{
                        cursor: 'pointer',
                        mb: 1.5,
                        transition: '1s',
                        bgcolor: index === activeTimeFrame ? '#E0F7FA' : '', // '&:hover': { background: '#dae4f7' },

                        // '&:hover': { background: '#dae4f7' },
                        padding: 2,
                        borderRadius: 3,
                      }}
                    >
                      <Typography fontSize="14px">{item?.timeStamp}</Typography>
                      <Typography fontSize="14px" color="#616161" fontWeight={400} align="justify">
                        {item?.question}
                      </Typography>
                    </Stack>
                  )
              )
            ) : (
              <EmptyContent filled title="No Data Found" />
            )}
          </Box>
        </>
      )}

      {!user && candidateInterviewData?.userType !== 1 && (
        <Box
          sx={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%,-50%)',
          }}
          display="flex"
          justifyContent="center"
        >
          <Stack direction="row" justifyContent="center" spacing={2} alignItems="center">
            <Button variant="contained" color="success" onClick={handleSignInRec}>
              Sign In to View
            </Button>
            <Typography variant="caption" color="white">
              or
            </Typography>
            <Button variant="contained" onClick={handleSignUpRec}>
              Sign Up to View
            </Button>
          </Stack>
        </Box>
      )}
    </>
  );
};
