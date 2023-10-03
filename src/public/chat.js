
Swal.fire({
    title: 'Bienvenido al chatbot',
    input: 'text',
    text: 'ingrese su nombre de usuario',
    inputValidator: value => {
        return !value.trim() && 'Porfavor, ingrese un nombre de usuario'
    },
    allowOutsideClick: false 
}).then(result => {
    let user = result.value
    document.getElementById('username').innerHTML = user
    let socket = io()

    let chatbox = document.getElementById('chatbox')
    chatbox.addEventListener('keyup', e => {
        if (e.key === 'Enter') {
            if (chatbox.value.trim().length > 0){
                socket.emit('message', {
                    user, 
                    message: chatbox.value
                })
                chatbox.value = ''
            }
        }
    })
    socket.on('logs', data => {
        const divLogs = document.getElementById('messagesLogs')
        let messages = ''
        data.reverse().forEach(message => {
            messages += `<p><i>${message.user}</i>: ${message.message}</p>`
        })
        divLogs.innerHTML = messages
    })

    socket.on('alerta', () => {
        alert('Un nuevo usuario se ha conectado...')
    })
})

