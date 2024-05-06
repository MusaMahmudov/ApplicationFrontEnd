import { QueryClient, QueryClientProvider } from "react-query";
import "./App.css";

import { MyRoutes } from "./Routes/Routes";

function App() {
  const client = new QueryClient();
  return (
    <div className="App">
      <QueryClientProvider client={client}>
        <MyRoutes />
      </QueryClientProvider>
    </div>
  );
}

export default App;
