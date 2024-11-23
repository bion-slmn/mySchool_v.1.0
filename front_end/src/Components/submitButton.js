import RotatingIcon from "./loadingIcon";

const SubmitButton = ({ text, isLoading }) => {
  return (
    <button type="submit" disabled={isLoading}>
      {isLoading ? <RotatingIcon /> : text}
    </button>
  );
};

export default SubmitButton;
