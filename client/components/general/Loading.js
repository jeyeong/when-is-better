import { CircularProgress } from '@mui/material';

const Loading = () => {
  return (
    <div
      style={{
        height: '100vh',
        width: '100%',
        display: 'grid',
        placeItems: 'center',
      }}
    >
      <CircularProgress color="success" />
    </div>
  );
};

export default Loading;
