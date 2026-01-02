import { Routes, Route } from "react-router-dom";
import { HomePage } from "./routes/HomePage.tsx";


export const AppRouter = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<HomePage/>}
      />
    </Routes>
  );
};
