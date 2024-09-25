type ButtonProps = {
    to: string,
    nav: Function
  }
import { FC } from 'react';
import { CalendarDays } from "lucide-react";
import { Button } from '@/components/ui/button';


const CalendarNavButton: FC<ButtonProps> = ({ to, nav }) => {
    const handleCalendarClick = () => {
      const input = document.createElement('input');
      input.type = 'date';
      input.style.display = 'none';
      document.body.appendChild(input);
  
      input.addEventListener('change', (e) => {
        const target = e.target as HTMLInputElement;
        const date = target.value;
        // alert(`Selected date: ${date}`);
        document.body.removeChild(input);
  
        nav(`${to}/${date}`);
      });
  
      input.showPicker();
    };
  
    return (
      <Button
        className="cursor-pointer"
        onClick={handleCalendarClick}
        // variant="outline"
        size="sm"
        aria-label="Open calendar"
      >
        <CalendarDays className="h-6 w-6 text-blue-500" />
      </Button>
    );
};

export default CalendarNavButton;