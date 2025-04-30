import React, { useState, useEffect } from 'react';

const FILTERS = ['All', 'Active', 'Completed'];
const LABELS = [
  { value: 'study', text: 'Study' },
  { value: 'meditation', text: 'Meditation' },
  { value: 'extra', text: 'Extra Curricular' },
  { value: 'rest', text: 'Rest' },
  { value: 'project', text: 'Project' }
];

const Todo = ({ theme }) => {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');
  const [inputLabel, setInputLabel] = useState(LABELS[0].value);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingLabel, setEditingLabel] = useState(LABELS[0].value);
  const [filter, setFilter] = useState('All');
  const [lastDeleted, setLastDeleted] = useState(null);
  const [subtaskInputs, setSubtaskInputs] = useState({}); // { [todoId]: subtaskText }

  useEffect(() => {
    const saved = localStorage.getItem('todos');
    if (saved) {
      let loaded = JSON.parse(saved);
      // Migrate: ensure all todos have label and subtasks
      loaded = loaded.map(todo => ({
        ...todo,
        label: todo.label || 'study',
        subtasks: todo.subtasks || []
      }));
      setTodos(loaded);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (input.trim()) {
      setTodos([{ id: Date.now(), text: input, label: inputLabel, done: false, subtasks: [] }, ...todos]);
      setInput('');
      setInputLabel(LABELS[0].value);
    }
  };

  const toggleTodo = id => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, done: !todo.done } : todo
    ));
  };

  const deleteTodo = id => {
    const toDelete = todos.find(todo => todo.id === id);
    setLastDeleted(toDelete);
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const startEdit = (id, text, label) => {
    setEditingId(id);
    setEditingText(text);
    setEditingLabel(label);
  };

  const saveEdit = id => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: editingText, label: editingLabel } : todo
    ));
    setEditingId(null);
    setEditingText('');
    setEditingLabel(LABELS[0].value);
  };

  const clearCompleted = () => {
    setTodos(todos.filter(todo => !todo.done));
  };

  const undoDelete = () => {
    if (lastDeleted) {
      setTodos([lastDeleted, ...todos]);
      setLastDeleted(null);
    }
  };

  // Subtasks
  const handleSubtaskInput = (todoId, value) => {
    setSubtaskInputs(inputs => ({ ...inputs, [todoId]: value }));
  };

  const addSubtask = (todoId) => {
    const text = (subtaskInputs[todoId] || '').trim();
    if (!text) return;
    setTodos(todos.map(todo =>
      todo.id === todoId
        ? { ...todo, subtasks: [...(todo.subtasks || []), { id: Date.now(), text, done: false }] }
        : todo
    ));
    setSubtaskInputs(inputs => ({ ...inputs, [todoId]: '' }));
  };

  const toggleSubtask = (todoId, subtaskId) => {
    setTodos(todos.map(todo =>
      todo.id === todoId
        ? { ...todo, subtasks: todo.subtasks.map(st => st.id === subtaskId ? { ...st, done: !st.done } : st) }
        : todo
    ));
  };

  const deleteSubtask = (todoId, subtaskId) => {
    setTodos(todos.map(todo =>
      todo.id === todoId
        ? { ...todo, subtasks: todo.subtasks.filter(st => st.id !== subtaskId) }
        : todo
    ));
  };

  const filteredTodos = todos.filter(todo =>
    filter === 'All' ? true : filter === 'Active' ? !todo.done : todo.done
  );

  const completedCount = todos.filter(todo => todo.done).length;

  return (
    <div className="todo-container" style={{
      maxWidth: 600,
      margin: '0 auto',
      padding: '2.5rem 1rem',
      color: 'var(--theme-text, #fff)'
    }}>
      <h1 style={{
        color: 'var(--theme-accent, #4CAF50)',
        fontWeight: 800,
        fontSize: '2.2rem',
        marginBottom: '2rem',
        letterSpacing: '-1px'
      }}>Todo List</h1>
      <div style={{ display: 'flex', gap: 12, marginBottom: 24 }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && addTodo()}
          placeholder="Add a new task..."
          style={{
            flex: 1,
            padding: '0.9rem 1.2rem',
            borderRadius: 8,
            border: '1.5px solid var(--theme-accent, #4CAF50)',
            background: 'rgba(0,0,0,0.15)',
            color: 'var(--theme-text, #fff)',
            fontSize: '1.1rem'
          }}
        />
        <select
          value={inputLabel}
          onChange={e => setInputLabel(e.target.value)}
          style={{
            borderRadius: 8,
            border: '1.5px solid var(--theme-accent, #4CAF50)',
            background: 'rgba(0,0,0,0.15)',
            color: 'var(--theme-text, #fff)',
            fontSize: '1.1rem',
            padding: '0.9rem 1.2rem',
            outline: 'none',
            cursor: 'pointer'
          }}
        >
          {LABELS.map(l => (
            <option key={l.value} value={l.value}>{l.text}</option>
          ))}
        </select>
        <button
          onClick={addTodo}
          style={{
            background: 'var(--theme-accent, #4CAF50)',
            color: 'var(--theme-background, #23272e)',
            border: 'none',
            borderRadius: 8,
            padding: '0 1.5rem',
            fontWeight: 700,
            fontSize: '1.1rem',
            cursor: 'pointer',
            transition: 'background 0.2s'
          }}
        >Add</button>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 18, flexWrap: 'wrap' }}>
        <div style={{ display: 'flex', gap: 8 }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                background: filter === f ? 'var(--theme-accent, #4CAF50)' : 'rgba(0,0,0,0.08)',
                color: filter === f ? 'var(--theme-background, #23272e)' : 'var(--theme-text, #fff)',
                border: 'none',
                borderRadius: 6,
                padding: '0.4rem 1.1rem',
                fontWeight: 600,
                fontSize: '1rem',
                cursor: 'pointer',
                transition: 'background 0.2s'
              }}
            >{f}</button>
          ))}
        </div>
        <span style={{ fontSize: '1rem', opacity: 0.8 }}>
          {completedCount} / {todos.length} completed
        </span>
        <button
          onClick={clearCompleted}
          disabled={completedCount === 0}
          style={{
            marginLeft: 'auto',
            background: completedCount === 0 ? 'rgba(0,0,0,0.08)' : 'var(--theme-accent, #4CAF50)',
            color: completedCount === 0 ? 'var(--theme-text, #fff)' : 'var(--theme-background, #23272e)',
            border: 'none',
            borderRadius: 6,
            padding: '0.4rem 1.1rem',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: completedCount === 0 ? 'not-allowed' : 'pointer',
            opacity: completedCount === 0 ? 0.5 : 1,
            transition: 'background 0.2s, opacity 0.2s'
          }}
        >Clear Completed</button>
        {lastDeleted && (
          <button
            onClick={undoDelete}
            style={{
              background: '#e57373',
              color: '#fff',
              border: 'none',
              borderRadius: 6,
              padding: '0.4rem 1.1rem',
              fontWeight: 600,
              fontSize: '1rem',
              cursor: 'pointer',
              marginLeft: 8
            }}
          >Undo Delete</button>
        )}
      </div>
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {filteredTodos.length === 0 && (
          <li style={{ opacity: 0.7, fontStyle: 'italic', textAlign: 'center', marginTop: 32 }}>
            No todos found.
          </li>
        )}
        {filteredTodos.map(todo => (
          <li key={todo.id} style={{
            display: 'flex',
            flexDirection: 'column',
            background: todo.done ? 'rgba(76,175,80,0.08)' : 'rgba(0,0,0,0.08)',
            borderRadius: 8,
            marginBottom: 12,
            padding: '0.8rem 1rem',
            boxShadow: todo.done ? '0 2px 8px rgba(76,175,80,0.08)' : '0 2px 8px rgba(0,0,0,0.08)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <input
                type="checkbox"
                checked={todo.done}
                onChange={() => toggleTodo(todo.id)}
                style={{ marginRight: 16, width: 20, height: 20 }}
              />
              {editingId === todo.id ? (
                <>
                  <input
                    value={editingText}
                    onChange={e => setEditingText(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && saveEdit(todo.id)}
                    style={{
                      flex: 1,
                      padding: '0.5rem 0.8rem',
                      borderRadius: 6,
                      border: '1.5px solid var(--theme-accent, #4CAF50)',
                      fontSize: '1.05rem'
                    }}
                    autoFocus
                  />
                  <select
                    value={editingLabel}
                    onChange={e => setEditingLabel(e.target.value)}
                    style={{
                      borderRadius: 6,
                      border: '1.5px solid var(--theme-accent, #4CAF50)',
                      background: 'rgba(0,0,0,0.15)',
                      color: 'var(--theme-text, #fff)',
                      fontSize: '1.05rem',
                      padding: '0.5rem 0.8rem',
                      outline: 'none',
                      marginLeft: 8,
                      cursor: 'pointer'
                    }}
                  >
                    {LABELS.map(l => (
                      <option key={l.value} value={l.value}>{l.text}</option>
                    ))}
                  </select>
                  <button
                    onClick={() => saveEdit(todo.id)}
                    style={{
                      marginLeft: 8,
                      background: 'var(--theme-accent, #4CAF50)',
                      color: 'var(--theme-background, #23272e)',
                      border: 'none',
                      borderRadius: 6,
                      padding: '0.3rem 1rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >Save</button>
                </>
              ) : (
                <>
                  <span
                    style={{
                      flex: 1,
                      textDecoration: todo.done ? 'line-through' : 'none',
                      color: todo.done ? 'rgba(255,255,255,0.5)' : 'inherit',
                      fontSize: '1.08rem',
                      fontWeight: 500,
                      opacity: todo.done ? 0.7 : 1,
                      transition: 'color 0.2s'
                    }}
                    onDoubleClick={() => startEdit(todo.id, todo.text, todo.label)}
                    title="Double-click to edit"
                  >
                    {todo.text}
                  </span>
                  <span style={{
                    marginLeft: 12,
                    padding: '0.2rem 0.7rem',
                    borderRadius: 6,
                    background: 'var(--theme-accent, #4CAF50)',
                    color: 'var(--theme-background, #23272e)',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    opacity: 0.85
                  }}>
                    {LABELS.find(l => l.value === todo.label)?.text || ''}
                  </span>
                  <button
                    onClick={() => startEdit(todo.id, todo.text, todo.label)}
                    style={{
                      marginLeft: 8,
                      background: 'transparent',
                      color: 'var(--theme-accent, #4CAF50)',
                      border: 'none',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    title="Edit"
                  >Edit</button>
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    style={{
                      marginLeft: 8,
                      background: 'transparent',
                      color: '#e57373',
                      border: 'none',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    title="Delete"
                  >Delete</button>
                </>
              )}
            </div>
            {/* Subtasks */}
            <ul style={{ listStyle: 'none', paddingLeft: 36, marginTop: 8, marginBottom: 0 }}>
              {(todo.subtasks || []).map(st => (
                <li key={st.id} style={{ display: 'flex', alignItems: 'center', marginBottom: 4 }}>
                  <input
                    type="checkbox"
                    checked={st.done}
                    onChange={() => toggleSubtask(todo.id, st.id)}
                    style={{ marginRight: 10, width: 16, height: 16 }}
                  />
                  <span style={{
                    textDecoration: st.done ? 'line-through' : 'none',
                    color: st.done ? 'rgba(255,255,255,0.5)' : 'inherit',
                    fontSize: '0.98rem',
                    opacity: st.done ? 0.7 : 1,
                    flex: 1
                  }}>{st.text}</span>
                  <button
                    onClick={() => deleteSubtask(todo.id, st.id)}
                    style={{
                      marginLeft: 8,
                      background: 'transparent',
                      color: '#e57373',
                      border: 'none',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.95rem'
                    }}
                    title="Delete subtask"
                  >Delete</button>
                </li>
              ))}
              <li style={{ display: 'flex', alignItems: 'center', marginTop: 4 }}>
                <input
                  type="text"
                  value={subtaskInputs[todo.id] || ''}
                  onChange={e => handleSubtaskInput(todo.id, e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addSubtask(todo.id)}
                  placeholder="Add subtask..."
                  style={{
                    flex: 1,
                    padding: '0.3rem 0.7rem',
                    borderRadius: 6,
                    border: '1.2px solid var(--theme-accent, #4CAF50)',
                    background: 'rgba(0,0,0,0.10)',
                    color: 'var(--theme-text, #fff)',
                    fontSize: '0.98rem',
                    marginRight: 8
                  }}
                />
                <button
                  onClick={() => addSubtask(todo.id)}
                  style={{
                    background: 'var(--theme-accent, #4CAF50)',
                    color: 'var(--theme-background, #23272e)',
                    border: 'none',
                    borderRadius: 6,
                    padding: '0.3rem 0.9rem',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    cursor: 'pointer'
                  }}
                >Add</button>
              </li>
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Todo; 