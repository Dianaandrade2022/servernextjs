"use client";
import { Stack, TextField, Typography, Button } from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
const socket = io("http://localhost:9001");
import {es} from 'date-fns/locale'
import { formatRelative, subDays } from "date-fns";

export default function Home() {
  const [message, setMessage] = useState("");

  // no se actualizará el estado por lo cual se elimina setId
  const [id] = useState(uuidv4());
  const [listmessage, setListMessage] = useState([]);
  const [fecha ] = useState([]);
  
  function handleclick() {
    const fecha =  formatRelative(subDays(new Date(), 0), new Date(), { locale: es })
    console.log(fecha);
    const text = message;
    socket.emit("newMessage", {
      id,
      message: text,
      fechamessage:fecha
    });
    setMessage("");
  } 

  useEffect(() => {
    socket.on("messages", (data) => {
      setListMessage((prevListMessages) =>
        prevListMessages.concat(data)
      );
    });
  }, []);

  return (
    <Stack
      sx={{
        height: "100%",
      }}
    >
      <Stack
        sx={{
          backgroundColor: "#EB1700",
          height: "60px",
          justifyContent: "center",
          alignItems: "center",
          flexShrink: 0,
        }}
        direction="row"
      >
        <Typography 
        sx={{
          color:"#fff",
          fontWeight:"bold",
          fontSize:"20px"
        }}
        >Chat Online</Typography>
        
      </Stack>

      <Stack
        sx={{
          backgroundColor: "#000",
          flexGrow: 1,
          paddingBlock: "10px",
        }}
        spacing={2}
      >
        {listmessage.map((item) => (
          <Stack
            sx={{
              maxWidth: "60%",
              minHeight: "30px",
              backgroundColor: "white",
              borderRadius: "15px",
              alignSelf: item.id === id ? "end" : "start",
              p: 1,
            }}
          >
            <Typography>{item.message}</Typography>
            <Typography
            sx={{
              alignSelf:"end",
              color:"gray",
              fontSize:9
            }}
            >{item.fechamessage}</Typography>
          </Stack>
        ))}
      </Stack>

      <Stack
        sx={{  
          height: "60px",
          alignItems: "center",
        }}
        direction="row"
        spacing={2}
      >
        <TextField
          variant="standard"
          fullWidth
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></TextField>

        <Button
          variant="contained"
          endIcon={<SendIcon />}
          onClick={handleclick}
        >
          send
        </Button>
      </Stack>
    </Stack>
  );
}
