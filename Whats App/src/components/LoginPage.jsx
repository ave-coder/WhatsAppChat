import React from 'react';
import './LoginPage.css';


const LoginPage = (props) => {


    return (
        <div className="login-page">
            <div className="form">
                <form>
                    <label>
                        Логин:
                        <input type="text" placeholder="Введите idInstance" value={props.idInstance} onChange={e => props.setIdInstance(e.target.value)} />
                    </label>
                    <br />
                    <label>
                        Пароль:
                        <input type="text" placeholder="Введите apiTokenInstance" value={props.apiTokenInstance} onChange={e => props.setApiTokenInstance(e.target.value)} />
                    </label>
                    <br />
                    <button onClick={props.handleAuthorization}>Авторизоваться</button>
                </form>
            </div>
        </div>
    );
};

export default LoginPage;