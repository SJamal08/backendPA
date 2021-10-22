const userCtrl = require('../controllers/user')
const execute = require('../compile/compile')

exports.compile = (req, res) => {
    const user = req.body.user
    const exoId = req.body.id
    const code = user.exercises[exoId].defaultCode
    const input = ""
    
    const changeIsSucceed = (data) => {
        if (data.err == true)
            {
                user.exercises[exoId].isSucceed = false
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
                user.exercises[exoId].isSucceed = success
            }
    }

    return execute.pythonExecute(code, input, exoId)
        .then(data => {
            changeIsSucceed(data)

            res.json( {isSucceed : user.exercises[exoId].isSucceed , ...data})
        })
        .catch(err => {
            console.log("ERROR PROMISE " + err)
        })
        .finally(() => {
            userCtrl.updateUser(user, req.headers.authorization.split(' ')[1])
        })

}
