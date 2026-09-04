import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

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

  const [newImage, setNewImage] = useState(null);

  useEffect(() => {
    fetchProduct();
  }, []);

  const fetchProduct = async () => {
    try {
      const res = await api.get(`/api/admin/product/${id}`);
      setProduct(res.data.product);
    } catch (error) {
      console.log("FETCH PRODUCT ERROR =>", error);
    }
  };

  const updateProduct = async () => {
    try {
      const formData = new FormData();

      formData.append("name", product.name);
      formData.append("category", product.category);
      formData.append("price", product.price);
      formData.append("stock", product.stock);
      formData.append("description", product.description);

      // New image only if selected
      if (newImage) {
        formData.append("image", newImage);
      }

      await api.put(`/api/admin/product/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast.success("Product Updated Successfully ✅");

      fetchProduct();
      setNewImage(null);
    } catch (error) {
      console.log("UPDATE PRODUCT ERROR =>", error);
      toast.error(
        error.response?.data?.message || "Could not update product"
      );
    }
  };

  return (
    <div className="container mt-4">
      <h2>Edit Product</h2>

      <div className="mt-4">

        <label className="form-label">Product Name</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Product Name"
          value={product.name}
          onChange={(e) =>
            setProduct({
              ...product,
              name: e.target.value,
            })
          }
        />

        <label className="form-label">Category</label>
        <input
          type="text"
          className="form-control mb-3"
          placeholder="Category"
          value={product.category}
          onChange={(e) =>
            setProduct({
              ...product,
              category: e.target.value,
            })
          }
        />

        <label className="form-label">Price</label>
        <input
          type="number"
          className="form-control mb-3"
          placeholder="Price"
          value={product.price}
          onChange={(e) =>
            setProduct({
              ...product,
              price: e.target.value,
            })
          }
        />

        <label className="form-label">Stock</label>
        <input
          type="number"
          className="form-control mb-3"
          placeholder="Stock"
          value={product.stock}
          onChange={(e) =>
            setProduct({
              ...product,
              stock: e.target.value,
            })
          }
        />

        <label className="form-label">Description</label>
        <textarea
          className="form-control mb-3"
          placeholder="Description"
          value={product.description || ""}
          onChange={(e) =>
            setProduct({
              ...product,
              description: e.target.value,
            })
          }
        />

        <label className="form-label">Current Image</label>

        {product.image ? (
          <div className="mb-3">
            <img
              src={product.image}
              alt={product.name}
              style={{
                width: "150px",
                height: "150px",
                objectFit: "cover",
                borderRadius: "10px",
              }}
            />
          </div>
        ) : (
          <p>No image available</p>
        )}

        <label className="form-label">Change Image</label>

        <input
          type="file"
          className="form-control mb-3"
          accept="image/*"
          onChange={(e) => setNewImage(e.target.files[0])}
        />

        <button
          className="btn btn-primary"
          onClick={updateProduct}
        >
          Update Product
        </button>

      </div>
    </div>
  );
}

export default EditProduct;