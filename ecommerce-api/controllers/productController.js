const Product = require('../models/Product');
const transporter = require('../config/email');

// Add Product
exports.addProduct = async (req, res) => {
  const { name, price, category, stock } = req.body;

  try {
    const newProduct = new Product({
      name,
      price,
      category,
      stock,
    });
    await newProduct.save();
    res.status(201).json(newProduct);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Products
exports.getProducts = async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails',
        },
      },
      {
        $unwind: '$categoryDetails',
      },
      {
        $project: {
          name: 1,
          price: 1,
          stock: 1,
          'categoryDetails.name': 1,
        },
      },
    ]);
    res.json(products);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get Products with Stock Less Than 1
exports.getProductsOutOfStock = async (req, res) => {
  try {
    const products = await Product.find({ stock: { $lt: 1 } });
    res.json(products);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Edit Product
exports.editProduct = async (req, res) => {
  const { id } = req.params;
  const { name, price, category, stock } = req.body;

  try {
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    product.name = name || product.name;
    product.price = price || product.price;
    product.category = category || product.category;
    product.stock = stock || product.stock;

    const updatedProduct = await product.save();
    res.json(updatedProduct);
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete Product
exports.deleteProduct = async (req, res) => {
  const { id } = req.params;

  try {
    const product = await Product.findByIdAndDelete(id);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product removed' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Send Product List via Email
exports.sendProductListByEmail = async (req, res) => {
  try {
    const products = await Product.find();
    const user = req.user;

    if (!user) {
      return res.status(400).json({ message: 'User not found' });
    }

    const emailContent = `
      <h1>Product List</h1>
      <table border="1" cellpadding="5" cellspacing="0">
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Stock</th>
        </tr>
        ${products
          .map(
            (product) =>
              `<tr><td>${product.name}</td><td>${product.price}</td><td>${product.stock}</td></tr>`
          )
          .join('')}
      </table>
    `;

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Your Product List',
      html: emailContent,
    });

    res.json({ message: 'Product list sent to your email' });
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
