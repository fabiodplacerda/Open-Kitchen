const recipesData = {
  recipes: [
    {
      _id: '667441c68299324f52841990',
      author: '667441c68299324f52841985', // ObjectId of user1
      name: 'Delicious Pancakes',
      imgUrl: 'https://example.com/pancakes.jpg',
      description: 'A simple recipe for fluffy pancakes.',
      reviews: ['667441c68299324f52841998', '667441c68299324f5284199c'],
      __v: 0,
    },
    {
      _id: '667441c68299324f52841991',
      author: '667441c68299324f52841985', // ObjectId of user1
      name: 'Homemade Pizza',
      imgUrl: 'https://example.com/pizza.jpg',
      description: 'Make pizza at home with this easy recipe.',
      reviews: ['667441c68299324f52841999'],
      __v: 0,
    },
    {
      _id: '667441c68299324f52841992',
      author: '667441c68299324f52841986', // ObjectId of user2
      name: 'Chocolate Cake',
      imgUrl: 'https://example.com/chocolate-cake.jpg',
      description: 'Decadent chocolate cake recipe.',
      reviews: ['667441c68299324f5284199a'],
      __v: 0,
    },
    {
      _id: '667441c68299324f52841993',
      author: '667441c68299324f52841986', // ObjectId of user2
      name: 'Spaghetti Carbonara',
      imgUrl: 'https://example.com/spaghetti-carbonara.jpg',
      description: 'Classic Italian pasta dish.',
      reviews: ['667441c68299324f5284199b'],
      __v: 0,
    },
  ],
  newRecipe: {
    _id: '667441c68299324f52841994',
    author: '667441c68299324f52841988',
    name: 'Peperoni Pizza',
    imgUrl: 'https://example.com/peperoni-pizza.jpg',
    description:
      'Make pizza at home with this easy recipe. Enjoy a delicious homemade pizza with a crispy crust, tangy tomato sauce, melted cheese, and your favorite toppings. Perfect for family dinners or a fun cooking activity.',
    reviews: [],
    __v: 0,
  },
};

export default recipesData;
