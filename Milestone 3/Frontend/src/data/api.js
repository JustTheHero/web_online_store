// URL base da API
const API_BASE_URL = 'https://web-backend-owo8.onrender.com/api';

// Classe para centralizar as requisições à API
class ApiService {
  // Método genérico para realizar requisições
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      const data = await response.json();
      
      // Trata erro de resposta
      if (!response.ok) {
        throw new Error(data.error || 'Error in request');
      }

      return data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // --- Requisições relacionadas a usuários ---
  async getUsuarios() {
    return this.request('/usuarios');
  }

  async getUsuario(id) {
    return this.request(`/usuarios/${id}`);
  }

  async criarUsuario(dados) {
    return this.request('/usuarios', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  }

  async atualizarUsuario(id, dados) {
    return this.request(`/usuarios/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  }

  async deletarUsuario(id) {
    return this.request(`/usuarios/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Requisições relacionadas a produtos ---
  async getProducts() {
    return this.request('/products');
  }

  async getProduct(id) {
    return this.request(`/products/${id}`);
  }

  async criarProduto(dados) {
    return this.request('/products', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  }

  async atualizarProduto(id, dados) {
    return this.request(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  }

  async deletarProduto(id) {
    return this.request(`/products/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Requisições relacionadas a avaliações ---
  async getReviews() {
    return this.request('/reviews');
  }

  async getReview(id) {
    return this.request(`/reviews/${id}`);
  }

  async criarReview(dados) {
    return this.request('/reviews', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  }

  async atualizarReview(id, dados) {
    return this.request(`/reviews/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  }

  async deletarReview(id) {
    return this.request(`/reviews/${id}`, {
      method: 'DELETE',
    });
  }

  // --- Requisições relacionadas a vendas ---
  async getSales() {
    return this.request('/sales');
  }

  async getSale(id) {
    return this.request(`/sales/${id}`);
  }

  async criarSale(dados) {
    return this.request('/sales', {
      method: 'POST',
      body: JSON.stringify(dados),
    });
  }

  async atualizarSale(id, dados) {
    return this.request(`/sales/${id}`, {
      method: 'PUT',
      body: JSON.stringify(dados),
    });
  }

  async deletarSale(id) {
    return this.request(`/sales/${id}`, {
      method: 'DELETE',
    });
  }
}

// Exporta instância única da classe
export default new ApiService();
