import { NavigateNext } from "@mui/icons-material";
import { Breadcrumbs, Grid, Link, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const BreadCrumb = () => {
  const location = useLocation();
  const [breadcrumbs, setBreadcrumbs] = useState<string>("");
  const [isHome, setIsHome] = useState<boolean>(true);

  useEffect(() => {
    if (location.pathname === "/") {
      setIsHome(true);
    } else {
      setIsHome(false);
    }
    if (location.pathname === "/sender") {
      setBreadcrumbs("Sender");
    } else if (location.pathname === "/receiver") {
      setBreadcrumbs("Reciever");
    }
  }, [location]);
  return (
    <>
      {!isHome && (
        <Grid item xs={12} paddingBottom={3}>
          <Breadcrumbs
            separator={<NavigateNext fontSize="small" />}
            aria-label="breadcrumb"
          >
            <Link underline="hover" key="1" color="inherit" href="/">
              Home
            </Link>
            <Typography key="2" color="text.primary">
              {breadcrumbs}
            </Typography>
          </Breadcrumbs>
        </Grid>
      )}
    </>
  );
};

export default BreadCrumb;
