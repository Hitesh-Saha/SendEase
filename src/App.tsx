import "./App.css";
import { CssBaseline } from "@mui/material";
import Router from "./Router";


const App = () => {
  // const [peerId, setPeerId] = useState<string | null>(null);
  // const [file, setFile] = useState<File | null>(null);
  // const [reciever, setReciever] = useState<string | null>(null);
  // const connInstance = useRef<DataConnection | null>(null);
  // const peer = useRef<Peer | null>(null);
  // const [status, setStatus] = useState<string>("");

  // useEffect(() => {
  //   // Initialize PeerJS
  //   const peerInstance = new Peer();

  //   peerInstance.on("open", (id) => {
  //     setPeerId(id as string);
  //   });

  //   peerInstance.on("connection", (conn) => {
  //     conn.on("data", (data: any) => {
  //       if (typeof data === "string" && data.startsWith("peerId:")) {
  //         const senderPeerId = data.split(":")[1];
  //         setReciever(senderPeerId);
  //         setStatus(`Connected to peer: ${senderPeerId}`);
  //       } else {
  //         const blob = new Blob([data]);
  //         const url = URL.createObjectURL(blob);
  //         const a = document.createElement("a");
  //         a.href = url;
  //         a.download = "received-file";
  //         a.click();
  //         setStatus("File received successfully");
  //       }
  //     });
  //     connInstance.current = conn;
  //   });
  //   peer.current = peerInstance;

  //   return () => {
  //     peerInstance.destroy();
  //   };
  // }, []);

  // // Listen for incoming connections
  // // peer?.on("connection", (connection) => {
  // //   console.log("Incoming connection from " + connection);
  // //   setConn(connection as DataConnection);
  // // });

  // // conn?.on("data", (data) => {
  // //   console.log(data);
  // // });

  // // const addReciever = (e: { target: { value: string } }) => {
  // //   setReciever(e.target.value);
  // // };

  // const createConnection = () => {
  //   if (!peer.current || !reciever) return;

  //   const conn = peer.current?.connect(reciever);
  //   conn?.on("open", () => {
  //     conn.send(`peerId:${peerId}`);
  //     setStatus("Connected to peer");
  //   });
  //   connInstance.current = conn;
  // };

  // // Handle file input change
  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   if (event.target.files && event.target.files[0]) {
  //     setFile(event.target.files[0]);
  //   }
  // };

  // // Send file to connected peer
  // const sendFile = () => {
  //   if (connInstance.current && file) {
  //     connInstance.current.send(file);
  //     setStatus("File sent successfully");
  //     // const fileReader = new FileReader();

  //     // fileReader.onload = () => {
  //     //   const arrayBuffer = fileReader.result;
  //     //   if (arrayBuffer) {
  //     //     const uint8Array = new Uint8Array(arrayBuffer as ArrayBufferLike);
  //     //     conn.send(uint8Array);
  //     //   }
  //     // };

  //     // fileReader.readAsArrayBuffer(file);
  //   }
  // };

  return (
    <>
      <Router />
      <CssBaseline />
    </>
  );
};

export default App;
