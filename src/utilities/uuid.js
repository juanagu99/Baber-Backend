const { v4: uuidv4 } = require('uuid')

// genera un codigo uuid y retorna el primer conjunto separado por - 
exports.generateCode = () => {
    return uuidv4().split('-')[0]
}