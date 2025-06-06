
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { LogOut, User, UserCog } from 'lucide-react';
import { Link } from 'react-router-dom';

const UserProfile: React.FC = () => {
  const { user, logout } = useAuth();

  if (!user) return null;

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
          <User className="h-4 w-4" />
        </div>
        <div className="text-sm font-medium">{user.name}</div>
      </div>
      <Link to="/profile">
        <Button variant="outline" size="sm" className="gap-2">
          <UserCog className="h-4 w-4" />
          Profile
        </Button>
      </Link>
      <Button variant="outline" size="sm" onClick={logout}>
        <LogOut className="h-4 w-4 mr-2" />
        Logout
      </Button>
    </div>
  );
};

export default UserProfile;
