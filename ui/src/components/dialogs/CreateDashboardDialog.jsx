import { useState, useContext, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import { SettingContext } from '../../utils/AppUtil';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import { toast } from "material-react-toastify";
import RestClient from "../../api/RestClient";
import config from "../../resources/config";

export default function CreateDashboardDialog() {
  const settingState = useContext(SettingContext);
  const [open, setOpen] = useState(false);
  const restClient = new RestClient(config.api.settingsEndpoint);
  const [setting, setSetting] = useState({});

  const handleClose = () => {
    console.log('[CreateDashboardDialog] Creating new dashboard..');
    settingState.createInitDashboard((data)=>{
      console.log('data setting: ', data)
      console.log('[CreateDashboardDialog] Dashboard created! can close the dialog.');
      setSetting({data});
      toast.info("Init dashboard created");
      setOpen(false);
      window.location.reload();
    });
  };

  // TODO change with settingState
  useEffect(() => {
    console.log("[App][UseEffect] Initializing Component.");
    restClient.genericFetch().then((data) => {
      console.log('[App][UseEffect] data setting: ', data);
      setSetting(data);
      if(!data.initialized){
        setOpen(true);
      }
    }).catch((error) => {
      console.error('[App][UseEffect] data setting error: ', error);
      setSetting({});
    });
  }, []);

  return (
    <div>
      <Dialog open={open}>
        <DialogTitle>Initial Setup</DialogTitle>
        <DialogContent>
          <DialogContentText>Welcome to Budgeta. Seems like you are here for the first time.
            Let's begin by creating your first dashboard to effectively manage and analyze your financial data.
          </DialogContentText>

        </DialogContent>
        <DialogActions>
          <Button variant="outlined" startIcon={<DashboardCustomizeIcon />} onClick={handleClose}>
            Create Dashboard
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}