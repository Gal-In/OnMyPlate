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

// type RestaurantSelectionDialogProps = {
//     options: GoogleMapApiRes[];
//     handleSelect: (selectedOption: GoogleMapApiRes) => void;
// };

const PostPage = () => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleChange = (event: React.ChangeEvent<any>) => {
        setSelectedOption(event.target.value);
    };

    return (
        <div>מסעדה</div>

    );
};

export default PostPage;
