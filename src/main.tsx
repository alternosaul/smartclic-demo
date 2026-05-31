import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { LanguageProvider } from '@/i18n/LanguageProvider'
import { ThemeProvider } from '@/theme/ThemeProvider'
import { DemoPlaceholder } from '@/pages/DemoPlaceholder'
import './index.css'
import { initStoredSiteTheme } from '@/theme/themes'
import App from './App.tsx'

initStoredSiteTheme()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <Routes>
            <Route path="/" element={<App />} />
            <Route path="/demo" element={<DemoPlaceholder />} />
          </Routes>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  </StrictMode>,
)
