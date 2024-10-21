import { Icon } from '@iconify/react';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';

import {
  Autocomplete,
  Box,
  Button,
  Grid,
  IconButton,
  ListItem,
  TextField,
  Typography,
} from '@mui/material';

import {
  setJobData,
  setPreferanceCurrentSteps,
  setPreferanceSteps,
} from 'src/redux/slices/jobposts';
import { fetchMasters } from 'src/redux/slices/masters';
import { createNewSkill, searchSkills, setNewSkill } from 'src/redux/slices/skills';

import { toast } from 'sonner';
import { Form } from 'src/components/hook-form';
import { EvalType } from 'src/utils/helperFunctions';

const TechnicalSkills = forwardRef((props, ref) => {
  const dispatch = useDispatch();

  // accessing data from redux store
  const { jobData, individualJobPostData } = useSelector((state) => state.jobpost);
  const { preferenceCurrentStep } = useSelector((state) => state.jobpost);
  const { skills: skillData, newSkill, error } = useSelector((state) => state.skills);
  const { proficiencies } = useSelector((state) => state.masters);
  const [skills, setSkills] = useState(null);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [errorMessages, setErrorMessages] = useState({});
  const [errorMessageForEvalType, setErrorMessageForEvalType] = useState({});

  const [skillsValue, setSkillsValue] = useState('');
  const [isSkillSubmittd, setIsSkillSubmitted] = useState(false);

  // function to handle skill level change
  const handleSkillLevelChange = (event, newValue, index) => {
    const updatedSelectedSkills = selectedSkills.map((skill, i) =>
      i === index ? { ...skill, skillLevel: newValue?.id || '' } : skill
    );
    setSelectedSkills(updatedSelectedSkills);
  };

  const handleEventTypeChange = (event, newValue, index) => {
    const updatedSelectedSkills = selectedSkills.map((skill, i) =>
      i === index ? { ...skill, skillEvalType: newValue?.id || '' } : skill
    );
    setSelectedSkills(updatedSelectedSkills);
  };
  // function to check that for selectedSkills skilllevel is selected or not
  const [isSubmitted, setIsSubmitted] = useState(false);
  const customErrorObj = {};
  const isSkillLevelsSelect = (data) => {
    data.forEach((item) => {
      if (!item.skillLevel) {
        customErrorObj[item.id] = `for ${item.name} skillLevel is Required`;
      }
      if (item.skillLevel) {
        delete customErrorObj[item.id];
      }
    });
  };

  const customErrorObjEvalType = {};
  const isSkillEvaluationSlected = (data) => {
    data.forEach((item) => {
      if (!item.skillEvalType) {
        customErrorObjEvalType[item.id] = `for ${item.name} skillEvalType is Required`;
      }
      if (item.skillEvalType) {
        delete customErrorObjEvalType[item.id];
      }
    });
  };
  // function to handle skill change
  function handleSkillsChange(event, newValue) {
    setSkills(newValue);
  }

  // function to handle skills add
  const handleSkillsPush = (skill) => {
    // pushing only when skill is defined entity
    if (skill) {
      // finding is skill is alredy in array
      const isSkillExists = selectedSkills.find((item) => item.id === skill.id);
      // if skill exists
      if (isSkillExists) {
        toast.warning('Skill has already been chosen !');
      }
      // if skill not exist then only pushing the element in array
      else {
        skill = {
          ...skill,
          skillEvalType: 1,
        };

        setSelectedSkills((prevSkills) => [...prevSkills, skill]);
        setSkills(undefined);
      }
    }
  };

  // to search organizations based on typed value after keypress event
  const handleKeyUp = async (event) => {
    const query = event.target.value.toString();
    setIsSubmitted(false);
    setSkillsValue(query);
    if (query) {
      await dispatch(searchSkills(query));
      if (skillData === null) {
        setSkills(null);
      }
    }
    const isSkillExists = skillData?.find((item) => item.name === query);
    if ((event.key === 'Enter' || event.keyCode === 13) && isSkillExists) {
      handleSkillsPush(skills);
    }
  };
  // function to handle delete skill
  const handleDeleteSkill = (id) => {
    if (id !== undefined) {
      setSelectedSkills(selectedSkills.filter((item) => item.id !== id));
    }
  };
  // function to check that any value is select or not
  const checkIsValueSelected = () => {
    if (selectedSkills.length > 0) {
      return true;
    }
    toast.warning('You must select at least one skill');

    return false;
  };

  const methods = useForm({
    defaultValues: {},
  });
  const { handleSubmit } = methods;

  const onsubmit = (values) => {
    isSkillLevelsSelect(selectedSkills);
    isSkillEvaluationSlected(selectedSkills);
    setErrorMessages(customErrorObj);
    setErrorMessageForEvalType(customErrorObjEvalType);
    //  we only submit form when any skill is selected
    if (
      // checkIsValueSelected() &&
      Object.keys(customErrorObj).length === 0 &&
      Object.keys(customErrorObjEvalType).length === 0
    ) {
      // storing values in redux store
      dispatch(setJobData({ skills: selectedSkills }));
      // setting current step in record
      dispatch(setPreferanceSteps(preferenceCurrentStep + 1));
      // changing current step
      dispatch(setPreferanceCurrentSteps(preferenceCurrentStep + 1));
    }
  };

  // Expose a function to submit the form using the parent's ref
  useImperativeHandle(ref, () => ({
    submitForm: handleSubmit(onsubmit),
  }));

  // if data is present in redux then showing that when page loads
  useEffect(() => {
    if (jobData && jobData.skills) {
      setSelectedSkills(jobData.skills);
    }
  }, [jobData]);
  useEffect(() => {
    if (proficiencies.length === 0) {
      dispatch(fetchMasters());
    }
  }, [dispatch, proficiencies]);
  // adding of new skill to data base
  const handleAddNewSkill = async () => {
    const final_Value = {
      name: skillsValue,
      isActive: true,
    };
    setIsSubmitted(true);
    await dispatch(createNewSkill(final_Value));
    setIsSkillSubmitted(true);
    dispatch(setNewSkill(null));
  };
  // it will run after adding on newSkill
  useEffect(() => {
    if (isSkillSubmittd && error) {
      toast.error('Unable to add Skill', { variant: 'error' });

      setIsSkillSubmitted(false);
    }
    if (isSkillSubmittd && !error) {
      toast.success('Skill added Successfully', { variant: 'success' });

      setSkillsValue('');
      setIsSkillSubmitted(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSkillSubmittd, error, dispatch]);

  // it will add to jsx
  useEffect(() => {
    if (newSkill) {
      handleSkillsPush(newSkill);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newSkill]);

  return (
    <Box sx={{ pl: 3 }}>
      {/* skills select input */}
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item md={10}>
          <Autocomplete
            disablePortal
            sx={{
              '& + .MuiAutocomplete-popper': {
                display: isSubmitted ? 'none' : 'block',
              },
            }}
            noOptionsText={
              <>
                <ListItem style={{ pointerEvents: 'none' }}>No Skill found</ListItem>
                <ListItem
                  onClick={handleAddNewSkill}
                  sx={{
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'lightgray',
                    },
                  }}
                >
                  Create a new&nbsp;
                  <Typography variant="caption" style={{ color: 'blue', fontWeight: 'bold' }}>
                    {skillData === null && skillsValue.length > 0 && skillsValue}
                  </Typography>
                  &nbsp;Skill
                </ListItem>
              </>
            }
            options={skillData || []}
            disabled={
              individualJobPostData
                ? individualJobPostData?.status !== 2 && individualJobPostData?.status !== 1
                : false
            }
            onKeyUp={handleKeyUp}
            freeSolo={skillData !== null}
            value={skills}
            getOptionLabel={(option) => {
              if (option.name) return option.name;
              if (typeof option.name === 'string') return option.name;
              return '';
            }}
            filterOptions={(option) => option}
            onChange={(event, newValue) => handleSkillsChange(event, newValue)}
            placeholder="Search Skills"
            renderInput={(params) => <TextField {...params} label="Search Skills" />}
          />
        </Grid>
        <Grid item md={2}>
          <Button
            variant="contained"
            aria-label="two layers"
            onClick={() => handleSkillsPush(skills)}
            startIcon={<Icon icon="ic:round-add-box" />}
          >
            Add
          </Button>
        </Grid>
      </Grid>
      {/* selected skills */}

      <Form onSubmit={onsubmit}>
        {selectedSkills.length > 0 &&
          selectedSkills.map((item, index) => (
            <Grid
              key={index}
              container
              spacing={2}
              alignItems="center"
              justifyContent="flex-start"
              sx={{ mt: 3 }}
            >
              <Grid item md={5}>
                <Typography>{item.name}</Typography>
              </Grid>
              <Grid item md={5}>
                <Grid container spacing={2}>
                  <Grid item md={6}>
                    <Autocomplete
                      disableClearable
                      disabled={
                        individualJobPostData
                          ? individualJobPostData?.status !== 2 &&
                            individualJobPostData?.status !== 1
                          : false
                      }
                      options={proficiencies}
                      getOptionLabel={(option) => option.value}
                      value={proficiencies.find((level) => level.id === item.skillLevel) || null}
                      placeholder="Select Skill Level"
                      onChange={(event, newValue) => handleSkillLevelChange(event, newValue, index)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    {errorMessages[item.id] && (
                      <Typography variant="caption" color="error">
                        {errorMessages[item.id]}
                      </Typography>
                    )}
                  </Grid>
                  <Grid item md={6}>
                    <Autocomplete
                      disableClearable
                      disabled={
                        individualJobPostData
                          ? individualJobPostData?.status !== 2 &&
                            individualJobPostData?.status !== 1
                          : false
                      }
                      options={EvalType}
                      getOptionLabel={(option) => option.name}
                      value={
                        EvalType.find((level) => level.id === item.skillEvalType) || {
                          id: 1,
                          name: 'Verbal',
                        }
                      }
                      placeholder="Evaluation Type"
                      onChange={(event, newValue) => handleEventTypeChange(event, newValue, index)}
                      renderInput={(params) => <TextField {...params} />}
                    />
                    {errorMessageForEvalType[item.id] && (
                      <Typography variant="caption" color="error">
                        {errorMessageForEvalType[item.id]}
                      </Typography>
                    )}
                  </Grid>
                </Grid>
              </Grid>
              <Grid item md={2} sx={{ mb: errorMessages[item.id] && 2 }}>
                <IconButton
                  onClick={() => handleDeleteSkill(item.id)}
                  disabled={
                    individualJobPostData
                      ? individualJobPostData?.status !== 2 && individualJobPostData?.status !== 1
                      : false
                  }
                  sx={{
                    color: 'error',
                    cursor: individualJobPostData?.status === 2 ? 'not-allowed' : 'pointer',
                  }}
                >
                  <Icon icon="ic:twotone-delete" />
                </IconButton>
              </Grid>
            </Grid>
          ))}
      </Form>
    </Box>
  );
});
export default TechnicalSkills;
