const { response } = require('express')
const userCtrl = require('../controllers/user')
const axios = require('axios')
let ServiceRabbit = require("../services/rabbitmqPublisher");

exports.compile = async (req, res) => {
    ServiceRabbit.import_publish("start new compilation");
    const user = req.body.user
    const exoId = req.body.id
    const folderName = user.exercises[exoId].folderName
    const input = ""
    const language = req.body.language
    
    const changeIsSucceedPy = (data) => {
        if (data.err == true)
            {
                user.exercises[exoId].python.isSucceed = false
            }
        else 
            {
                const output = data.output.split(/\r\n|\r|\n/)

                let success = true
                output.forEach(element => {
                    if (element.startsWith("<FAILED::>")) {
                        success= false
                    }
                });
                user.exercises[exoId].python.isSucceed = success
            }
        }

    switch (language) {
        case "python":
        const code = user.exercises[exoId].python.defaultCode
        try {
            const response = await axios.post("https://py-compiler.herokuapp.com/python/compile",{
                'code': code,
                'exoId' : exoId,
                'folderName' : folderName
            })
            console.log(response.data)
            changeIsSucceedPy(response.data)
            userCtrl.updateUser(user, req.headers.authorization.split(' ')[1])
            res.send({isSucceed : user.exercises[exoId].python.isSucceed , ...response.data})

        } catch (error) {
            res.send(error)    
        }  
        break;
        case "javascript":
        const jscode = user.exercises[exoId].javascript.defaultCode 
        try {
            const response = await axios.post("https://js-compiler.herokuapp.com/javascript/compile",{
                'code': jscode,
                'exoId' : exoId,
                'folderName' : folderName
            }) 
            console.log(response.data)
            user.exercises[exoId].javascript.isSucceed=true
            userCtrl.updateUser(user, req.headers.authorization.split(' ')[1])
            res.send({isSucceed : user.exercises[exoId].javascript.isSucceed , ...response.data}) 
        } catch (error) {
            userCtrl.updateUser(user, req.headers.authorization.split(' ')[1])
            res.send(error)   
        }  
        break;
    }
}
