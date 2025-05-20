const products = [
    {
      id: 1,
      title: "Coach Lol",
      price: 9.99,
      image: "/api/placeholder/200/200",
      category: "coach",
      quantity: 1,
      description: "Coach Lol"
    },
    {
      id: 2,
      title: "Coach DOTA",
      price: 12.99,
      image: "/api/placeholder/200/200",
      category: "coach",
      quantity: 1,
      description: "Coach DOTA"
    },
    {
      id: 3,
      title: "Coach CS:GO",
      price: 14.99,
      image: "/api/placeholder/200/200",
      category: "coach", 
      quantity: 1,
      description: "Coach CS:GO"
    },
    {
      id: 4,
      title: "EloBoost Bronze-Silver",
      price: 29.99,
      image: "/api/placeholder/200/200",
      category: "eloboost",
      quantity: 1,
      description: "EloBoost Bronze-Silver"
    },
    {
      id: 5,
      title: "EloBoost Silver-Gold",
      price: 39.99,
      image: "/api/placeholder/200/200",
      category: "eloboost",
      quantity: 1,
      description: "EloBoost Silver-Gold"
    },
    {
      id: 6,
      title: "EloBoost Gold-Platinum",
      price: 49.99,
      image: "/api/placeholder/200/200",
      category: "eloboost",
      quantity: 1,
      description: "EloBoost Gold-Platinum"
    },
    {
      id: 7,
      title: "EloBoost Platinum-Diamond",
      price: 79.99,
      image: "/api/placeholder/200/200",
      category: "eloboost",
      quantity: 1,
      description: "EloBoost Platinum-Diamond"
    },
    {
      id: 8,
      title: "EloBoost Diamond-Master",
      price: 129.99,
      image: "/api/placeholder/200/200",
      category: "eloboost",
      quantity: 1,
      description: "EloBoost Diamond-Master"
    }
  ];

  const cartProducts = products.filter(product => product.quantity > 0);
  
  export default products;
  export { cartProducts };

  