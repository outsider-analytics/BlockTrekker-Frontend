import { AuthedRoute } from 'components/AuthedRoute';
import {
  LoginLocation,
  RootLocation,
  QueryLocation,
  DashboardLocationTemplate,
} from 'locations';
import { createBrowserRouter } from 'react-router-dom';
import Dashboard from 'views/Dashboard';
import Home from 'views/Home';
import Login from 'views/Login';
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
