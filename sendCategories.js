const sendCategories = (req, res) => {
  res.json({
    categoreis : [
      {
        "data" : [{
          "id" : 1,
          "name" : "콜드 브루 커피"
        }, {
          "id" : 2,
          "name" : "브루드 커피",
        }, {
          "id" : 3,
          "name" : "에스프레소",
        }, {
          "id" : 4,
          "name" : "프라푸치노",
        }, {
          "id" : 5,
          "name" : "블렌디드"
        }]
      }
    ],
  })
}

module.exports = { sendCategories }