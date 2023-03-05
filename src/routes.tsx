import { AuthedRoute } from 'components/AuthedRoute';
import {
  LoginLocation,
  RootLocation,
  QueryLocation,
  DashboardLocationTemplate,
  EndpointsLocation,
  MarketLocation,
} from 'locations';
import { createBrowserRouter } from 'react-router-dom';
import Dashboard from 'views/Dashboard';
import Endpoints from 'views/Endpoints';
import Home from 'views/Home';
import Login from 'views/Login';
import Market from 'views/Market';
import Query from 'views/Query';

const router = createBrowserRouter([
  {
    path: LoginLocation,
    element: <Login />,
  },
  {
    path: RootLocation,
    element: (
      <AuthedRoute>
        <Home />
      </AuthedRoute>
    ),
  },
  {
    path: DashboardLocationTemplate,
    element: (
      <AuthedRoute>
        <Dashboard />
      </AuthedRoute>
    ),
  },
  {
    path: EndpointsLocation,
    element: (
      <AuthedRoute>
        <Endpoints />
      </AuthedRoute>
    ),
  },
  {
    path: MarketLocation,
    element: (
      <AuthedRoute>
        <Market />
      </AuthedRoute>
    ),
  },
  {
    path: QueryLocation,
    element: (
      <AuthedRoute>
        <Query />
      </AuthedRoute>
    ),
    children: [
      {
        path: ':id',
        element: <Query />,
      },
    ],
  },
]);

export default router;
