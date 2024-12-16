import RotatingIcon from "./loadingIcon";
import Button from 'react-bootstrap/Button';

const SubmitButton = ({ text, isLoading }) => {
  return (
    <Button variant="primary" type="submit">
    {isLoading ? <RotatingIcon /> : text}
  </Button>
  );
};


export default SubmitButton;