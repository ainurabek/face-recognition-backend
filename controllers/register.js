

const handleRegister = (req, res, db, bcrypt) =>{
    const { email, password, name} = req.body;
    if (!email || !password || !name){
        return res.status(400).json('incorrect submission')
    }
    const hash = bcrypt.hashSync(password);
        db.transaction(trx=>{
            trx.insert({
                hash:hash,
                email:email
            }).into('login')
            .returning('email')  
            .then(loginEmail =>{
                return trx('users')
                .returning('*')
                .insert({
                    name: name,       
                    email:loginEmail[0],       
                    time: new Date()       
                }).then(data =>{
                    res.json(data[0]);
                })

            })
            .then(trx.commit)
            .then(trx.rollback)
    })
    .catch(err => res.status(400).json('inable to register'))    
}

module.exports = {
    handleRegister: handleRegister
};