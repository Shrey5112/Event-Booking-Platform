import { useSelector } from 'react-redux'

import { type ReactNode } from 'react';

interface ThemeProviderProps {
  children: ReactNode;
}

const ThemeProvider = ({children}: ThemeProviderProps) => {
    const { theme } = useSelector((state: { theme: { theme: string } }) => state.theme)
  return (
    <div className={theme}>
      <div className='min-h-screen bg-gray-200 text-gray-800 dark:text-gray-200 dark:bg-[rgb(16,23,42)]'>
        {children}
      </div>
    </div>
  )
}

export default ThemeProvider