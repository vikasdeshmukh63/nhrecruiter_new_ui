'use client';

import ScrollSpy from 'react-ui-scrollspy';
import { useRouter } from 'next/navigation';

import { Box, Card, List, Stack, Button, ListItemText, ListItemButton } from '@mui/material';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import ResumeDetails from './tabs/resume-details';
import WorkExperience from './tabs/work-experience';
import PersonalDetails from './tabs/personal-details';
import EducationDetails from './tabs/education-details';
import ProfessionalDetails from './tabs/professional-details';
import CertificationDetails from './tabs/certification-details';
import SocialProfilesDetails from './tabs/social-profiles-details';

const profileItems = [
  { id: 'resume', index: 0, title: 'Resume' },
  { id: 'personalDetails', index: 1, title: 'Personal Details' },
  { id: 'professionalDetails', index: 2, title: 'Professional Details' },
  { id: 'workExperience', index: 3, title: 'Work Experience' },
  { id: 'education', index: 4, title: 'Education' },
  { id: 'certification', index: 5, title: 'Certification' },
  { id: 'socialProfiles', index: 6, title: 'Social Profiles' },
];
const JobPostEditCandidate = () => {
  const router = useRouter();

  const onPress = (e) => {
    e.preventDefault();
    const target = document.getElementById(e.currentTarget.href.split('#')[1]);
    if (target) {
      const headerOffset = 20;
      const elementPosition = target.getBoundingClientRect().top;
      const offsetPosition = elementPosition - headerOffset;

      window.scrollBy({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };
  return (
    <DashboardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
      <Box>
        <Button
          onClick={() => {
            router.back();
          }}
          startIcon={<Iconify icon="weui:back-filled" />}
        >
          Back
        </Button>
        <Stack direction="row" spacing={1}>
          <Card sx={{ minWidth: 280, maxHeight: 'fit-content', position: 'sticky', top: 80 }}>
            <List sx={{ py: 0 }}>
              {profileItems.map((listItem) => (
                <ListItemButton
                  key={listItem.id}
                  onClick={onPress}
                  href={`#${listItem.id}`}
                  className="nav-link"
                  data-to-scrollspy-id={listItem.id}
                  sx={{
                    height: 50,
                  }}
                >
                  <ListItemText primary={listItem.title} />
                </ListItemButton>
              ))}
            </List>
          </Card>
          <Box sx={{ maxWidth: 'md' }}>
            <Stack spacing={2}>
              <ScrollSpy
                activeClass="active-section"
                offsetBottom={0}
                scrollThrottle={50}
                useBoxMethod
              >
                <Box id="resume">
                  <ResumeDetails />
                </Box>
                <Box my={2} id="personalDetails">
                  <PersonalDetails />
                </Box>
                <Box my={2} id="professionalDetails">
                  <ProfessionalDetails />
                </Box>
                <Box my={2} id="workExperience">
                  <WorkExperience />
                </Box>
                <Box my={2} id="education">
                  <EducationDetails />
                </Box>
                <Box my={2} id="certification">
                  <CertificationDetails />
                </Box>
                <Box my={2} id="socialProfiles">
                  <SocialProfilesDetails />
                </Box>
              </ScrollSpy>
            </Stack>
          </Box>
        </Stack>
      </Box>
    </DashboardContent>
  );
};

export default JobPostEditCandidate;
