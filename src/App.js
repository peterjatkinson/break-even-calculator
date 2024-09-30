import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BreakEvenCalculator = () => {
  const [newPlantCost, setNewPlantCost] = useState(1.25);
  const [rdCost, setRdCost] = useState(1.5);
  const [marketingCost, setMarketingCost] = useState(0.025);
  const [unitProductionCost, setUnitProductionCost] = useState(65);
  const [pricePerPlane, setPricePerPlane] = useState(105);
  const [breakEvenPoint, setBreakEvenPoint] = useState(0);
  const [chartData, setChartData] = useState([]);
  const [calculations, setCalculations] = useState({});

  useEffect(() => {
    calculateBreakEven();
  }, [newPlantCost, rdCost, marketingCost, unitProductionCost, pricePerPlane]);

  const calculateBreakEven = () => {
    const fixedCosts = newPlantCost + rdCost + marketingCost;
    const profitPerPlane = pricePerPlane - unitProductionCost;
    const breakEven = (fixedCosts * 1000) / profitPerPlane;
    setBreakEvenPoint(Math.ceil(breakEven * 10) / 10);

    setCalculations({
      fixedCosts,
      profitPerPlane,
      breakEven
    });

    const data = [];
    for (let i = 0; i <= breakEven * 2; i += breakEven / 10) {
      data.push({
        units: Math.round(i),
        totalCosts: fixedCosts * 1000 + i * unitProductionCost,
        totalRevenue: i * pricePerPlane,
      });
    }
    setChartData(data);
  };

  const inputStyle = {
    margin: '5px 0',
    padding: '8px',
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '4px',
    fontSize: '16px',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.1)',
  };

  const labelStyle = {
    display: 'block',
    marginTop: '15px',
    marginBottom: '5px',
    fontWeight: 'bold',
    fontSize: '14px',
  };

  return (
    <div style={{ 
      fontFamily: 'Arial, sans-serif', 
      maxWidth: '1200px', 
      margin: '0 auto', 
      padding: '20px'
    }}>
      <h1 style={{ textAlign: 'center', color: '#333' }}>Break-Even Calculator</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
        <div>
          <label style={labelStyle}>New Plant Cost (bn $)</label>
          <input
            type="number"
            value={newPlantCost}
            onChange={(e) => setNewPlantCost(parseFloat(e.target.value))}
            step="0.01"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>R&D Cost (bn $)</label>
          <input
            type="number"
            value={rdCost}
            onChange={(e) => setRdCost(parseFloat(e.target.value))}
            step="0.01"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Marketing Cost (bn $)</label>
          <input
            type="number"
            value={marketingCost}
            onChange={(e) => setMarketingCost(parseFloat(e.target.value))}
            step="0.001"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Unit Production Cost (m $)</label>
          <input
            type="number"
            value={unitProductionCost}
            onChange={(e) => setUnitProductionCost(parseFloat(e.target.value))}
            step="0.1"
            style={inputStyle}
          />
        </div>
        <div>
          <label style={labelStyle}>Price per Plane (m $)</label>
          <input
            type="number"
            value={pricePerPlane}
            onChange={(e) => setPricePerPlane(parseFloat(e.target.value))}
            step="0.1"
            style={inputStyle}
          />
        </div>
      </div>

      <h2 style={{ textAlign: 'center', margin: '30px 0 10px', color: '#4a4a4a' }}>
        Break-Even Point: {breakEvenPoint.toFixed(1)} planes
      </h2>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
        <div style={{ marginRight: '20px', display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#8884d8', marginRight: '5px' }}></div>
          Total Costs
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#82ca9d', marginRight: '5px' }}></div>
          Total Revenue
        </div>
      </div>

      <div style={{ 
        display: 'flex', 
        flexDirection: 'row', 
        flexWrap: 'wrap', 
        gap: '20px'
      }}>
        <div style={{ flex: '1 1 600px' }}>
          <ResponsiveContainer width="100%" height={400}>
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 50, bottom: 25 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="units" 
                label={{ value: 'Units Sold', position: 'insideBottom', offset: -10 }}
                tickFormatter={(value) => Math.round(value)}
              />
              <YAxis label={{ value: 'Amount ($)', angle: -90, position: 'insideLeft', offset: -40 }} />
              <Tooltip />
              <Line type="monotone" dataKey="totalCosts" stroke="#8884d8" name="Total Costs" />
              <Line type="monotone" dataKey="totalRevenue" stroke="#82ca9d" name="Total Revenue" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div style={{ 
          flex: '1 1 200px', 
          backgroundColor: '#f5f5f5', 
          padding: '20px', 
          borderRadius: '8px', 
          fontFamily: 'monospace', 
          whiteSpace: 'pre-wrap'
        }}>
          <h3 style={{ marginTop: 0 }}>Calculations:</h3>
          {`1. Sum the fixed costs:
   ${newPlantCost.toFixed(2)} bn + ${rdCost.toFixed(2)} bn + ${marketingCost.toFixed(3)} bn = ${calculations.fixedCosts?.toFixed(3)} bn

2. Calculate the profit per plane:
   Profit per plane = Selling price - Unit production cost
   ${pricePerPlane} m - ${unitProductionCost} m = ${calculations.profitPerPlane?.toFixed(1)} m

3. Determine the break-even point:
   ${(calculations.fixedCosts * 1000).toFixed(3)} m / ${calculations.profitPerPlane?.toFixed(1)} m = ${calculations.breakEven?.toFixed(3)} planes`}
        </div>
      </div>
    </div>
  );
};

export default BreakEvenCalculator;