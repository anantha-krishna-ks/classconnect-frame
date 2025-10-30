import { LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

const MainHeader = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/login');
  };

  return (
    <header className="border-b border-gray-100 px-6 py-3" style={{ backgroundColor: '#3B54A5' }}>
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <img 
          src="/lovable-uploads/saras-school-ai-logo.png" 
          alt="SarasSchoolAi" 
          className="h-12 w-auto"
        />
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 hover:text-white border border-white/20 hover:border-white/40 transition-all duration-200"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Confirm Logout</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to logout? You will be redirected to the login page.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleLogout} className="bg-red-600 hover:bg-red-700">
                Yes, Logout
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </header>
  );
};

export default MainHeader;