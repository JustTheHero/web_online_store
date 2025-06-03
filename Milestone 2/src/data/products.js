const products = [
    {
      id: 1,
      title: "Coach Lol",
      price: 9.99,
      image: "../src/assets/logo_lol.png",
      category: "coach",
      quantity: 1,
      stock: 20, 
      description: "Coach Lol"
    },
    {
      id: 2,
      title: "Coach DOTA",
      price: 12.99,
      image: "../src/assets/dota.png",
      category: "coach",
      quantity: 1,
      stock: 10,
      description: "Coach DOTA"
    },
    {
      id: 3,
      title: "Coach CS:GO",
      price: 14.99,
      image: "../src/assets/cs.png",
      category: "coach", 
      quantity: 1,
      stock: 15,
      description: "Coach CS:GO"
    },
    {
      id: 4,
      title: "EloBoost Bronze-Silver",
      price: 29.99,
      image: "../src/assets/elo.jpeg",
      category: "eloboost",
      quantity: 1,
      stock: 25,
      description: "EloBoost Bronze-Silver"
    },
    {
      id: 5,
      title: "EloBoost Silver-Gold",
      price: 39.99,
      image: "../src/assets/elo.jpeg",
      category: "eloboost",
      quantity: 1,
      stock: 30,
      description: "EloBoost Silver-Gold"
    },
    {
      id: 6,
      title: "EloBoost Gold-Platinum",
      price: 49.99,
      image: "../src/assets/elo.jpeg",
      category: "eloboost",
      quantity: 1,
      stock: 20,
      description: "EloBoost Gold-Platinum"
    },
    {
      id: 7,
      title: "EloBoost Platinum-Diamond",
      price: 79.99,
      image: "../src/assets/elo.jpeg",
      category: "eloboost",
      quantity: 1,
      stock: 15,
      description: "EloBoost Platinum-Diamond"
    },
    {
      id: 8,
      title: "EloBoost Diamond-Master",
      price: 129.99,
      image: "../src/assets/elo.jpeg",
      category: "eloboost",
      quantity: 1,
      stock: 40,
      description: "EloBoost Diamond-Master"
    },
    {
      id: 9,
      title: "Smurf Account all Champions",
      price: 19.99,
      image: "../src/assets/lol.jpg",
      category: "account",
      quantity: 1,
      stock: 25,
      description: "Smurf Account with all Champions"
    },
    {
      id: 10,
      title: "Smurf Account Handleveled",
      price: 59.99,
      image: "../src/assets/lol.jpg",
      category: "account",
      quantity: 1,
      stock: 30,
      description: "Smurf Account handleveled to level 30"
    },
    {
      id: 11,
      title: "Smurf Account Bot Leveled",
      price: 9.99,
      image: "../src/assets/lol.jpg",
      category: "account",
      quantity: 1,
      stock: 20,
      description: "Smurf Account leveled by bot to level 30"
    },
    {
      id: 12,
      title: "Smurf Account Iron IV 0 LP",
      price: 49.99,
      image: "../src/assets/lol.jpg",
      category: "account",
      quantity: 1,
      stock: 15,
      description: "Smurf Account Iron IV 0 LP ranking"
    }
  ];

  const cartProducts = products.filter(product => product.quantity > 0);
  
  export default products;
  export { cartProducts };

  