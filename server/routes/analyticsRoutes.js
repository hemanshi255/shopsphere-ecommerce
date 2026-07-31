const express = require("express");
const router = express.Router();

const Order = require("../models/order");
const { protect } = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");


router.get(
"/sales",
protect,
adminMiddleware,
async(req,res)=>{

try{

const sales = await Order.aggregate([
{
$match:{
status:{
$ne:"Cancelled"
}
}
},
{
$group:{
_id:{
month:{
$month:"$createdAt"
}
},
totalSales:{
$sum:"$totalAmount"
}
}
}
]);



const monthlySales = Array.from({length:12},(_,index)=>{

const monthData = sales.find(
(item)=> item._id.month === index + 1
);


return {

month:index + 1,

totalSales: monthData 
? monthData.totalSales 
: 0

};


});


res.json(monthlySales);




}catch(error){

res.status(500).json({
message:error.message
})

}

})

router.get(
  "/order-status",
  protect,
  adminMiddleware,
  async (req, res) => {
    try {
      const statusData = await Order.aggregate([
        {
          $group: {
            _id: "$status",
            value: { $sum: 1 }
          }
        }
      ]);

      res.json(statusData);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);


module.exports = router;