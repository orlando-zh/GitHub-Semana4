import { useState,useEffect } from 'react'
import {io} from 'socket.io-client'
import {UlMensajes, LiMensaje} from './ui-components'
import './App.css'

const socket = io('http://localhost:3000')

function App() {

  const [isConnected,setIsConnected]=useState(false)

  const [nuevoMensaje,setNuevoMensaje]=useState('')

  const [mensajes,setMensajes]=useState([])


  useEffect(()=>{
    socket.on('connect', ()=> setIsConnected(true) )

      //CONEXIÓN PARA ENVIAR MENSAJE

    socket.on('chat_message', (data) =>{
      setMensajes(mensajes =>[...mensajes,data])
    })

    return () =>{
      socket.off('connect')
      socket.off('chat_message')
    }

  }, [])


  const enviarMensaje = ()=>{

    //EMITIR MENSAJE AL SERVIDOR

    socket.emit('chat_message',{

      usuario: socket.id,
      mensaje: nuevoMensaje
    })


  }

  return (
    <div className='App'>
      <h1>{isConnected ? 'CONECTADO': 'ERROR'}</h1>

      <UlMensajes>
        {mensajes.map(mensaje=>(
          <LiMensaje>{mensaje.usuario}{mensaje.mensaje}</LiMensaje>
        ))}
      </UlMensajes>
      <input
      onChange={e => setNuevoMensaje(e.target.value)}
      type="text" />

      <button onClick={enviarMensaje}>Enviar</button>
    </div>
  )
}

export default App
