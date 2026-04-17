import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [taskText, setTaskText] = useState("");
  const [priority, setPriority] = useState("Baixa");
  const [taskList, setTaskList] = useState([]);
  const [filter, setFilter] = useState("Todas");
  const [search, setSearch] = useState("");

  const [editId, setEditId] = useState(null);
  const [editText, setEditText] = useState("");

  // Load LocalStorage
  useEffect(() => {
    const saved = localStorage.getItem("@taskflow_data");
    if (saved) setTaskList(JSON.parse(saved));
  }, []);

  // Save LocalStorage
  useEffect(() => {
    localStorage.setItem("@taskflow_data", JSON.stringify(taskList));
  }, [taskList]);

  const addTask = (e) => {
    e.preventDefault();
    if (!taskText.trim()) return;

    const newTask = {
      id: crypto.randomUUID(),
      text: taskText,
      priority: priority,
      completed: false,
      createdAt: new Date().toLocaleDateString()
    };

    setTaskList([newTask, ...taskList]);
    setTaskText("");
  };

  const toggleTask = (id) => {
    setTaskList(taskList.map(t =>
      t.id === id ? { ...t, completed: !t.completed } : t
    ));
  };

  const deleteTask = (id) => {
    const confirmDelete = window.confirm("Tem certeza que deseja excluir?");
    if (!confirmDelete) return;

    setTaskList(taskList.filter(t => t.id !== id));
  };

  const saveEdit = (id) => {
    setTaskList(taskList.map(t =>
      t.id === id ? { ...t, text: editText } : t
    ));
    setEditId(null);
  };

  // Ordenação por prioridade
  const sortedTasks = [...taskList].sort((a, b) => {
    const order = { "Alta": 0, "Média": 1, "Baixa": 2 };
    return order[a.priority] - order[b.priority];
  });

  // Filtro + busca
  const filteredTasks = sortedTasks.filter(t => {
    if (filter === "Pendentes" && t.completed) return false;
    if (filter === "Concluídas" && !t.completed) return false;

    if (!t.text.toLowerCase().includes(search.toLowerCase())) return false;

    return true;
  });

  return (
    <div className="app-container">
      <header>
        <h1>TaskFlow</h1>
        <p>Gestão de Produtividade</p>
      </header>

      <section className="form-section">
        <form onSubmit={addTask}>
          <input
            value={taskText}
            onChange={(e) => setTaskText(e.target.value)}
            placeholder="Descrição da tarefa..."
          />

          <select value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="Baixa">Baixa</option>
            <option value="Média">Média</option>
            <option value="Alta">Alta</option>
          </select>

          <button type="submit">Criar</button>
        </form>
      </section>

      {/* Busca */}
      <input
        type="text"
        placeholder="Buscar tarefa..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <section className="filter-section">
        {["Todas", "Pendentes", "Concluídas"].map(f => (
          <button
            key={f}
            className={filter === f ? "active" : ""}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </section>

      <main className="task-grid">
        {filteredTasks.map(item => (
          <div key={item.id} className={`task-card ${item.priority.toLowerCase()} ${item.completed ? 'done' : ''}`}>

            <div className="task-content">

              {editId === item.id ? (
                <>
                  <input
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <button onClick={() => saveEdit(item.id)}>Salvar</button>
                </>
              ) : (
                <>
                  <h3>{item.text}</h3>
                  <span>Prioridade: {item.priority}</span>
                  <small>Criada em: {item.createdAt}</small>
                </>
              )}

            </div>

            <div className="task-actions">
              <button onClick={() => toggleTask(item.id)}>
                {item.completed ? "Reabrir" : "Concluir"}
              </button>

              <button onClick={() => {
                setEditId(item.id);
                setEditText(item.text);
              }}>
                Editar
              </button>

              <button onClick={() => deleteTask(item.id)} className="delete">
                Remover
              </button>
            </div>

          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
