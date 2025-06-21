/* eslint-disable react-hooks/exhaustive-deps */
import { useAppState } from "../../hooks/useAppState";
import {
  FaUsers,
  FaFolderOpen,
  FaProjectDiagram,
  FaChartBar,
  FaClock,
  
  FaUserCheck,
  FaTools,
  FaHome,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

// Datos simulados para gráfico
const chartData = [
  { name: "Ene", usuarios: 30 },
  { name: "Feb", usuarios: 50 },
  { name: "Mar", usuarios: 80 },
  { name: "Abr", usuarios: 65 },
  { name: "May", usuarios: 90 },
  { name: "Jun", usuarios: 120 },
];

const DashboardAdminPage = () => {
  const { user } = useAppState();
  const [animatedValues, setAnimatedValues] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const realValues = [128, 532, 34, 87, 76, 312]; // valores simulados

  const cards = [
    {
      icon: <FaUsers className="text-3xl text-white" />,
      label: "Usuarios registrados",
      color: "bg-blue-500",
    },
    {
      icon: <FaFolderOpen className="text-3xl text-white" />,
      label: "Archivos subidos",
      color: "bg-green-500",
    },
    {
      icon: <FaProjectDiagram className="text-3xl text-white" />,
      label: "Proyectos activos",
      color: "bg-yellow-500",
    },
    {
      icon: <FaChartBar className="text-3xl text-white" />,
      label: "Reportes generados",
      color: "bg-purple-500",
    },
    {
      icon: <FaUserCheck className="text-3xl text-white" />,
      label: "Usuarios conectados",
      color: "bg-pink-500",
    },
    {
      icon: <FaTools className="text-3xl text-white" />,
      label: "Tareas programadas",
      color: "bg-red-500",
    },
  ];

  useEffect(() => {
    const duration = 1000;
    const steps = 30;
    const interval = duration / steps;

    let currentStep = 0;
    const intervalId = setInterval(() => {
      currentStep++;
      const newValues = realValues.map(
        (val) => Math.floor((val * currentStep) / steps)
      );
      setAnimatedValues(newValues);
      if (currentStep >= steps) clearInterval(intervalId);
    }, interval);

    const clockInterval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => {
      clearInterval(intervalId);
      clearInterval(clockInterval);
    };
  }, []);

  const getGreeting = () => {
    const hour = currentTime.getHours();
    if (hour >= 5 && hour < 12) return "Buenos días";
    if (hour >= 12 && hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  const formatDate = (date: Date) =>
    date.toLocaleDateString("es-PE", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });

  const formatTime = (date: Date) =>
    date.toLocaleTimeString("es-PE", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

  return (
    <div className="w-full">
      {/* Bienvenida */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
            <div className="flex items-center gap-3">
                <FaHome className="text-2xl text-orange-500" />
                    <h1 className="text-2xl font-bold text-gray-800">
                {getGreeting()}, <span className="capitalize">{user?.nombres}</span>
            </h1>
            </div>
          
          <p className="text-sm text-gray-500">
            Hoy es {formatDate(currentTime)} — {formatTime(currentTime)}
          </p>
        </div>
        <div className="flex items-center gap-2 mt-4 sm:mt-0">
          <FaClock className="text-gray-500" />
          <span className="text-sm text-gray-600">{formatTime(currentTime)}</span>
        </div>
      </div>

      {/* Tarjetas estadísticas */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {cards.map((card, index) => (
          <div
            key={index}
            className={`rounded-xl shadow-md p-4 flex items-center gap-4 ${card.color} text-white hover:scale-[1.02] transition-transform duration-200`}
          >
            <div className="p-3 bg-white/20 rounded-full">{card.icon}</div>
            <div>
              <p className="text-sm font-medium">{card.label}</p>
              <h2 className="text-2xl font-bold">{animatedValues[index]}</h2>
            </div>
          </div>
        ))}
      </div>

      {/* Resumen general */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumen general</h2>
        <div className="bg-white border-l-4 border-orange-500 shadow-md rounded-lg p-6 flex flex-col gap-2">
          <p className="text-gray-700 text-sm sm:text-base leading-relaxed">
            Aquí podrás visualizar métricas, gráficas o listas detalladas más adelante.
            Esta sección está diseñada para mostrar análisis de usuarios, rendimiento
            del sistema y otros datos relevantes para tu plataforma de administración.
          </p>
          <p className="text-gray-500 text-xs">
            *A medida que se agreguen nuevas funcionalidades, esta vista será actualizada automáticamente.
          </p>
        </div>
      </div>

      {/* Gráfico */}
      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Usuarios por mes</h2>
        <div className="bg-white shadow-md rounded-lg p-4 h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis allowDecimals={false} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="usuarios"
                stroke="#f97316"
                strokeWidth={2}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default DashboardAdminPage;
