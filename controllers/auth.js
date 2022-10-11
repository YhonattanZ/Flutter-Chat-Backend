const { response } = require("express");
const bcrypt = require('bcryptjs');
const Usuario = require('../models/usuario');
const { generarJWT } = require("../helpers/jwt");
const usuario = require("../models/usuario");

const crearUsuario = async (req, res = response) => { 

    const {email, password} = req.body;

    try{
    
    const existeEmail = await Usuario.findOne({email});    
    if(existeEmail){
        return res.status(400).json({
            ok:false,
            msg: 'El correo ya está registrado'
        })
    }

    const usuario = new Usuario(req.body)

    //Encriptar contraseña
    const salt = bcrypt.genSaltSync();
    usuario.password = bcrypt.hashSync(password, salt);


    await usuario.save();

    //Generar JWT
    const token = await generarJWT(usuario.id);

    res.json({
    ok:true,
    usuario,
    token
    
});
    }catch(error){
        console.log(error);
        res.status(500).json({
            ok:false,
            msg:'Hable con el administrador'
        });
    }

    

}

const login = async(req,res =response) => {

const{ email, password } = req.body;

    try{
        //Validar usuario
        const usuarioDb = await Usuario.findOne({email});
        if(!usuarioDb){
            return res.status(404).json({
                ok:false,
                msg: 'Email no encontrado'
            })
        }
        //Validar password
        const validPassword = bcrypt.compareSync(password, usuarioDb.password);
        if(!validPassword){
            return res.status(400).json({
                ok:false,
                msg:'La contraseña no es válida'
            });
        }
        //Generar el JWT    
        const token = await generarJWT(usuarioDb.id);
        res.json({
            ok:true,
            usuario: usuarioDb,
            token
            
        });

    }catch(error){
    console.log(error);
    return res.status(500).json({
        ok:false,
        msg:'Hable con el administrador'
    });
}
}

const renovarToken = async (req,res = response) =>{
    
    const uid = req.uid;
    const token = await generarJWT(uid);
    const usuario = await Usuario.findById(uid);

    res.json({
        ok:true,
        usuario, 
        token
            
    });
} 

module.exports ={
    crearUsuario, login, renovarToken 
}