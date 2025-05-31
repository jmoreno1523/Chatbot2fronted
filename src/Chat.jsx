import React, { useState, useEffect, useRef } from 'react';
import './Chat.css';

function Chat({usuario}) {
  const [messages, setMessages] = useState([]); // Mensajes con sender y text
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '') return;

    // Añadimos mensaje usuario a UI
    const newUserMessage = { sender: 'user', text: input };
    const newMessages = [...messages, newUserMessage];
    setMessages(newMessages);
    setInput('');

    try {
      // Filtrar mensajes que tienen texto válido y crear formato OpenAI
      const historialOpenAI = newMessages
        .filter(msg => msg.text && typeof msg.text === 'string' && msg.text.trim() !== '')
        .map(msg => ({
          role: msg.sender === 'user' ? 'user' : 'assistant',
          content: msg.text.trim()
        }));

      // Enviar historial al backend
      const response = await fetch('http://localhost:3000/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ historial: historialOpenAI, usuario: usuario.nombre }),
      });

      if (!response.ok) throw new Error('Error en la respuesta del servidor');

      const data = await response.json();
      // Añadir respuesta bot a UI
      const botMessage = { sender: 'bot', text: data.respuesta };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      const errorMessage = { sender: 'bot', text: 'Error al conectar con el servidor.' };
      setMessages(prev => [...prev, errorMessage]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div className="chat-container">
      <h2>Chat Deportivo</h2>
      <div className="chat-box">
        {messages.map((msg, index) => (
          <div key={index} className={msg.sender === 'user' ? 'user-msg' : 'bot-msg'}>
            <strong>{msg.sender === 'user' ? 'Tú:' : 'Bot:'}</strong> {msg.text}
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="chat-input">
        <input
          type="text"
          placeholder="Escribe tu pregunta..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button onClick={handleSend}>Enviar</button>
      </div>
    </div>
  );
}

export default Chat;
