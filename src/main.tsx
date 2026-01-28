// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux'; 
import { store } from './store/store';  

// Стили
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';

// Главный компонент-макет
import App from './App';

// Компоненты-страницы
import { HomePage } from './pages/HomePage';
import { LanguagesListPage } from './pages/LanguageListPage';
import { LanguageDetailPage } from './pages/LanguageDetailPage'; 

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
        <Provider store={store}> 
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="languages" element={<LanguagesListPage />} />
          <Route path="languages/:id" element={<LanguageDetailPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
        </Provider>

  </React.StrictMode>
);
