import "./App.css";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Report from "./pages/Report";
import VisualizationForm from "./pages/VisualizationForm";
import Dashboard from "./pages/Dashboard";


function App() {

  const router = createBrowserRouter([
    {
      path: "/",
      element: <Dashboard />,
    },
    {
      path: "/visualization",
      element: <VisualizationForm />,
    },
    {
      path: "/report",
      element: <Report /> 
    },
    
  ])


  return (
    <>
    <RouterProvider router={router} /> 
    
    </>
  );
}

export default App;
