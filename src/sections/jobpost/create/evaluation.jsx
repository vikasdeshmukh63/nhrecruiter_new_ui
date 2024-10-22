import * as yup from 'yup';
import { Icon } from '@iconify/react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';

import {
  Box,
  Button,
  Dialog,
  Divider,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemText,
  Radio,
  RadioGroup,
  Stack,
  Switch,
  Typography,
} from '@mui/material';

import {
  setEvaluationSwitch,
  setJobData,
  setPreferanceCurrentSteps,
  setPreferanceSteps,
} from 'src/redux/slices/jobposts';
import { toast } from 'sonner';
import { Form } from 'src/components/hook-form';

//! COMPONENT
const Evaluations = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const formRef = useRef(null);

  // accessing data from redux store
  const { jobData, evaluationSwitch, individualJobPostData } = useSelector(
    (state) => state.jobpost
  );
  const { preferenceCurrentStep } = useSelector((state) => state.jobpost);
  const [personalEvaluationState, setPersonalEvaluationState] = useState(
    evaluationSwitch.personalEvaluation
  );
  const [behavioralEvaluationState, setBehavioralEvaluationState] = useState(
    evaluationSwitch.behavioralEvaluation
  );
  const [backgroundEvaluationState, setBackgroundEvaluationState] = useState(
    evaluationSwitch.backgroundEvaluation
  );
  const [technicalEvaluationState, setTechnicalEvaluationState] = useState(
    evaluationSwitch.technicalEvaluation
  );
  const [codingEvaluationState, setCodingEvaluationState] = useState(
    evaluationSwitch.codingEvaluation
  );

  // getting particular id for rendering information btn
  const [formDataId, setFormDataId] = useState();
  const [open, setOpen] = useState(false);

  // data
  const formData = [
    {
      id: 0,
      title: 'Personal Evaluation',
      description: 'Evaluate candidates on personal experience',
      name: 'personalEvaluation',
      state: personalEvaluationState,
      questions: [
        'Can you describe a project you are particularly proud of? What was your role in it?',
        'How do you stay updated with the latest developments in React and the broader web development community?',
        'What aspect of your work in React JS do you find most challenging, and how do you handle it?',
        'How do you prioritize your tasks and manage your time when working on multiple projects?',
      ],
    },
    {
      id: 1,
      title: 'Behavioral Evaluation',
      description: 'Evaluate candidates on behavioral experience',
      name: 'behavioralEvaluation',
      state: behavioralEvaluationState,
      questions: [
        'Tell me about a time when you had to work closely with a team member whose personality was very different from yours. How did you ensure effective collaboration?',
        'Describe a situation where you faced a significant obstacle while working on a React project. How did you overcome it?',
        'Have you ever received criticism about your code? How did you respond and what did you learn from the experience?',
        'Can you share an experience where you had to learn a new technology or framework in a short time to implement it in a project? How did you approach the learning process?',
      ],
    },
    {
      id: 2,
      title: 'Background Evaluation',
      description: 'Evaluate candidates on background experience',
      name: 'backgroundEvaluation',
      state: backgroundEvaluationState,
      questions: [
        'How did you get started with React JS, and what motivated you to specialize in  it?',
        "Could you discuss a complex project you've worked on that involved React? What was your contribution and the technologies integrated with React?",
        'Have you contributed to any open-source React projects or developed any personal projects using React? Can you describe one?',
        'What industries or types of projects have you worked in with React? How do you adapt your development approach to different project requirements?',
      ],
    },
    {
      id: 3,
      title: 'Technical Evaluation',
      description: 'Evaluate candidates on technical experience',
      name: 'technicalEvaluation',
      state: technicalEvaluationState,
      questions: [
        'Can you explain the virtual DOM in React and how it differs from the real DOM?',
        'How do you manage state in a React application? Can you compare the use of  local component state, Context API, and Redux?',
      ],
    },
    {
      id: 4,
      title: 'Coding evaluation',
      description: 'Enable to evaluate candidate coding',
      name: 'codingEvaluation',
      state: codingEvaluationState,
    },
  ];

  // schema
  const schema = yup.object().shape({
    personalEvaluation: !personalEvaluationState
      ? null
      : yup.string().required('Personal Evaluation is Required'),
    behavioralEvaluation: !behavioralEvaluationState
      ? null
      : yup.string().required('Behavioral Evaluation is Required'),
    backgroundEvaluation: !backgroundEvaluationState
      ? null
      : yup.string().required('Background Evaluation is Required'),
    technicalEvaluation: !technicalEvaluationState
      ? null
      : yup.string().required('Technical Evaluation is Required'),
  });

  // function to check that any value is select or not
  const checkIsValueSelected = () => {
    if (
      personalEvaluationState ||
      behavioralEvaluationState ||
      backgroundEvaluationState ||
      technicalEvaluationState ||
      codingEvaluationState
    ) {
      return true;
    }
    toast.error('You must select at least one evaluation');

    return false;
  };

  // function to handle toggle preferances activity
  const toggleActive = (e) => {
    const switchName = e.target.name;
    const updatedValue = !evaluationSwitch[switchName]; // toogle the value
    // update local state
    switch (switchName) {
      case 'personalEvaluation':
        setPersonalEvaluationState(updatedValue);
        break;
      case 'behavioralEvaluation':
        setBehavioralEvaluationState(updatedValue);
        break;
      case 'backgroundEvaluation':
        setBackgroundEvaluationState(updatedValue);
        break;
      case 'technicalEvaluation':
        setTechnicalEvaluationState(updatedValue);
        break;
      case 'codingEvaluation':
        setCodingEvaluationState(updatedValue);
        break;
      default:
        break;
    }

    // dispatch the action with the upated value
    dispatch(setEvaluationSwitch({ key: switchName, value: updatedValue }));
  };

  const defaultValues = {
    personalEvaluation: jobData?.personalEvaluation || '',
    behavioralEvaluation: jobData?.behavioralEvaluation || '',
    backgroundEvaluation: jobData?.backgroundEvaluation || '',
    technicalEvaluation: jobData?.technicalEvaluation || '',
    codingEvaluation: jobData?.codingEvaluation || '',
  };

  const methods = useForm({
    defaultValues,
    resolver: yupResolver(schema),
  });

  const {
    reset,
    watch,
    control,
    setValue,
    handleSubmit,
    register,
    getValues,
    formState: { isSubmitting, errors },
  } = methods;

  const onsubmit = handleSubmit(async (values) => {
    // if values are selected then only submit the form
    if (checkIsValueSelected()) {
      const updatedJobData = {
        personalEvaluation: personalEvaluationState ? values.personalEvaluation : '',
        behavioralEvaluation: behavioralEvaluationState ? values.behavioralEvaluation : '',
        backgroundEvaluation: backgroundEvaluationState ? values.backgroundEvaluation : '',
        technicalEvaluation: technicalEvaluationState ? values.technicalEvaluation : '',
        codingEvaluation: codingEvaluationState && codingEvaluationState,
      };
      // storing values in redux store
      dispatch(setJobData(updatedJobData));
      // if switch for technicalEvaluation is off
      if (Boolean(evaluationSwitch.technicalEvaluation) === false) {
        // setting current step in record
        dispatch(setPreferanceSteps(2));
        // changing current step
        dispatch(setPreferanceCurrentSteps(2));
      }
      // if switch for technicalEvaluation is on
      else {
        // setting current step in record
        dispatch(setPreferanceSteps(preferenceCurrentStep + 1));
        // changing current step
        dispatch(setPreferanceCurrentSteps(preferenceCurrentStep + 1));
      }
    }
  });

  //   to change the values as per the form question
  const formValue = (name) => {
    if (name === 'personalEvaluation') {
      return getValues().personalEvaluation;
    }
    if (name === 'behavioralEvaluation') {
      return getValues().behavioralEvaluation;
    }
    if (name === 'backgroundEvaluation') {
      return getValues().backgroundEvaluation;
    }
    if (name === 'technicalEvaluation') {
      return getValues().technicalEvaluation;
    }
    return '';
  };

  // expose a function to submit the form using the parent's ref
  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit(onsubmit),
  }));

  // model logic opening and closing
  const handleOpen = (id) => {
    setOpen(true);
    setFormDataId(id);
  };
  const handleClose = () => setOpen(false);

  const status = watch();

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'flex-start',
        gap: 3,
        flexDirection: 'column',
        pl: { xs: 0, md: 3 },
      }}
    >
      {formData.map((item, index) => (
        <Box key={index} sx={{ width: '100%' }}>
          <Form onSubmit={onsubmit}>
            {item.id !== 4 ? (
              <Grid container alignItems="center" justifyContent="space-between" spacing={3}>
                {/* field switches */}
                <Grid item md={6}>
                  <Stack>
                    <Typography variant="body1" fontWeight={700}>
                      {item.title}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: 2,
                      }}
                    >
                      <Switch
                        onClick={toggleActive}
                        name={item.name}
                        checked={item.state}
                        disabled={
                          individualJobPostData
                            ? individualJobPostData?.status !== 2 &&
                              individualJobPostData?.status !== 1
                            : false
                        }
                      />
                      <Typography variant="subtitle2" fontWeight={100}>
                        {item.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>
                {/* radio buttons field  */}
                <Grid item md={5}>
                  <FormControl>
                    <RadioGroup
                      row
                      aria-label={item.name}
                      value={formValue(item.name)}
                      onChange={(e) => setValue(item.name, e.target.value)}
                      name={item.name}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <FormControlLabel
                        disabled={
                          !item.state || individualJobPostData
                            ? individualJobPostData?.status !== 2 &&
                              individualJobPostData?.status !== 1
                            : false
                        }
                        name={item.name}
                        value="1"
                        control={<Radio />}
                        label="Beginner"
                      />
                      <FormControlLabel
                        disabled={
                          !item.state || individualJobPostData
                            ? individualJobPostData?.status !== 2 &&
                              individualJobPostData?.status !== 1
                            : false
                        }
                        name={item.name}
                        value="2"
                        control={<Radio />}
                        label="Intermediate"
                      />
                      <FormControlLabel
                        disabled={
                          !item.state || individualJobPostData
                            ? individualJobPostData?.status !== 2 &&
                              individualJobPostData?.status !== 1
                            : false
                        }
                        name={item.name}
                        value="3"
                        control={<Radio />}
                        label="Advanced"
                      />
                    </RadioGroup>
                    {errors[item.name] && (
                      <Typography variant="caption" color="error">
                        {errors[item.name].message}
                      </Typography>
                    )}
                  </FormControl>
                </Grid>

                <Grid item md={1}>
                  <IconButton onClick={() => handleOpen(item.id)}>
                    <Icon icon="ic:twotone-info" />
                  </IconButton>
                </Grid>
              </Grid>
            ) : (
              <Grid container alignItems="center" justifyContent="space-between">
                <Grid item lg={10}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body1" fontWeight={700}>
                      {item.title}
                    </Typography>
                    <Box
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'flex-start',
                        gap: 2,
                      }}
                    >
                      <Switch
                        onClick={toggleActive}
                        name={item.name}
                        checked={item.state}
                        disabled={
                          individualJobPostData
                            ? individualJobPostData?.status !== 2 &&
                              individualJobPostData?.status !== 1
                            : false
                        }
                      />

                      <Typography variant="subtitle2" fontWeight={100}>
                        {item.description}
                      </Typography>
                    </Box>
                  </Stack>
                </Grid>

                <Grid item md={1}>
                  <IconButton disabled onClick={() => handleOpen(item.id)}>
                    <Icon icon="ic:twotone-info" />
                  </IconButton>
                </Grid>
              </Grid>
            )}
          </Form>
        </Box>
      ))}

      {/* modal to open information */}
      <Dialog open={open} onClose={handleClose} PaperProps={{ sx: { borderRadius: 1, p: 3 } }}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>
            {formData[formDataId]?.title}
          </Typography>
          <List>
            {formData[formDataId]?.questions?.map((question, index) => (
              <ListItem
                key={index}
                sx={{ marginBlock: '5px', fontWeight: 800, userSelect: 'none' }}
              >
                <ListItemText
                  primary={`${index + 1}) ${question}`}
                  primaryTypographyProps={{ sx: { fontSize: 14 } }}
                />
              </ListItem>
            ))}
          </List>
        </Box>
        <Divider sx={{ mb: 3 }} />
        <Box sx={{ display: 'flex', justifyContent: 'end' }}>
          <Button variant="contained" onClick={handleClose}>
            Close
          </Button>
        </Box>
      </Dialog>
    </Box>
  );
});

export default Evaluations;
