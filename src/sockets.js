import messageModel from "./dao/models/message.model.js"

export default (io) => {
    io.on("connection", async socket => {
        console.log('Cliente conectado...')
    

        socket.emit('alerta', 'Un nuevo usuario se ha conectado...')
    
        socket.on('productList', data => {
            io.emit('updatedProducts', data)
        })
    
        let messages = await messageModel.find().lean().exec()
        socket.emit("logs", messages)
    
        socket.on("message", async data => {
            await messageModel.create(data)
            let messages = await messageModel.find().lean().exec()
            io.emit("logs", messages)
        })
    })
}