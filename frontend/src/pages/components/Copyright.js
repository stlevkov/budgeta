import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";

function Copyright(props) {
  console.log("Copyright function loaded.");
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href="#">
        Bugeta App
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

export default Copyright;
