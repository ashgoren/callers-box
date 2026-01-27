import { Alert } from '@mui/material';

export const ErrorMessage = ({ error }: { error: unknown }) => (
  <Alert severity='error' sx={{ display: 'block', margin: 'auto', mt: 4 }}>
    Error loading programs: {(error as Error).message}
  </Alert>
);