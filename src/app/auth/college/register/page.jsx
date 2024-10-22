import { OnboardForm } from 'src/sections/onboard/view';

// ----------------------------------------------------------------------

export const metadata = {
  title: 'College Onboard | NovelHire',
};

export default function OrganizationPage() {
  return <OnboardForm type="College" steps={['College', 'Admin', 'Confirm']} />;
}
