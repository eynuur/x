import { useState, useEffect, useRef, useCallback } from "react";
import { Chart } from "chart.js/auto";
import { TextField, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import NewsPage from "./NewsPage";// Burada NewsPage bileşenini import ediyoruz.

export default function Home() {
  const [exchangeRates, setExchangeRates] = useState(null);
  const [currency1, setCurrency1] = useState("USD");
  const [currency2, setCurrency2] = useState("TRY");
  const [amount1, setAmount1] = useState();
  const [amount2, setAmount2] = useState();
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    fetch("https://v6.exchangerate-api.com/v6/cb1ce9470bb9a768a492d395/latest/USD")
      .then((response) => response.json())
      .then((data) => setExchangeRates(data.conversion_rates))
      .catch((error) => console.error("Error fetching data: ", error));
  }, []);

  const updateChart = useCallback(() => {
    if (!exchangeRates || !chartRef.current) return;

    const labels = ["7 saat önce", "6 saat önce", "5 saat önce", "4 saat önce", "3 saat önce", "2 saat önce", "1 saat önce"];
    const rates = labels.map(() => {
      const rate1 = exchangeRates[currency1];
      const rate2 = exchangeRates[currency2];
      return (rate2 / rate1 + (Math.random() - 0.5) * 0.01).toFixed(4);
    });

    if (chartInstance.current) {
      chartInstance.current.data.datasets[0].data = rates;
      chartInstance.current.data.labels = labels;
      chartInstance.current.data.datasets[0].label = `${currency1} to ${currency2}`;
      chartInstance.current.update();
    } else {
      chartInstance.current = new Chart(chartRef.current, {
        type: "line",
        data: {
          labels,
          datasets: [
            {
              label: `${currency1} to ${currency2}`,
              data: rates,
              borderColor: "rgba(21, 129, 21, 0.3)",
              borderWidth: 2,
              pointRadius: 2,
              fill: true,
            },
          ],
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            x: { ticks: { font: { size: 10 } }, grid: { display: false } },
            y: {
              ticks: { font: { size: 10 }, callback: (value) => value.toFixed(4) },
              grid: { display: true },
            },
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              callbacks: {
                label: (context) => `${currency1} to ${currency2}: ${context.raw}`,
              },
            },
          },
        },
      });
    }
  }, [currency1, currency2, exchangeRates]);

  useEffect(() => {
    updateChart();
  }, [currency1, currency2, updateChart]);

  const handleAmount1Change = (e) => {
    const value = parseFloat(e.target.value);
    setAmount1(value);
    if (exchangeRates) {
      const rate1 = exchangeRates[currency1];
      const rate2 = exchangeRates[currency2];
      setAmount2(((value * rate2) / rate1).toFixed(2));
    }
  };

  const handleCurrency1Change = (e) => setCurrency1(e.target.value);
  const handleCurrency2Change = (e) => setCurrency2(e.target.value);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        minHeight: "100vh",
        textAlign: "center",
        width: "100%",
        maxWidth: "1200px",
        padding: "0 20px",
        boxSizing: "border-box",
        marginTop: "150px",
      }}
    >
      <h1 style={{ fontSize: "40px", marginBottom: "50px" }}>Currency Converter</h1>
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: "30px" }}>
        <div style={{ textAlign: "left", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ marginBottom: "10px" }}>
            <TextField
              type="number"
              value={amount1}
              onChange={handleAmount1Change}
              variant="outlined"
              size="small"
              style={{ marginBottom: "10px", width: "120px" }}
            />
            <FormControl style={{ width: "120px" }}>
              <InputLabel></InputLabel>
              <Select
                value={currency1}
                onChange={handleCurrency1Change}
                size="small"
                MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
              >
                {exchangeRates &&
                  Object.keys(exchangeRates).map((currency) => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
          <div style={{ marginBottom: "10px" }}>
            <TextField
              type="text"
              value={amount2}
              readOnly
              variant="outlined"
              size="small"
              style={{ marginBottom: "10px", width: "120px" }}
            />
            <FormControl style={{ width: "120px" }}>
              <InputLabel></InputLabel>
              <Select
                value={currency2}
                onChange={handleCurrency2Change}
                size="small"
                MenuProps={{ PaperProps: { style: { maxHeight: 200 } } }}
              >
                {exchangeRates &&
                  Object.keys(exchangeRates).map((currency) => (
                    <MenuItem key={currency} value={currency}>
                      {currency}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>
          </div>
        </div>
        <div style={{ width: "400px", height: "200px" }}>
          <canvas ref={chartRef} />
        </div>
      </div>

      {/* NewsPage bileşenini buraya ekliyoruz */}
      <NewsPage />
    </div>
  );
}
