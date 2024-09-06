import { createBrowserRouter } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import QuizEditor from '../pages/QuizEditor';
import ProtectedRoute from '../components/ProtectedRoute';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/QuizEditor',
    element: (
      <ProtectedRoute>
        <QuizEditor />
      </ProtectedRoute>
    ),
  },
]);
