import { OnboardForm } from "src/sections/onboard/view";


// ----------------------------------------------------------------------


export const metadata = {
  title: 'Organization Onboard | NovelHire',
};

export default function OrganizationPage() {
  return <OnboardForm type="Organization" steps={['Organization', 'Recruiter', 'Confirm']} />;
}
