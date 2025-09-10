import { useState } from 'react';

function useRememberEmail() {
  const email = localStorage.getItem('email') || '';
  const [isRemembered, setIsRemembered] = useState<boolean>(!!email);

  const toggleRemember = () => setIsRemembered((prev) => !prev);

  const handleRemember = (emailToSave: string) => {
    if (isRemembered && emailToSave) {
      localStorage.setItem('email', emailToSave);
    } else if (email) {
      localStorage.removeItem('email');
    }
  };

  return { email, isRemembered, toggleRemember, handleRemember };
}

export default useRememberEmail;
