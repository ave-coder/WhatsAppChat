import './App.css';
import { Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();
  const [idInstance, setIdInstance] = useState('');
  const [apiTokenInstance, setApiTokenInstance] = useState('');

  const handleAuthorization = async (e) => {
    e.preventDefault();
    try {
      // Отправляем запрос на получение настроек
      const response = await axios.get(`https://api.green-api.com/waInstance${idInstance}/GetSettings/${apiTokenInstance}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response);

      // Сравниваем с введенными значениями в поле авторизации
      if (response.data.wid) {
        navigate('/main')
        console.log('Авторизация успешна');
      } else {
        console.log('Ошибка авторизации');
      }
    } catch (error) {
      console.log('Ошибка авторизации');
    }
  };
  return (
    <>
      <Routes>
        <Route path='/main' element={<MainPage idInstance={idInstance} apiTokenInstance={apiTokenInstance} />} />
        <Route path='/' element={<LoginPage handleAuthorization={handleAuthorization} setApiTokenInstance={setApiTokenInstance} setIdInstance={setIdInstance} idInstance={idInstance} apiTokenInstance={apiTokenInstance} />} />
      </Routes>
    </>
  );
}

export default App;
