import PropTypes from 'prop-types';

import { Dialog, Typography } from '@mui/material';

// eslint-disable-next-line import/no-cycle
import AddCandidateModalTabs from './add-candidate-modal-tabs';

const AddCandidatesModal = ({ openAdd }) => (
  <div>
    <Dialog
      open={openAdd.value}
      onClose={openAdd.onFalse}
      PaperProps={{ sx: { borderRadius: 1, p: 3 } }}
    >
      <Typography variant="subtitle1">Invite Candidates</Typography>

      <AddCandidateModalTabs openAdd={openAdd} />
    </Dialog>
  </div>
);

export default AddCandidatesModal;

AddCandidatesModal.propTypes = {
  openAdd: PropTypes.any,
};
