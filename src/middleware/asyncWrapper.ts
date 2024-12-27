import { Request, Response, NextFunction } from "express";
import globalErrorHandler from "../utils/globalErrorHandler";

const asyncWrapper = (fn: (req: Request, res: Response, next: NextFunction, response: boolean) => Promise<any>, response: boolean = true) => {
    return (req: Request, res: Response, next: NextFunction): void => {
        fn(req, res, next, response).catch((error) => {
            globalErrorHandler(error, req, res, next); // Ensure errors are handled here
        });
    };
};

export default asyncWrapper;
// import { Request, Response, NextFunction } from "express";
// import globalErrorHandler from "../utils/globalErrorHandler";

// const asyncWrapper = (fn: (req: Request, res: Response, next: NextFunction, response: boolean) => Promise<any>, response: boolean = true) => {
//     return async (req: Request, res: Response, next: NextFunction) => {
//         try {
//             await fn(req, res, next, response);
//         } catch (error) {
//             globalErrorHandler(error, req, res, next);
//         }
//     };
// };

// export default asyncWrapper;

// import express from "express";
// import mongoose from "mongoose";
// import asyncWrapper from "./asyncWrapper"; // Wrapper to handle async errors

// // Connect to MongoDB
// mongoose
//   .connect("mongodb://localhost:27017/mydatabase", {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//   })
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.error(err));

// // ItemController Class
// class ItemController {
//   constructor(req, res) {
//     this.req = req;
//     this.res = res;
//     this.body = req.body;
//     this.query = req.query;
//     this.params = req.params;
//     this.user = req.user || null; // Assuming req.user is set via middleware
//   }

//   // Define the Mongoose schema and model
//   static getModel() {
//     const itemSchema = new mongoose.Schema({
//       name: { type: String, required: true },
//       description: { type: String },
//       price: { type: Number, required: true },
//     });

//     // Add a pre-save middleware to lowercase the name
//     itemSchema.pre("save", function (next) {
//       if (this.name) {
//         this.name = this.name.toLowerCase();
//       }
//       next();
//     });

//     return mongoose.models.Item || mongoose.model("Item", itemSchema);
//   }

//   // Common method to send responses
//   sendResponse(statusCode, data) {
//     this.res.status(statusCode).json(data);
//   }

//   // Create a new item
//   async createItem() {
//     try {
//       const Item = ItemController.getModel();
//       const item = new Item(this.body);
//       const savedItem = await item.save();
//       this.sendResponse(201, savedItem);
//     } catch (error) {
//       this.sendResponse(400, { error: error.message });
//     }
//   }

//   // Get all items or a single item by ID
//   async getItems() {
//     try {
//       const Item = ItemController.getModel();
//       if (this.params.id) {
//         const item = await Item.findById(this.params.id);
//         if (!item) return this.sendResponse(404, { error: "Item not found" });
//         return this.sendResponse(200, item);
//       }
//       const items = await Item.find();
//       this.sendResponse(200, items);
//     } catch (error) {
//       this.sendResponse(500, { error: error.message });
//     }
//   }

//   // Update an item by ID
//   async updateItem() {
//     try {
//       const Item = ItemController.getModel();
//       const updatedItem = await Item.findByIdAndUpdate(
//         this.params.id,
//         this.body,
//         {
//           new: true,
//           runValidators: true,
//         }
//       );
//       if (!updatedItem)
//         return this.sendResponse(404, { error: "Item not found" });
//       this.sendResponse(200, updatedItem);
//     } catch (error) {
//       this.sendResponse(400, { error: error.message });
//     }
//   }

//   // Delete an item by ID
//   async deleteItem() {
//     try {
//       const Item = ItemController.getModel();
//       const deletedItem = await Item.findByIdAndDelete(this.params.id);
//       if (!deletedItem)
//         return this.sendResponse(404, { error: "Item not found" });
//       this.sendResponse(200, { message: "Item deleted successfully" });
//     } catch (error) {
//       this.sendResponse(500, { error: error.message });
//     }
//   }
// }

// // Express Routes
// const app = express();
// app.use(express.json());

// // Route handlers using the ItemController
// app.post(
//   "/items",
//   asyncWrapper((req, res) => new ItemController(req, res).createItem())
// );
// app.get(
//   "/items",
//   asyncWrapper((req, res) => new ItemController(req, res).getItems())
// );
// app.get(
//   "/items/:id",
//   asyncWrapper((req, res) => new ItemController(req, res).getItems())
// );
// app.put(
//   "/items/:id",
//   asyncWrapper((req, res) => new ItemController(req, res).updateItem())
// );
// app.delete(
//   "/items/:id",
//   asyncWrapper((req, res) => new ItemController(req, res).deleteItem())
// );

// // Error handling middleware
// app.use((err, req, res, next) => {
//   res.status(500).json({ error: err.message });
// });

// // Start the server
// const PORT = 3000;
// app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
