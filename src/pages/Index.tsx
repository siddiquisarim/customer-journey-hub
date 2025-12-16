import { useAuth } from '@/context/AuthContext';
import { Navigate } from 'react-router-dom';
import Products from './Products';

const Index = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Products />;
};

export default Index;
