import mongoose from "mongoose";

const todoSchema = mongoose.Schema(
  {
    content: { type: String, requried: true },
    complete: { type: Boolean, default: false },
    createBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // reference value must be same as reference model tableName
    },
    subTodos: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "SubTodo"
        }
    ] // array of sub-todos
  },
  { timestamps: true }
);

export const Todo = mongoose.model("Todo", todoSchema);
