const express = require("express");
const router = express.Router();
const Product = require("../models/Products"); // Importa o modelo de produto

// GET /:id - Busca um produto específico pelo ID
router.get('/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }
        res.json(product);
    } catch (error) {
        console.error('Erro ao buscar produto:', error);
        res.status(500).json({ message: "ID inválido ou produto não encontrado" });
    }
});

// GET / - Retorna todos os produtos
router.get("/", async (req, res) => {
    try {
        const products = await Product.find();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// POST / - Cria um novo produto
router.post('/', async (req, res) => {
    try {
        const product = new Product(req.body); // Cria a instância com os dados enviados
        const newProduct = await product.save(); // Salva no banco
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({ message: error.message }); // Dados inválidos ou incompletos
    }
});

// PUT /:id - Atualiza um produto existente pelo ID
router.put('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id, 
            req.body, 
            { new: true, runValidators: true } // Retorna o novo objeto validado
        );

        if (!product) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }

        res.json(product);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// DELETE /:id - Remove um produto pelo ID
router.delete('/:id', async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);
        
        if (!product) {
            return res.status(404).json({ message: "Produto não encontrado" });
        }

        res.json({ message: "Produto deletado com sucesso" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Exporta o router para ser usado em outros arquivos (ex: app.js)
module.exports = router;
