import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { a11yDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { Button, Dialog, Typography } from '@mui/material';

const ViewCodingResponse = ({ openCodingResponse, codingData, setCodingData }) => {
  const handleClose = () => {
    openCodingResponse.onFalse();
    setCodingData(null);
  };
  return (
    <Dialog
      open={openCodingResponse.value}
      onClose={handleClose}
      PaperProps={{ sx: { borderRadius: 1, p: 3 } }}
    >
      <Typography variant="h5" mb={3}>
        Coding Response
      </Typography>

      <SyntaxHighlighter language="javascript" style={a11yDark}>
        {codingData.solution}
      </SyntaxHighlighter>

      <Button variant="contained" color="primary" onClick={handleClose}>
        Close
      </Button>
    </Dialog>
  );
};

export default ViewCodingResponse;
