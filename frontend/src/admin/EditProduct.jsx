import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";

function EditProduct() {
  const { id } = useParams();

  const [product, setProduct] = useState({
    name: "",
    category: "",
    price: "",
    stock: "",
    image: "",
    description: "",
  });

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/api/admin/product/${id}`);
      setProduct(res.data.product);
    } catch (error) {
      console.log(error);
    }
  };

  const updateProduct = async () => {
  try {
    await api.put(`/api/admin/product/${id}`, product);

    alert("Product Updated Successfully ✅");
  } catch (error) {
    console.log(error);
    alert("Could not update product");
  }
};
  return (
    <div style={{ padding: "20px" }}>
      <h2>Edit Product</h2>

      <input
  type="text"
  placeholder="Product Name"
  value={product.name}
  onChange={(e) =>
    setProduct({ ...product, name: e.target.value })
  }
/>

<br /><br />

<input
  type="text"
  placeholder="Category"
  value={product.category}
  onChange={(e) =>
    setProduct({ ...product, category: e.target.value })
  }
/>

<br /><br />

<input
  type="number"
  placeholder="Price"
  value={product.price}
  onChange={(e) =>
    setProduct({ ...product, price: e.target.value })
  }
/>

<br /><br />

<input
  type="number"
  placeholder="Stock"
  value={product.stock}
  onChange={(e) =>
    setProduct({ ...product, stock: e.target.value })
  }
/>

<br /><br />

<button onClick={updateProduct}>
  Update Product
</button>
    </div>
  );
}

export default EditProduct;