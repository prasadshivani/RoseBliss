import React, { useState } from "react";
import api from "../api/axios";
import { toast } from "react-toastify";

const AddProduct = () => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    description: "",
    image: "",
    type: "",
    category: "Lipsticks",
    stock: 20,
  });

  const handleChange = (e) => {
    if (e.target.name === "image") {
      setForm({
        ...form,
        image: e.target.files[0],
      });
    } else {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formData = new FormData();

      formData.append("name", form.name);
      formData.append("price", form.price);
      formData.append("description", form.description);
      formData.append("type", form.type);
      formData.append("category", form.category);
      formData.append("stock", form.stock);
      formData.append("image", form.image);

      const res = await api.post("/api/admin/add-product", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success(res.data.message);

      setForm({
        name: "",
        price: "",
        description: "",
        image: "",
        type: "",
        category: "Lipsticks",
        stock: 20,
      });
    } catch (err) {
      console.log(err);
      toast.error(err.response?.data?.message || "Error");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Add Product</h2>

      <form onSubmit={handleSubmit}>
        <input
          className="form-control mb-2"
          placeholder="Name"
          name="name"
          value={form.name}
          onChange={handleChange}
        />

        <input
          className="form-control mb-2"
          placeholder="Price"
          name="price"
          value={form.price}
          onChange={handleChange}
        />

        <textarea
          className="form-control mb-2"
          placeholder="Description"
          name="description"
          value={form.description}
          onChange={handleChange}
        />

        <input
          type="file"
          className="form-control mb-2"
          onChange={(e) =>
            setForm({
              ...form,
              image: e.target.files[0],
            })
          }
        />

        <input
          className="form-control mb-2"
          placeholder="Type"
          name="type"
          value={form.type}
          onChange={handleChange}
        />

        <select
          className="form-control mb-2"
          name="category"
          value={form.category}
          onChange={handleChange}
        >
          <option>Lipsticks</option>
          <option>Skincare</option>
          <option>Makeupkits</option>
          <option>Perfumes</option>
        </select>

        <input
          className="form-control mb-3"
          placeholder="Stock"
          name="stock"
          value={form.stock}
          onChange={handleChange}
        />

        <button className="btn btn-primary">Add Product</button>
      </form>
    </div>
  );
};

export default AddProduct;
