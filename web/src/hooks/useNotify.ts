import { useSnackbar } from "notistack";

export const useNotify = () => {
  const { enqueueSnackbar } = useSnackbar();

  return {
    success: (message: string) => enqueueSnackbar(message, { variant: 'success' }),
    info: (message: string) => enqueueSnackbar(message, { variant: 'info' }),
    error: (message: string) => enqueueSnackbar(message, {
      variant: 'error',
      anchorOrigin: { vertical: 'top', horizontal: 'center' } }
    )
  };
};
