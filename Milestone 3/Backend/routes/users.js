const express = require('express');
const User = require('../models/Users');
const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ 
        message: 'Email e senha são obrigatórios' 
      });
    }

    const normalizedEmail = email.trim().toLowerCase();
    
    const user = await User.findOne({ email: normalizedEmail });
    
    if (!user) {
      return res.status(401).json({ 
        message: 'Credenciais inválidas' 
      });
    }

    const normalizedSenha = senha.trim();
    const storedSenha = user.senha.trim();
    
    if (normalizedSenha !== storedSenha) {
      return res.status(401).json({ 
        message: 'Credenciais inválidas' 
      });
    }
    
    res.json({
      message: 'Login realizado com sucesso',
      token: 'fake-token',
      user: {
        id: user._id,
        nome: user.nome,
        email: user.email,
        isAdmin: user.isAdmin || false,
        discord: user.discord || ''
      }
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: error.message 
    });
  }
});

router.post('/register', async (req, res) => {
  try {
    
    const { nome, email, senha, discord } = req.body;

    if (!nome || !email || !senha) {
      return res.status(400).json({ 
        message: 'Nome, email e senha são obrigatórios' 
      });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const existingUser = await User.findOne({ email: normalizedEmail });
    
    if (existingUser) {
      return res.status(400).json({ 
        message: 'Usuário já existe com este email' 
      });
    }

    const lastUser = await User.findOne().sort({ id: -1 });
    const nextId = lastUser ? lastUser.id + 1 : 1;

    const newUser = new User({
      nome: nome.trim(),
      email: normalizedEmail,
      senha: senha.trim(),
      isAdmin: false,
      id: nextId,
      discord: discord ? discord.trim() : ''
    });

    await newUser.save();

    res.status(201).json({
      message: 'Usuário criado com sucesso',
      user: {
        id: newUser._id,
        nome: newUser.nome,
        email: newUser.email,
        isAdmin: newUser.isAdmin,
        discord: newUser.discord
      }
    });

  } catch (error) {
    console.error('Erro no registro:', error);
    res.status(500).json({ 
      message: 'Erro interno do servidor',
      error: error.message 
    });
  }
});

router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-senha');
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json({
      id: user._id,
      nome: user.nome,
      email: user.email,
      isAdmin: user.isAdmin || false,
      discord: user.discord || ''
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.get('/all', async (req, res) => {
  try {
    const users = await User.find().select('-senha');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

router.put('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }

        if (req.body.nome) user.nome = req.body.nome.trim();
        if (req.body.email) user.email = req.body.email.trim().toLowerCase();
        if (req.body.senha) user.senha = req.body.senha.trim();
        if (req.body.discord !== undefined) user.discord = req.body.discord.trim();
        if (req.body.isAdmin !== undefined) user.isAdmin = req.body.isAdmin;

        const updatedUser = await user.save();
        
        res.json({
            id: updatedUser._id,
            nome: updatedUser.nome,
            email: updatedUser.email,
            isAdmin: updatedUser.isAdmin,
            discord: updatedUser.discord
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
});
router.get('/profile', async (req, res) => {
  try {
    res.status(401).json({ 
      message: 'localstorage' 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;