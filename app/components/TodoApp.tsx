"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Todo = {
  id: string;
  text: string;
  completed: boolean;
};

const spring = { type: "spring" as const, stiffness: 300, damping: 30 };

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [input, setInput] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const isComposingRef = useRef(false);

  const addTodo = () => {
    const text = input.trim();
    if (!text) return;
    setTodos((prev) => [
      { id: crypto.randomUUID(), text, completed: false },
      ...prev,
    ]);
    setInput("");
    inputRef.current?.focus();
  };

  const toggleTodo = (id: string) => {
    setTodos((prev) =>
      prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t))
    );
  };

  const deleteTodo = (id: string) => {
    setTodos((prev) => prev.filter((t) => t.id !== id));
  };

  const remaining = todos.filter((t) => !t.completed).length;

  return (
    <div className="container">
      <header className="header">
        <h1 className="title">やること</h1>
        {todos.length > 0 && (
          <p className="subtitle">
            {remaining === 0
              ? "すべて完了！"
              : `残り ${remaining} 件`}
          </p>
        )}
      </header>

      <div className="input-row">
        <input
          ref={inputRef}
          className="input"
          type="text"
          placeholder="タスクを追加..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onCompositionStart={() => { isComposingRef.current = true; }}
          onCompositionEnd={() => { isComposingRef.current = false; }}
          onKeyDown={(e) => e.key === "Enter" && !isComposingRef.current && addTodo()}
          maxLength={100}
        />
        <button
          className="add-btn"
          onClick={addTodo}
          disabled={!input.trim()}
          aria-label="タスクを追加"
        >
          追加
        </button>
      </div>

      <ul className="list">
        <AnimatePresence initial={false}>
          {todos.map((todo) => (
            <motion.li
              key={todo.id}
              className={`item ${todo.completed ? "completed" : ""}`}
              initial={{ opacity: 0, y: -12, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, x: 40, scale: 0.96 }}
              transition={spring}
              layout
            >
              <button
                className="check-btn"
                onClick={() => toggleTodo(todo.id)}
                aria-label={todo.completed ? "未完了に戻す" : "完了にする"}
              >
                <motion.span
                  className="check-circle"
                  animate={
                    todo.completed
                      ? { scale: 1, backgroundColor: "#0071e3" }
                      : { scale: 1, backgroundColor: "transparent" }
                  }
                  transition={spring}
                >
                  {todo.completed && (
                    <motion.svg
                      width="12"
                      height="12"
                      viewBox="0 0 12 12"
                      initial={{ pathLength: 0, opacity: 0 }}
                      animate={{ pathLength: 1, opacity: 1 }}
                      transition={{ duration: 0.2, delay: 0.05 }}
                    >
                      <motion.path
                        d="M2 6l3 3 5-5"
                        stroke="white"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        fill="none"
                        initial={{ pathLength: 0 }}
                        animate={{ pathLength: 1 }}
                        transition={{ duration: 0.25 }}
                      />
                    </motion.svg>
                  )}
                </motion.span>
              </button>

              <motion.span
                className="item-text"
                animate={
                  todo.completed
                    ? { opacity: 0.38, textDecorationColor: "currentColor" }
                    : { opacity: 1 }
                }
                transition={spring}
                style={{
                  textDecoration: todo.completed ? "line-through" : "none",
                }}
              >
                {todo.text}
              </motion.span>

              <button
                className="delete-btn"
                onClick={() => deleteTodo(todo.id)}
                aria-label="タスクを削除"
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M4 4l8 8M12 4l-8 8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </ul>

      {todos.length === 0 && (
        <motion.div
          className="empty"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, ...spring }}
        >
          <span className="empty-icon">✓</span>
          <p>タスクはありません</p>
          <p className="empty-hint">上の入力欄からタスクを追加してください</p>
        </motion.div>
      )}

      <style jsx>{`
        .container {
          max-width: 640px;
          margin: 0 auto;
          padding: 48px 20px 80px;
          min-height: 100vh;
        }

        .header {
          margin-bottom: 32px;
        }

        .title {
          font-size: clamp(2rem, 6vw, 2.8rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          color: #1d1d1f;
          line-height: 1.08;
        }

        .subtitle {
          margin-top: 6px;
          font-size: 15px;
          color: #6e6e73;
          font-weight: 400;
        }

        @media (prefers-color-scheme: dark) {
          .title { color: #f5f5f7; }
          .subtitle { color: #98989d; }
        }

        .input-row {
          display: flex;
          gap: 10px;
          margin-bottom: 28px;
        }

        .input {
          flex: 1;
          height: 52px;
          padding: 0 16px;
          border-radius: 12px;
          border: 1.5px solid rgba(0, 0, 0, 0.12);
          background: #ffffff;
          font-size: 17px;
          color: #1d1d1f;
          outline: none;
          transition: border-color 0.2s ease, box-shadow 0.2s ease;
          -webkit-appearance: none;
        }

        .input::placeholder { color: #aeaeb2; }

        .input:focus {
          border-color: #0071e3;
          box-shadow: 0 0 0 3px rgba(0, 113, 227, 0.18);
        }

        @media (prefers-color-scheme: dark) {
          .input {
            background: #2c2c2e;
            border-color: rgba(255, 255, 255, 0.1);
            color: #f5f5f7;
          }
          .input::placeholder { color: #636366; }
          .input:focus {
            border-color: #0a84ff;
            box-shadow: 0 0 0 3px rgba(10, 132, 255, 0.2);
          }
        }

        .add-btn {
          height: 52px;
          padding: 0 22px;
          border-radius: 12px;
          background: #0071e3;
          color: #fff;
          font-size: 15px;
          font-weight: 600;
          letter-spacing: -0.01em;
          transition: background 0.15s ease, transform 0.1s ease;
          white-space: nowrap;
          min-width: 72px;
        }

        .add-btn:active { transform: scale(0.97); }
        .add-btn:disabled { background: #aeaeb2; }

        @media (prefers-color-scheme: dark) {
          .add-btn { background: #0a84ff; }
          .add-btn:disabled { background: #3a3a3c; }
        }

        .list {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .item {
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 0 16px;
          height: 60px;
          border-radius: 14px;
          background: #ffffff;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04);
        }

        @media (prefers-color-scheme: dark) {
          .item {
            background: #2c2c2e;
            box-shadow: none;
          }
        }

        .check-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          border-radius: 50%;
          margin-left: -6px;
        }

        .check-circle {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1.8px solid #aeaeb2;
          transition: border-color 0.15s ease;
        }

        .check-btn:hover .check-circle {
          border-color: #0071e3;
        }

        @media (prefers-color-scheme: dark) {
          .check-circle { border-color: #48484a; }
          .check-btn:hover .check-circle { border-color: #0a84ff; }
        }

        .item.completed .check-circle {
          border-color: transparent;
        }

        .item-text {
          flex: 1;
          font-size: 17px;
          letter-spacing: -0.022em;
          color: #1d1d1f;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          min-width: 0;
        }

        @media (prefers-color-scheme: dark) {
          .item-text { color: #f5f5f7; }
        }

        .delete-btn {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 44px;
          height: 44px;
          flex-shrink: 0;
          border-radius: 50%;
          color: #aeaeb2;
          margin-right: -6px;
          transition: color 0.15s ease;
        }

        .delete-btn:hover { color: #ff3b30; }

        @media (prefers-color-scheme: dark) {
          .delete-btn { color: #48484a; }
          .delete-btn:hover { color: #ff453a; }
        }

        .empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 64px 0;
          color: #aeaeb2;
          text-align: center;
        }

        .empty-icon {
          font-size: 40px;
          line-height: 1;
          display: block;
          margin-bottom: 8px;
          opacity: 0.4;
        }

        .empty p {
          font-size: 17px;
          font-weight: 500;
          color: #6e6e73;
        }

        .empty-hint {
          font-size: 14px !important;
          font-weight: 400 !important;
          color: #aeaeb2 !important;
        }

        @media (prefers-color-scheme: dark) {
          .empty p { color: #98989d; }
          .empty-hint { color: #636366 !important; }
        }

        @media (max-width: 480px) {
          .container { padding: 32px 16px 80px; }
        }
      `}</style>
    </div>
  );
}
