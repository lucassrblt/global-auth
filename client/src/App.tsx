import { BrowserRouter, Routes, Route } from "react-router";
import GlobalLayout from "./layout/globalLayout";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<GlobalLayout />} />
        <Route path="/signup" element={<GlobalLayout />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
