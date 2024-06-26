import React, { useState, useEffect, useRef } from "react";

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { CChart } from '@coreui/react-chartjs'

import { io } from 'socket.io-client';
import { ColorType, createChart } from 'lightweight-charts';

function App() {
  const [count, setCount] = useState(0)
  const host = import.meta.env.VITE_APP_SOCKET_URL || 'http://localhost:5500'
  const [areaSeries, setAreaSeries] = useState(null);
  const [dataChart, setDataChart] = useState([
    // { time: '2018-12-22', value: 32.51 },
    // { time: '2018-12-23', value: 31.11 },
    // { time: '2018-12-24', value: 27.02 },
    // { time: '2018-12-25', value: 27.32 },
    // { time: '2018-12-26', value: 25.17 },
    // { time: '2018-12-27', value: 28.89 },
    // { time: '2018-12-28', value: 25.46 },
    // { time: '2018-12-29', value: 23.92 },
    // { time: '2018-12-30', value: 22.68 },
    // { time: '2018-12-31', value: 22.67 },
    // open: 109.87, high: 114.69, low: 85.66, close: 111.26
  ]);

  const socketRef = useRef();
  const chartContainer = useRef();
  const chartOptions = {
    
  };


  useEffect(() => {
    socketRef.current = io(host);
    const chart = createChart(chartContainer.current, {
      width: 800,
      height: 400,
      layout: {
        textColor: '#333', background: { type: 'solid', color: 'transparent', },
      },
      rightPriceScale: {
        visible: false,
      },
      leftPriceScale: {
        visible: true,
        scaleMargins: {
          top: 0.2,
          bottom: 0.2,
        },
        borderVisible: false,
      },
      timeScale: {
        secondsVisible: true,
        timeVisible: true,
      },
      grid: {
        horzLines: {
          color: '#eee',
        },
        vertLines: {
          color: '#ffffff',
        },
      },
    });

    const areaSeries = chart.addAreaSeries({
      topColor: 'rgba(255, 82, 82, 0.56)',
      bottomColor: 'rgba(255, 82, 82, 0.04)',
      lineColor: 'rgba(255, 82, 82, 1)',
      lineWidth: 2,
      symbol: 'AAPL',
    });
    setAreaSeries(areaSeries);

    socketRef.current.on('data', (data) => {
      console.log(data);
      // areaSeries.setData([
      //   ...dataChart,
      //   ...data
      // ]);
      setDataChart(prew => {
        return [
          ...prew,
          ...data
        ]
      });

    });

    socketRef.current.on('disconnect', () => {
      console.log('disconnected');
    });

    return () => {
      socketRef.current.disconnect();
      chart.remove();
    };
  }, []);

  useEffect(() => {
    if (areaSeries && dataChart.length > 0) {
      areaSeries.setData(dataChart);
    }
  }, [dataChart, areaSeries]);



  return (
    <>
      <div style={{ position: 'relative' }}>
        <div style={{ position: 'absolute', }}>

        </div>
        <div ref={chartContainer} style={{ position: 'absolute', backgroundImage: "url('https://upload.wikimedia.org/wikipedia/commons/thumb/b/b5/800x600_Wallpaper_Blue_Sky.png/640px-800x600_Wallpaper_Blue_Sky.png')" }}>

        </div>
      </div>


    </>
  )
}

export default App
