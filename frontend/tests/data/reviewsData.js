const reviewsData = {
  reviews: [
    {
      _id: "667441c68299324f52841998",
      author: "667441c68299324f52841987", // ObjectId of user3
      body: "These pancakes were awesome!",
      rating: 4,
      recipeId: "667441c68299324f52841990",
      __v: 0,
    },
    {
      _id: "667441c68299324f52841999",
      author: "667441c68299324f52841987", // ObjectId of user3
      body: "Delicious pizza, loved it!",
      rating: 5,
      recipeId: "667441c68299324f52841991",
      __v: 0,
    },
    {
      _id: "667441c68299324f5284199a",
      author: "667441c68299324f52841988", // ObjectId of user4
      body: "Fantastic chocolate cake recipe!",
      rating: 5,
      recipeId: "667441c68299324f52841992",
      __v: 0,
    },
    {
      _id: "667441c68299324f5284199c",
      author: "667441c68299324f52841989", // ObjectId of user5
      body: "Great pancakes, will make again!",
      rating: 4,
      recipeId: "667441c68299324f52841990",
      __v: 0,
    },
  ],

  newReview: {
    _id: "667441c68299324f5284199d",
    author: "667441c68299324f52841989", // ObjectId of user5
    body: "Delicious carbonara like my mom used to do",
    rating: 5,
    recipeId: "667441c68299324f52841993",
    __v: 0,
  },
  expectedNewReview: {
    author: {
      _id: "667441c68299324f52841989",
      username: "user5",
    },
    _id: "667441c68299324f5284199d",

    body: "Delicious carbonara like my mom used to do",
    rating: 5,
    recipeId: "667441c68299324f52841993",
    __v: 0,
  },
  expectedReviews: [
    {
      __v: 0,
      _id: "667441c68299324f52841998",
      author: {
        _id: "667441c68299324f52841987",
        username: "user3",
      },
      body: "These pancakes were awesome!",
      rating: 4,
      recipeId: "667441c68299324f52841990",
    },
    {
      __v: 0,
      _id: "667441c68299324f5284199c",
      author: {
        _id: "667441c68299324f52841989",
        username: "user5",
      },
      body: "Great pancakes, will make again!",
      rating: 4,
      recipeId: "667441c68299324f52841990",
    },
  ],
};

export default reviewsData;
