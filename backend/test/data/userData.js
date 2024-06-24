const usersData = {
  users: [
    {
      _id: '667441c68299324f52841985',
      email: 'user1@example.com',
      username: 'user1',
      password: 'Password1',
      role: 'user',
      savedRecipes: ['667441c68299324f52841992'],
      recipes: ['667441c68299324f52841990', '667441c68299324f52841991'],
      __v: 0,
    },
    {
      _id: '667441c68299324f52841986',
      email: 'user2@example.com',
      username: 'user2',
      password: 'Password2',
      role: 'admin',
      savedRecipes: [],
      recipes: ['667441c68299324f52841992', '667441c68299324f52841993'],
      __v: 0,
    },
    {
      _id: '667441c68299324f52841987',
      email: 'user3@example.com',
      username: 'user3',
      password: 'Password3',
      role: 'user',
      savedRecipes: ['667441c68299324f52841991'],
      recipes: [],
      __v: 0,
    },
    {
      _id: '667441c68299324f52841988',
      email: 'user4@example.com',
      username: 'user4',
      password: 'Password4',
      role: 'user',
      savedRecipes: ['667441c68299324f52841991', '667441c68299324f52841993'],
      recipes: [],
      __v: 0,
    },
    {
      _id: '667441c68299324f52841989',
      email: 'user5@example.com',
      username: 'user5',
      password: 'Password5',
      role: 'user',
      savedRecipes: [],
      recipes: [],
      __v: 0,
    },
  ],
  newUser: {
    email: 'user6@example.com',
    username: 'user6',
    password: 'Password6',
    role: 'user',
    savedRecipes: [],
    recipes: [],
  },
  expectedResults: {
    _id: '667441c68299324f52841985',
    email: 'user1@example.com',
    username: 'user1',
    role: 'user',
    savedRecipes: [
      {
        __v: 0,
        _id: '667441c68299324f52841992',
        author: '667441c68299324f52841986', // ObjectId of user2
        name: 'Chocolate Cake',
        imgUrl: 'https://example.com/chocolate-cake.jpg',
        description: 'Decadent chocolate cake recipe.',
        reviews: ['667441c68299324f5284199a'],
      },
    ],
    recipes: [
      {
        __v: 0,
        _id: '667441c68299324f52841990',
        author: '667441c68299324f52841985', // ObjectId of user1
        name: 'Delicious Pancakes',
        imgUrl: 'https://example.com/pancakes.jpg',
        description: 'A simple recipe for fluffy pancakes.',
        reviews: ['667441c68299324f52841998', '667441c68299324f5284199c'],
      },
      {
        __v: 0,
        _id: '667441c68299324f52841991',
        author: '667441c68299324f52841985', // ObjectId of user1
        name: 'Homemade Pizza',
        imgUrl: 'https://example.com/pizza.jpg',
        description: 'Make pizza at home with this easy recipe.',
        reviews: ['667441c68299324f52841999'],
      },
    ],
    __v: 0,
  },
};

export default usersData;
