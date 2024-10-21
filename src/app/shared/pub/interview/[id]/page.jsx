import { CandidateScoreView } from 'src/sections/candidate-score/view';

export const metadata = {
  title: 'Candidate Score | NovelHire',
};

export default function CandidateScorePage({ params }) {
  const { id } = params;

  return <CandidateScoreView id={id} />;
}
