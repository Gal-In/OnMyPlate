import React, { useState } from "react";
import { GoogleMapApiRes } from "../../Services/serverRequests";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Radio,
  RadioGroup,
} from "@mui/material";

type RestaurantSelectionDialogProps = {
  options: GoogleMapApiRes[];
  handleSelect: (selectedOption: GoogleMapApiRes) => void;
};

const RestaurantSelectionDialog = ({
  options,
  handleSelect,
}: RestaurantSelectionDialogProps) => {
  const [selectedOption, setSelectedOption] = useState<string | null>(null);

  const handleChange = (event: React.ChangeEvent<any>) => {
    setSelectedOption(event.target.value);
  };

  return (
    <Dialog open={true} dir="rtl">
      <DialogTitle>בחר מסעדה</DialogTitle>
      <DialogContent sx={{ padding: 4 }}>
        <RadioGroup value={selectedOption} onChange={handleChange}>
          {options.map((option) => (
            <FormControlLabel
              value={option.place_id}
              control={<Radio />}
              label={`${option.name} - ${option.formatted_address}`}
              key={option.place_id}
            />
          ))}
        </RadioGroup>
        <Button
          onClick={() =>
            handleSelect(
              options.find(({ place_id }) => selectedOption === place_id)!
            )
          }
          disabled={!selectedOption?.length}
        >
          בחר
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default RestaurantSelectionDialog;
