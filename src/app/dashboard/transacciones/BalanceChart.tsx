// app/transacciones/BalanceChart.tsx
'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { type MovimientoConUsuario } from '@/lib/types';
import { useMemo } from 'react';

// Función para procesar los datos de movimientos y calcular saldos diarios
const processDataForChart = (movements: MovimientoConUsuario[]) => {
    if (!movements.length) return [];

    // Ordenar por fecha, de más antiguo a más reciente
    const sortedMovements = [...movements].sort((a, b) => new Date(a.fecha).getTime() - new Date(b.fecha).getTime());
    
    const dailyBalances: { [key: string]: number } = {};
    let runningBalance = 0;

    sortedMovements.forEach(mov => {
        const date = new Date(mov.fecha).toLocaleDateString('sv'); // Formato YYYY-MM-DD
        const amount = mov.tipo === 'ENTRADA' ? mov.cantidad : -mov.cantidad;
        runningBalance += amount;
        dailyBalances[date] = runningBalance;
    });

    return Object.entries(dailyBalances).map(([date, saldo]) => ({
        fecha: date,
        saldo
    }));
}

export default function BalanceChart({ movements }: { movements: MovimientoConUsuario[] }) {
    const chartData = useMemo(() => processDataForChart(movements), [movements]);

    return (
        <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="fecha" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="saldo" stroke="#8884d8" activeDot={{ r: 8 }} />
            </LineChart>
        </ResponsiveContainer>
    );
}