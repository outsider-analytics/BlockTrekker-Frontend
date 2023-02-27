import { createUseStyles } from 'react-jss';
import { PuffLoader } from 'react-spinners';

const useStyles = createUseStyles({
  container: {
    alignItems: 'center',
    display: 'flex',
    height: 'calc(100vh - 144px)',
    flexDirection: 'column',
    gap: '24px',
    justifyContent: 'center',
  },
  text: {
    color: '#FCFCFC',
    fontSize: '48px',
  },
});

export default function QueryLoader(): JSX.Element {
  const styles = useStyles();
  return (
    <div className={styles.container}>
      <PuffLoader color='#5451FF' size={120} />
      <div className={styles.text}>Loading</div>
    </div>
  );
}
