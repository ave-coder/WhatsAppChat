import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './MainPage.css';

const MainPage = (props) => {
    const [dialogs, setDialogs] = useState([
        // Здесь хранится список диалогов, начальное значение пусто
    ]);
    const [setIsAddingDialog] = useState(false);
    const [newDialogNumber, setNewDialogNumber] = useState('');
    const [newMessageText, setNewMessageText] = useState('');
    const [receiptId, setReceiptId] = useState('');

    // Обработчик нажатия кнопки добавления нового диалога
    const handleAddDialogClick = () => {
        setIsAddingDialog(true);
    };

    // Обработчик нажатия кнопки ОК в окне ввода номера
    const handleNewNumberSubmit = () => {
        // Создаем новый диалог с введенным номером телефона и добавляем его в список
        const newDialog = {
            phone: newDialogNumber,
            messages: [],
            lastMessageDate: null,
        };
        setDialogs([...dialogs, newDialog]);

        // Скрываем окно ввода номера
        setIsAddingDialog(false);
        setNewDialogNumber('');
    };

    // Функция отправки сообщения
    const handleSendMessage = async () => {
        try {
            // Отправляем POST запрос с заголовком Content-Type: application/json
            const response = await axios.post(`https://api.green-api.com/waInstance${props.idInstance}/SendMessage/${props.apiTokenInstance}`, {
                chatId: `${dialogs[0].phone}@c.us`, // Сюда нужно подставить нужный chatId
                message: newMessageText,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            // dialogs[0].messages.push(newMessageText)
            dialogs[0].messages.push({
                text: newMessageText,
                from: 'outgoing'
            })
            console.log('Сообщение отправлено:', response.data);

            // Очищаем введенный текст
            setNewMessageText('');
        } catch (error) {
            console.log('Ошибка при отправке сообщения:', error);
        }
    };

    // Функция получения сообщения 
    const handleReceiveNotification = async () => {
        try {
            const response = await axios.get(`https://api.green-api.com/waInstance${props.idInstance}/ReceiveNotification/${props.apiTokenInstance}`);
            const notification = response.data;

            console.log('Получено уведомление:', notification);

            if (notification.body.messageData) {
                const message = notification.body.messageData.textMessageData?.textMessage;
                const chatId = notification.body.senderData.chatId;

                const dialogIndex = dialogs.findIndex(dialog => {
                    return `${dialog.phone}@c.us` === chatId
                });

                if (dialogIndex >= 0 && message) {
                    const updatedDialogs = [...dialogs];
                    // updatedDialogs[dialogIndex].messages.push(message);
                    updatedDialogs[dialogIndex].messages.push({
                        text: message,
                        from: 'incoming'
                    })
                    setDialogs(updatedDialogs);
                }
            }

            setReceiptId(notification.receiptId);
            handleDeleteNotification(notification.receiptId);
        } catch (error) {
            console.log('Ошибка при получении уведомления:', error);
        }
    };

    // Функция удаления сообщения из очереди уведомлений
    const handleDeleteNotification = async (id) => {
        try {
            if (!id) {
                console.log('Нет receiptId для удаления уведомления');
                return;
            }
            await axios.delete(`https://api.green-api.com/waInstance${props.idInstance}/DeleteNotification/${props.apiTokenInstance}/${id}`);
            console.log('Уведомление удалено:', id);
            setReceiptId('');
        } catch (error) {
            console.log('Ошибка при удалении уведомления:', error);
        }
    };

    useEffect(() => { console.log(dialogs) }, [dialogs])

    return (
        <div className="container">
            <div className="messaging">
                <div className="inbox_msg">
                    <div className="inbox_people">
                        <div className="headind_srch">
                            <div className="new_dialog" onClick={handleAddDialogClick}>
                                <div className="chat_ib">
                                    <h5>Добавить нового собеседника</h5>
                                    <input type="text" value={newDialogNumber} onChange={e => setNewDialogNumber(e.target.value)} />
                                    <button onClick={handleNewNumberSubmit}>OK</button>
                                    <button className="chat_btn" onClick={handleReceiveNotification}>Получить уведомление</button>
                                </div>
                            </div>
                        </div>
                        {/* Отображаем список диалогов */}
                        {dialogs.map(dialog => (
                            <div className="chat_list">
                                <div className="chat_people">
                                    <div className="chat_img">
                                        <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" />
                                    </div>
                                    <div className="chat_ib">
                                        <h5>{dialog.phone}<span className="chat_date">{dialog.lastMessageDate}</span></h5>
                                        <p>{dialog.messages.length > 0 ? dialog.messages[dialog.messages.length - 1].text : 'Нет сообщений'}</p>
                                    </div>
                                </div>
                            </div>
                        ))}
                        <div className="inbox_chat">
                            <div className="chat_list active_chat">
                                <div className="chat_people">
                                    <div className="chat_img"> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
                                    <div className="chat_ib">
                                        <h5>Неизвестный пользователь</h5>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* Отображаем окно диалога */}
                    <div className="mesgs">
                        <div className="msg_history">
                            {dialogs.map(dialog => dialog.messages.map(message => (
                                <div>
                                    <div className={`${message.from === 'outgoing' ? 'outgoing' : 'incoming'} incoming_msg_img`}> <img src="https://ptetutorials.com/images/user-profile.png" alt="sunil" /> </div>
                                    <div className="received_msg">
                                        <div className={message.from === 'outgoing' ? 'outgoing' : 'incoming'}>
                                            <p>{message.text}</p>
                                        </div>
                                    </div>
                                </div>
                            )))}
                        </div>
                        <div className="type_msg">
                            <div className="input_msg_write">
                                <input type="text" className="write_msg" placeholder="Введите сообщение..." value={newMessageText} onChange={e => setNewMessageText(e.target.value)} />
                                <button className="msg_send_btn" type="button" onClick={handleSendMessage}><i className="fa fa-paper-plane-o" aria-hidden="true" /></button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MainPage  
