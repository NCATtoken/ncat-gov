import Typography from "@material-ui/core/Typography";

// TODO: Web Design
function Message({message, success}) {
  return (
    <Typography variant="h6" color={success ? "primary" : "secondary"} gutterBottom>
      {message}
    </Typography>
  );
}
export default Message;
