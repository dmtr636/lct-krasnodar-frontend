import ReactDOM from "react-dom/client";
import axios from "axios";
import { App } from "src/App";

axios.defaults.withCredentials = true;

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(<App />);
