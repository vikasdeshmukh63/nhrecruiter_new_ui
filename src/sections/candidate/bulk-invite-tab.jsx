import { Icon } from '@iconify/react';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Grid, Button, Typography } from '@mui/material';

import { useAuthContext } from 'src/auth/hooks';
import { uploadInviteFile, clearUploadFileResultState } from 'src/redux/slices/uploads';

// ! components
const BulkInviteTab = ({ openAdd }) => {
  // using useDispatch
  const dispatch = useDispatch();
  const { user } = useAuthContext();

  // states
  const [selectedFileName, setSelectedFileName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [customErrorObj, setCustomErrorObj] = useState(null);

  // extracting data from redux store
  const { uploadFileResult, error } = useSelector((state) => state.uploads);
  const { individualJobPostData } = useSelector((state) => state.jobpost);

  // function to handle file change
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setSelectedFileName(file.name);
    }
  };

  // funtion to handle closing modal along with clearing uploadFileResults
  const handleCloseModalWithClearData = () => {
    setCustomErrorObj(null);
    setSelectedFile(null);
    setSelectedFileName('');
    openAdd.onFalse();
    dispatch(clearUploadFileResultState());
  };

  // function to handle upload file
  const handleFileUpload = async () => {
    if (selectedFile) {
      await dispatch(uploadInviteFile(individualJobPostData?.Job_Id, selectedFile, user.userType));
    }
  };

  useEffect(() => {
    if (uploadFileResult) {
      setSelectedFileName(uploadFileResult?.data?.name);
      handleCloseModalWithClearData();
    } else {
      setCustomErrorObj('Something Went Wrong Please Try Again Later');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadFileResult]);

  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = '/assets/candidate_upload_list.xlsx';
    link.setAttribute('download', 'candidate_upload_list.xlsx');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };
  return (
    <Grid container spacing={2}>
      {/* description  */}
      <Grid item md={12}>
        <Typography>
          Now you can invite candidates for the Job Post from an excel file in single shot. Please
          download template file from
          <Button
            onClick={handleDownload}
            disableRipple
            style={{
              color: '#2196F3',
              border: 'none',
              background: 'none',
              cursor: 'pointer',
            }}
          >
            here.
          </Button>
        </Typography>
      </Grid>

      {/* file input  */}
      <Grid item md={12}>
        <label htmlFor="file-input">
          <Button
            variant="outlined"
            component="span"
            startIcon={<Icon icon="line-md:upload-loop" />}
            sx={{
              border: '2px dashed #919EAB',
              width: '100%',
              height: '100px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 3,
              mt: 4,
              cursor: 'pointer',
              alignSelf: 'center',
            }}
          >
            <input
              type="file"
              name="fileUpload"
              accept=".xlsx"
              style={{ display: 'none' }}
              onChange={handleFileChange}
              id="file-input"
            />
            Upload File
          </Button>
        </label>
      </Grid>

      {/* selected file name  */}
      {selectedFileName && (
        <Grid item md={12}>
          <Typography variant="caption">
            <b>{selectedFileName}</b> uploaded
          </Typography>
        </Grid>
      )}

      {/* custom error when error occured  */}
      <Grid item md={6}>
        {customErrorObj && error && (
          <>
            <Typography variant="caption" color="error">
              Cannot upload candidates
            </Typography>
            <Typography variant="caption" color="error">
              <ul>
                <li>
                  <Typography variant="caption" color="error">
                    {customErrorObj}
                  </Typography>
                </li>
              </ul>
            </Typography>
          </>
        )}
      </Grid>

      {/* action buttons  */}
      <Grid item md={12} display="flex" justifyContent="flex-end" alignItems="center" gap={3}>
        <Button variant="outlined" onClick={handleCloseModalWithClearData}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleFileUpload} disabled={!selectedFile}>
          Add Candidates
        </Button>
      </Grid>
    </Grid>
  );
};

export default BulkInviteTab;
