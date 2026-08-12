const Product = require("../models/product");
const Order = require("../models/Order");
const User = require("../models/User");


const getDashboard = async (req, res) => {
  try {

    // Basic Counts
    const totalProducts = await Product.countDocuments();

    const totalOrders = await Order.countDocuments();

    const totalUsers = await User.countDocuments();



    // Total Revenue
    const orders = await Order.find();

    const totalRevenue = orders.reduce(
      (sum, order) => sum + order.total,
      0
    );



    // Latest 5 Orders
    const recentOrders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 })
      .limit(5);



    // Latest 5 Users
    const latestUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email createdAt");



    // Low Stock Products
    const lowStockProducts = await Product.find({
      stock: { $lte: 5 }
    })
      .select("name stock")
      .limit(5);



    // Monthly Sales Analytics
    const monthlySales = await Order.aggregate([
      {
        $group: {
          _id: {
            month: { $month: "$createdAt" },
            year: { $year: "$createdAt" }
          },

          totalSales: {
            $sum: "$total"
          },

          totalOrders: {
            $sum: 1
          }
        }
      },

      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1
        }
      }
    ]);

    // Order Status Analytics

const orderStatusAnalytics = await Order.aggregate([

  {
    $group: {
      _id: "$orderStatus",

      count: {
        $sum: 1
      }
    }
  }

]);



    // Best Selling Products
    const bestSellingProducts = await Order.aggregate([
      {
        $unwind: "$items"
      },

      {
        $group: {
          _id: "$items.name",

          totalSold: {
            $sum: "$items.quantity"
          },

          totalRevenue: {
            $sum: {
              $multiply: [
                "$items.price",
                "$items.quantity"
              ]
            }
          }
        }
      },

      {
        $sort: {
          totalSold: -1
        }
      },

      {
        $limit: 5
      }
    ]);



    res.status(200).json({

      success: true,

      dashboard: {

        totalProducts,
        totalOrders,
        totalUsers,
        totalRevenue,

        recentOrders,
        latestUsers,
        lowStockProducts,

        monthlySales,

        bestSellingProducts,

        orderStatusAnalytics
      }

    });



  } catch (error) {

    console.log("ADMIN DASHBOARD ERROR =>", error);

    res.status(500).json({
      success: false,
      message: "Could not load dashboard"
    });

  }
};



const getAllOrders = async (req, res) => {

  try {

    const orders = await Order.find()
      .populate("userId", "name email")
      .sort({ createdAt: -1 });


    res.status(200).json({
      success: true,
      orders
    });


  } catch(error) {

    console.log(error);

    res.status(500).json({
      success:false,
      message:"Could not fetch orders"
    });

  }

};



module.exports = {
  getDashboard,
  getAllOrders
};