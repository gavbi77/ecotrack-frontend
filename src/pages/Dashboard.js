import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);
  const [categoryId, setCategoryId] = useState("1");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const categories = [
    { id: "1", name: "Transporte de carro" },
    { id: "2", name: "Transporte de ônibus" },
    { id: "3", name: "Energia elétrica" },
    { id: "4", name: "Carne bovina" },
    { id: "5", name: "Voo doméstico" }
  ];

  const fetchDashboard = async () => {
    try {
      const res = await api.get("/activities/dashboard");
      setDashboard(res.data);
    } catch (err) {
      navigate("/login");
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  const handleActivity = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/activities", {
        category_id: parseInt(categoryId),
        amount: parseFloat(amount)
      });
      setMessage(`✅ ${res.data.total_co2} kg de CO₂ registrado!`);
      setAmount("");
      fetchDashboard();
    } catch (err) {
      setMessage("❌ Erro ao registrar atividade.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2 style={styles.title}>🌱 EcoTrack</h2>
        <button style={styles.logoutBtn} onClick={handleLogout}>Sair</button>
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Emissões do mês</h3>
        {dashboard ? (
          <>
            <p style={styles.total}>
              {dashboard.total_co2_mes} kg CO₂
            </p>
            <div>
              {dashboard.por_categoria.map((item, index) => (
                <div key={index} style={styles.categoryRow}>
                  <span>{item.categoria}</span>
                  <span style={styles.co2}>{item.co2} kg</span>
                </div>
              ))}
            </div>
          </>
        ) : (
          <p style={styles.empty}>Nenhuma atividade registrada ainda.</p>
        )}
      </div>

      <div style={styles.card}>
        <h3 style={styles.cardTitle}>Registrar atividade</h3>

        {message && <p style={styles.message}>{message}</p>}

        <form onSubmit={handleActivity}>
          <select
            style={styles.input}
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
          >
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>

          <input
            style={styles.input}
            type="number"
            placeholder="Quantidade (km, kWh ou kg)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
          />

          <button style={styles.button} type="submit">Registrar</button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f0f4f0",
    padding: "24px",
    maxWidth: "500px",
    margin: "0 auto"
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "24px"
  },
  title: {
    color: "#2d6a4f",
    fontSize: "24px",
    margin: 0
  },
  logoutBtn: {
    background: "none",
    border: "1px solid #ccc",
    borderRadius: "8px",
    padding: "6px 12px",
    cursor: "pointer",
    color: "#888"
  },
  card: {
    background: "#fff",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
    marginBottom: "16px"
  },
  cardTitle: {
    color: "#2d6a4f",
    marginTop: 0,
    marginBottom: "16px"
  },
  total: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#2d6a4f",
    margin: "0 0 16px 0"
  },
  categoryRow: {
    display: "flex",
    justifyContent: "space-between",
    padding: "8px 0",
    borderBottom: "1px solid #f0f0f0",
    fontSize: "14px"
  },
  co2: {
    color: "#e07b39",
    fontWeight: "500"
  },
  empty: {
    color: "#aaa",
    fontSize: "14px"
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "12px",
    borderRadius: "8px",
    border: "1px solid #ddd",
    fontSize: "14px",
    boxSizing: "border-box"
  },
  button: {
    width: "100%",
    padding: "12px",
    backgroundColor: "#2d6a4f",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    fontSize: "15px",
    cursor: "pointer"
  },
  message: {
    fontSize: "14px",
    marginBottom: "12px",
    color: "#2d6a4f"
  }
};

export default Dashboard;