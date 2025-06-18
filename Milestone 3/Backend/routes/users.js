const express = require('express');
const User = require('../models/Users');
const router = express.Router();

// Rota POST para login de usuário
router.post('/login', async (req, res) => {
  try {
    const { email, senha } = req.body;

    // Verifica se email e senha foram fornecidos
    if (!email || !senha) {
      return res.status(400).json({ message: 'Email e senha são obrigatórios' });
    }

    // Normaliza email para busca no banco
    const normalizedEmail = email.trim().toLowerCase();

    // Busca usuário pelo email
    const user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Normaliza senha e compara com a armazenada
    const normalizedSenha = senha.trim();
    const storedSenha = user.senha.trim();

    if (normalizedSenha !== storedSenha) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }

    // Retorna dados do usuário e um token falso (para substituir por JWT depois)
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
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
});

// Rota POST para registrar novo usuário
router.post('/register', async (req, res) => {
  try {
    const { nome, email, senha, discord } = req.body;

    // Campos obrigatórios
    if (!nome || !email || !senha) {
      return res.status(400).json({ message: 'Nome, email e senha são obrigatórios' });
    }

    const normalizedEmail = email.trim().toLowerCase();

    // Verifica se usuário já existe
    const existingUser = await User.findOne({ email: normalizedEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'Usuário já existe com este email' });
    }

    // Gera próximo id (incremental)
    const lastUser = await User.findOne().sort({ id: -1 });
    const nextId = lastUser ? lastUser.id + 1 : 1;

    // Cria novo usuário e salva
    const newUser = new User({
      nome: nome.trim(),
      email: normalizedEmail,
      senha: senha.trim(),
      isAdmin: false,
      id: nextId,
      discord: discord ? discord.trim() : ''
    });

    await newUser.save();

    // Retorna dados do usuário criado
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
    res.status(500).json({ message: 'Erro interno do servidor', error: error.message });
  }
});

// Rota GET para obter usuário por id (senha excluída)
router.get('/user/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-senha');

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Retorna dados do usuário
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

// Rota GET para listar todos os usuários (sem senha)
router.get('/all', async (req, res) => {
  try {
    const users = await User.find().select('-senha');
    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
});

// Rota PUT para atualizar usuário por id
router.put('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    // Atualiza campos se fornecidos
    if (req.body.nome) user.nome = req.body.nome.trim();
    if (req.body.email) user.email = req.body.email.trim().toLowerCase();
    if (req.body.senha) user.senha = req.body.senha.trim();
    if (req.body.discord !== undefined) user.discord = req.body.discord.trim();
    if (req.body.isAdmin !== undefined) user.isAdmin = req.body.isAdmin;

    const updatedUser = await user.save();

    // Retorna dados atualizados
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

// Rota GET para profile (ainda não implementada, retorna 401)
router.get('/profile', async (req, res) => {
  try {
    res.status(401).json({ message: 'localstorage' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

module.exports = router;
